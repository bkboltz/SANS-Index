"""
Local SLM Neural Index Curation Engine
Supports dynamic local model selection (0.5B, 1.5B, 3B), cache status checking, and on-demand model downloading.
"""

import sys
import os
import json
import argparse
import re
from collections import defaultdict
import subprocess

os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

MODEL_MAP = {
    "0.5b": "Qwen/Qwen2.5-0.5B-Instruct",
    "1.5b": "Qwen/Qwen2.5-1.5B-Instruct",
    "3b": "Qwen/Qwen2.5-3B-Instruct"
}

def ensure_slm_dependencies():
    packages = {
        'nltk': 'nltk',
        'wordfreq': 'wordfreq',
        'pdfminer': 'pdfminer.six',
        'transformers': 'transformers',
        'torch': 'torch',
        'huggingface_hub': 'huggingface_hub'
    }
    missing = []
    for mod, pkg in packages.items():
        try:
            __import__(mod)
        except ImportError:
            missing.append(pkg)
    if missing:
        print(f"[+] Auto-installing missing SLM engine packages: {', '.join(missing)}...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", *missing])
        except Exception as e:
            print(f"[-] Installation warning: {e}")

ensure_slm_dependencies()

import nltk
import ssl

try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

try:
    nltk.download('averaged_perceptron_tagger_eng', quiet=True)
    nltk.download('averaged_perceptron_tagger', quiet=True)
    nltk.download('words', quiet=True)
except Exception:
    pass

from wordfreq import zipf_frequency

STOP_WORDS = {
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', "aren't",
    'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', "can't",
    'cannot', 'could', "couldn't", 'did', "didn't", 'do', 'does', "doesn't", 'doing', "don't", 'down', 'during',
    'each', 'few', 'for', 'from', 'further', 'had', "hadn't", 'has', "hasn't", 'have', "haven't", 'having', 'he',
    "he'd", "he'll", "he's", 'her', 'here', "here's", 'hers', 'herself', 'him', 'himself', 'his', 'how', "how's",
    'i', "i'd", "i'll", "i'm", "i've", 'if', 'in', 'into', 'is', "isn't", 'it', "it's", 'its', 'itself', "let's",
    'me', 'more', 'most', "mustn't", 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
    'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', "shan't", 'she', "she'd", "she'll",
    "she's", 'should', "shouldn't", 'so', 'some', 'such', 'than', 'that', "that's", 'the', 'their', 'theirs', 'them',
    'themselves', 'then', 'there', "there's", 'these', 'they', "they'd", "they'll", "they're", "they've", 'this',
    'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', "wasn't", 'we', "we'd", "we'll", "we're",
    "we've", 'were', "weren't", 'what', "what's", 'when', "when's", 'where', "where's", 'which', 'while', 'who',
    "who's", 'whom', 'why', "why's", 'with', "won't", 'would', "wouldn't", 'you', "you'd", "you'll", "you're",
    "you've", 'your', 'yours', 'yourself', 'yourselves'
}

def parse_pages_str(pages_str):
    if not pages_str:
        return []
    parts = [p.strip() for p in str(pages_str).split(',') if p.strip()]
    return parts

def combine_pages_list(pages_list):
    all_pages = []
    for p in pages_list:
        all_pages.extend(parse_pages_str(p))
    seen = set()
    unique_pages = []
    for page in all_pages:
        if page not in seen:
            seen.add(page)
            unique_pages.append(page)
    return ", ".join(unique_pages)

def is_valid_candidate(term):
    t_clean = term.strip()
    if not t_clean or t_clean.isdigit() or len(t_clean) <= 1:
        return False
    if t_clean.lower() in STOP_WORDS:
        return False
    return True

def clean_model_json(text):
    if not text:
        return []
    text = text.strip()
    text = re.sub(r'^```(?:json)?\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\s*```$', '', text, flags=re.IGNORECASE)
    match = re.search(r'\[.*\]', text, re.DOTALL)
    if match:
        try:
            val = json.loads(match.group(0))
            if isinstance(val, list):
                return [str(item) for item in val]
        except Exception:
            pass
    quoted = re.findall(r'"([^"]+)"', text)
    return quoted if quoted else []

def resolve_model_name(key_or_name):
    key = str(key_or_name).lower().strip()
    return MODEL_MAP.get(key, key_or_name)

def is_model_downloaded(model_name):
    try:
        from huggingface_hub import try_to_load_from_cache
        res = try_to_load_from_cache(repo_id=model_name, filename="config.json")
        return isinstance(res, str) and os.path.exists(res)
    except Exception:
        return False

# Initialize Local Neural SLM Model
local_model = None
local_tokenizer = None
current_model_name = None

def load_neural_slm(model_name):
    global local_model, local_tokenizer, current_model_name
    current_model_name = model_name
    try:
        from transformers import AutoModelForCausalLM, AutoTokenizer
        import torch
        print(f"[+] Loading Local Neural SLM ({model_name})...")
        local_tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
        local_model = AutoModelForCausalLM.from_pretrained(
            model_name,
            dtype=torch.float32,
            device_map="auto" if torch.cuda.is_available() else None,
            trust_remote_code=True
        )
        print(f"[+] Local Neural SLM ({model_name}) successfully loaded!")
        return True
    except Exception as e:
        print(f"[-] Could not load neural SLM model ({e}). Using local NLP fast curator.")
        return False

