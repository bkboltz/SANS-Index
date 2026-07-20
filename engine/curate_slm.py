"""
Local 0.5B SLM Neural Index Curation Engine
Uses Qwen2.5-0.5B-Instruct neural model locally to evaluate and curate index terms,
filtering out non-technical words, verbs, and generic concepts while merging duplicates.
"""

import sys
import os
import json
import argparse
import re
from collections import defaultdict
import subprocess

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

from nltk.corpus import words as nltk_words
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

os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

# Initialize Local Neural SLM Model
MODEL_REF = "Qwen/Qwen2.5-0.5B-Instruct"
local_model = None
local_tokenizer = None

def load_neural_slm():
    global local_model, local_tokenizer
    try:
        from transformers import AutoModelForCausalLM, AutoTokenizer
        import torch
        print(f"[+] Loading Local 0.5B Neural SLM ({MODEL_REF})...")
        local_tokenizer = AutoTokenizer.from_pretrained(MODEL_REF, trust_remote_code=True)
        local_model = AutoModelForCausalLM.from_pretrained(
            MODEL_REF,
            dtype=torch.float32,
            device_map="auto" if torch.cuda.is_available() else None,
            trust_remote_code=True
        )
        print(f"[+] Local 0.5B Neural SLM successfully loaded!")
        return True
    except Exception as e:
        print(f"[-] Could not load neural SLM model ({e}). Using local NLP fast curator.")
        return False

def neural_filter_batch(batch_terms):
    """
    Run local Qwen2.5-0.5B-Instruct neural evaluation on a batch of candidate terms.
    """
    if not local_model or not local_tokenizer:
        return batch_terms

    try:
        import torch
        topics_list = [item["topic"] for item in batch_terms]
        prompt = (
            "<|im_start|>system\nYou are a cybersecurity course index curator. "
            "Filter the list of candidate terms. Keep ONLY distinct technical terms, tools, protocols, commands, security concepts, registry paths, or file extensions. "
            "Filter out generic non-technical English words (e.g. 'think', 'figure', 'example', 'different', 'process', 'page', 'user', 'file'). "
            "Return JSON array of kept strings.<|im_end|>\n"
            f"<|im_start|>user\nCandidate terms:\n{json.dumps(topics_list)}\n<|im_end|>\n"
            "<|im_start|>assistant\n["
        )

        inputs = local_tokenizer(prompt, return_tensors="pt")
        with torch.no_grad():
            outputs = local_model.generate(
                **inputs,
                max_new_tokens=512,
                do_sample=False,
                pad_token_id=local_tokenizer.eos_token_id
            )

        gen_text = local_tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True)
        full_text = "[" + gen_text.strip()
        
        kept_set = set()
        match = re.search(r'\[.*?\]', full_text, re.DOTALL)
        if match:
            try:
                kept_set = set(json.loads(match.group(0)))
            except Exception:
                pass

        if not kept_set:
            # Fallback regex string extraction for quoted terms in model output
            quoted = re.findall(r'"([^"]+)"', full_text)
            if quoted:
                kept_set = set(quoted)

        if kept_set:
            kept_set_lower = {k.lower().strip() for k in kept_set}
            filtered = [item for item in batch_terms if item["topic"].lower().strip() in kept_set_lower]
            if filtered:
                return filtered
    except Exception as e:
        print(f"[-] Neural batch evaluation error: {e}")

    return batch_terms

def curate_terms_local_slm(input_entries):
    print(f"[+] Local 0.5B SLM Curation Engine starting for {len(input_entries)} candidate terms...")

    # Filter invalid candidates & group by normalized term
    candidates = [item for item in input_entries if is_valid_candidate(item.get("topic", ""))]

    # Load neural SLM model if available
    has_neural_model = load_neural_slm()

    curated_candidates = []
    if has_neural_model and len(candidates) > 0:
        batch_size = 40
        print(f"[+] Processing {len(candidates)} candidates through Neural SLM in batches of {batch_size}...")
        for i in range(0, len(candidates), batch_size):
            batch = candidates[i:i + batch_size]
            filtered_batch = neural_filter_batch(batch)
            curated_candidates.extend(filtered_batch)
            print(f"    Batch {i // batch_size + 1}/{(len(candidates) + batch_size - 1) // batch_size}: {len(batch)} -> {len(filtered_batch)} terms")
    else:
        # Fast NLP Zipf frequency filter
        for item in candidates:
            topic = item.get("topic", "").strip()
            word_parts = topic.lower().split()
            if len(word_parts) == 1 and zipf_frequency(word_parts[0], 'en') > 5.1:
                continue
            curated_candidates.append(item)

    # Group and merge casing / page numbers
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
    parser = argparse.ArgumentParser(description="Local 0.5B SLM Neural Index Curation Engine")
    parser.add_argument("input_json", help="Path to input candidate terms JSON file")
    parser.add_argument("output_json", help="Path where curated JSON file will be written")
    args = parser.parse_args()

    if not os.path.exists(args.input_json):
        print(f"[-] Input file not found: {args.input_json}")
        sys.exit(1)

    with open(args.input_json, "r", encoding="utf-8") as f:
        input_entries = json.load(f)

    curated = curate_terms_local_slm(input_entries)

    with open(args.output_json, "w", encoding="utf-8") as f:
        json.dump(curated, f, indent=2, ensure_ascii=False)

    print(f"[+] Output successfully written to: {args.output_json}")

if __name__ == "__main__":
    main()