def neural_filter_batch(batch_terms):
    if not local_model or not local_tokenizer:
        return batch_terms

    try:
        import torch
        topics_list = [item["topic"] for item in batch_terms]
        prompt = (
            "<|im_start|>system\nYou are a SANS Cybersecurity course index curator. "
            "Review candidate terms. Select ONLY items that are specific technical security concepts, software tools, network protocols, commands, or registry paths. "
            "REJECT generic non-technical words and textbook section titles (e.g. 'example', 'overview', 'chapter', 'figure', 'following steps', 'system configuration', 'basic concept', 'main feature', 'additional information'). "
            "Return a valid JSON array of kept strings.<|im_end|>\n"
            f"<|im_start|>user\nCandidate terms:\n{json.dumps(topics_list)}\n<|im_end|>\n"
            "<|im_start|>assistant\n"
        )

        inputs = local_tokenizer(prompt, return_tensors="pt")
        with torch.no_grad():
            outputs = local_model.generate(
                **inputs,
                max_new_tokens=384,
                do_sample=False,
                pad_token_id=local_tokenizer.eos_token_id
            )

        gen_text = local_tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True)
        kept_terms = clean_model_json(gen_text)
        kept_set_lower = {k.lower().strip() for k in kept_terms}

        filtered_batch = [item for item in batch_terms if item["topic"].lower().strip() in kept_set_lower]
        return filtered_batch
    except Exception as e:
        print(f"[-] Neural batch evaluation error: {e}")

    return batch_terms

def curate_terms_local_slm(input_entries, model_name):
    print(f"[+] Local SLM Curation Engine ({model_name}) starting for {len(input_entries)} candidate terms...")

    candidates = [item for item in input_entries if is_valid_candidate(item.get("topic", ""))]

    has_neural_model = load_neural_slm(model_name)

    curated_candidates = []
    if has_neural_model and len(candidates) > 0:
        batch_size = 15
        print(f"[+] Processing {len(candidates)} candidates through Neural SLM in batches of {batch_size}...")
        for i in range(0, len(candidates), batch_size):
            batch = candidates[i:i + batch_size]
            filtered_batch = neural_filter_batch(batch)
            curated_candidates.extend(filtered_batch)
            print(f"    Batch {i // batch_size + 1}/{(len(candidates) + batch_size - 1) // batch_size}: {len(batch)} -> {len(filtered_batch)} terms")
    else:
        for item in candidates:
            topic = item.get("topic", "").strip()
            word_parts = topic.lower().split()
            if len(word_parts) == 1 and zipf_frequency(word_parts[0], 'en') > 5.1:
                continue
            curated_candidates.append(item)

    grouped_terms = defaultdict(list)
    term_casing_map = {}

    for item in curated_candidates:
        topic = item.get("topic", "").strip()
        pages = item.get("pages", "").strip()
        norm_key = topic.lower()

        if norm_key not in term_casing_map:
            term_casing_map[norm_key] = topic
        else:
            existing = term_casing_map[norm_key]
            if any(c.isupper() for c in topic) and not any(c.isupper() for c in existing):
                term_casing_map[norm_key] = topic

        if pages:
            grouped_terms[norm_key].append(pages)

    curated_list = []
    for norm_key in sorted(grouped_terms.keys()):
        display_topic = term_casing_map[norm_key]
        combined_pages = combine_pages_list(grouped_terms[norm_key])
        curated_list.append({
            "topic": display_topic,
            "pages": combined_pages,
            "notes": "",
            "source": "auto-slm"
        })

    print(f"[+] Local SLM Curation completed: {len(curated_list)} curated terms retained from {len(input_entries)} candidates.")
    return curated_list

def main():
    parser = argparse.ArgumentParser(description="Local SLM Neural Index Curation Engine")
    parser.add_argument("input_json", nargs="?", help="Path to input candidate terms JSON file")
    parser.add_argument("output_json", nargs="?", help="Path where curated JSON file will be written")
    parser.add_argument("--model", default="0.5b", help="Model key or repo name (0.5b, 1.5b, 3b)")
    parser.add_argument("--check-downloaded", action="store_true", help="Check if model is downloaded locally")
    parser.add_argument("--download-only", action="store_true", help="Pre-download and cache model weights")
    args = parser.parse_args()

    model_name = resolve_model_name(args.model)

    if args.check_downloaded:
        downloaded = is_model_downloaded(model_name)
        print(json.dumps({"model": model_name, "downloaded": downloaded}))
        sys.exit(0)

    if args.download_only:
        print(f"[+] Downloading model weights for {model_name}...")
        success = load_neural_slm(model_name)
        if success:
            print(f"[+] Model {model_name} successfully downloaded and cached!")
            sys.exit(0)
        else:
            print(f"[-] Failed to download model {model_name}")
            sys.exit(1)

    if not args.input_json or not args.output_json:
        print("[-] Missing input_json or output_json arguments.")
        sys.exit(1)

    if not os.path.exists(args.input_json):
        print(f"[-] Input file not found: {args.input_json}")
        sys.exit(1)

    with open(args.input_json, "r", encoding="utf-8") as f:
        input_entries = json.load(f)

    curated = curate_terms_local_slm(input_entries, model_name)

    with open(args.output_json, "w", encoding="utf-8") as f:
        json.dump(curated, f, indent=2, ensure_ascii=False)

    print(f"[+] Output successfully written to: {args.output_json}")

if __name__ == "__main__":
    main()
