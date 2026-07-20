"""
Local SLM Neural Index Curation Engine
Supports dynamic local model selection (0.5B, 1.5B, 3B), custom system prompts, cache status checking, and on-demand model downloading.
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

DEFAULT_SYSTEM_PROMPT = (
    "You are a strict SANS Cybersecurity Course Index Curator.\n"
    "Your sole task is to filter candidate index terms extracted from course materials and KEEP ONLY genuine technical cybersecurity concepts.\n\n"
    "### INCLUSION CRITERIA (KEEP):\n"
    "- Cybersecurity tools, utilities, and software (e.g., Nmap, Wireshark, Mimikatz, Metasploit, Volatility, Sysmon, Snort, Tcpdump)\n"
    "- Protocols, network standards, and acronyms (e.g., Kerberos, BGP, IPsec, TLS 1.3, DNSSEC, SNMPv3, ARP, SMBv3)\n"
    "- Operating system commands, parameters, and flags (e.g., chmod 755, netstat -an, reg add, vssadmin, ps -ef, ls -la)\n"
    "- System artifacts, registry keys, and file paths (e.g., HKLM\\Software, MFT, NTFS, SAM database, Event ID 4624, Prefetch)\n"
    "- Attack vectors, vulnerability classes, and malware terms (e.g., Pass-the-Hash, SQL Injection, XSS, Golden Ticket, Buffer Overflow)\n"
    "- Security frameworks, standards, and laws (e.g., NIST SP 800-53, ISO 27001, MITRE ATT&CK, CIS Controls, HIPAA)\n\n"
    "### EXCLUSION CRITERIA (REJECT / DROP):\n"
    "- Generic textbook headings, section titles, and page markers (e.g., Overview, Introduction, Summary, Discussion, Chapter 1, Figure 2.3, Table of Contents)\n"
    "- Non-technical English words or generic meta-phrases (e.g., Following Steps, Basic Concept, Main Features, System Configuration, Important Note, Additional Information, Key Takeaway, Best Practices, Module Summary)\n"
    "- Standalone generic English words unless part of a technical phrase (e.g., reject 'system', 'process', 'method', 'data', 'user' alone; keep 'Access Control List' or 'System Call')\n\n"
    "### FEW-SHOT EXAMPLES:\n"
    'Input: ["Nmap", "Overview of Chapter 2", "Kerberos Authentication", "Following Steps", "Mimikatz", "Basic Concept", "Event ID 4624", "Summary Table"]\n'
    'Output: ["Nmap", "Kerberos Authentication", "Mimikatz", "Event ID 4624"]\n\n'
    "Output ONLY a raw JSON array of strings containing the kept terms. Do NOT include any markdown code fences, preambles, or conversational commentary."
)

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
        device_str = "CUDA (GPU)" if torch.cuda.is_available() else "CPU"
        print(f"[VERIFICATION] Initiating Local Model Load: '{model_name}'")
        print(f"[VERIFICATION] System Execution Compute Device: {device_str}")
        
        local_tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
        local_model = AutoModelForCausalLM.from_pretrained(
            model_name,
            dtype=torch.float32,
            device_map="auto" if torch.cuda.is_available() else None,
            trust_remote_code=True
        )
        print(f"[VERIFICATION] SUCCESS: Active Neural Model '{model_name}' loaded in RAM/VRAM!")
        return True
    except Exception as e:
        print(f"[-] Could not load neural SLM model '{model_name}' ({e}). Falling back to local NLP fast curator.")
        return False

def neural_filter_batch(batch_terms, system_prompt):
    if not local_model or not local_tokenizer:
        return batch_terms

    try:
        import torch
        topics_list = [item["topic"] for item in batch_terms]
        prompt = (
            f"<|im_start|>system\n{system_prompt}<|im_end|>\n"
            f"<|im_start|>user\nCandidate terms list:\n{json.dumps(topics_list)}\n<|im_end|>\n"
            "<|im_start|>assistant\n"
        )

        inputs = local_tokenizer(prompt, return_tensors="pt")
        with torch.no_grad():
            outputs = local_model.generate(
                **inputs,
                max_new_tokens=450,
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

def curate_terms_local_slm(input_entries, model_name, system_prompt):
    print(f"[VERIFICATION] Local SLM Curation Engine started.")
    print(f"[VERIFICATION] Active Model Target: {model_name}")
    print(f"[VERIFICATION] System Prompt Length: {len(system_prompt)} characters")

    candidates = [item for item in input_entries if is_valid_candidate(item.get("topic", ""))]

    has_neural_model = load_neural_slm(model_name)

    curated_candidates = []
    if has_neural_model and len(candidates) > 0:
        batch_size = 15
        total_batches = (len(candidates) + batch_size - 1) // batch_size
        print(f"[+] Processing {len(candidates)} candidates through Neural SLM ({model_name}) in {total_batches} batches...")
        for i in range(0, len(candidates), batch_size):
            batch = candidates[i:i + batch_size]
            filtered_batch = neural_filter_batch(batch, system_prompt)
            curated_candidates.extend(filtered_batch)
            print(f"    Batch {i // batch_size + 1}/{total_batches}: {len(batch)} -> {len(filtered_batch)} terms kept")
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
            "source": f"auto-slm-{model_name}"
        })

    print(f"[VERIFICATION] Curation completed using model '{model_name}': {len(curated_list)} curated terms retained from {len(input_entries)} candidate terms.")
    return curated_list

def main():
    parser = argparse.ArgumentParser(description="Local SLM Neural Index Curation Engine")
    parser.add_argument("input_json", nargs="?", help="Path to input candidate terms JSON file")
    parser.add_argument("output_json", nargs="?", help="Path where curated JSON file will be written")
    parser.add_argument("--model", default="0.5b", help="Model key or repo name (0.5b, 1.5b, 3b)")
    parser.add_argument("--custom-prompt", default=None, help="Custom system prompt for local SLM curation")
    parser.add_argument("--check-downloaded", action="store_true", help="Check if model is downloaded locally")
    parser.add_argument("--download-only", action="store_true", help="Pre-download and cache model weights")
    args = parser.parse_args()

    model_name = resolve_model_name(args.model)

    if args.check_downloaded:
        downloaded = is_model_downloaded(model_name)
        print(json.dumps({"model": model_name, "downloaded": downloaded}))
        sys.exit(0)

    if args.download_only:
        print(f"[VERIFICATION] Downloading model weights for '{model_name}'...")
        success = load_neural_slm(model_name)
        if success:
            print(f"[VERIFICATION] SUCCESS: Model '{model_name}' downloaded and cached!")
            sys.exit(0)
        else:
            print(f"[-] Failed to download model '{model_name}'")
            sys.exit(1)

    if not args.input_json or not args.output_json:
        print("[-] Missing input_json or output_json arguments.")
        sys.exit(1)

    if not os.path.exists(args.input_json):
        print(f"[-] Input file not found: {args.input_json}")
        sys.exit(1)

    with open(args.input_json, "r", encoding="utf-8") as f:
        input_entries = json.load(f)

    system_prompt = args.custom_prompt if (args.custom_prompt and args.custom_prompt.strip()) else DEFAULT_SYSTEM_PROMPT

    curated = curate_terms_local_slm(input_entries, model_name, system_prompt)

    with open(args.output_json, "w", encoding="utf-8") as f:
        json.dump(curated, f, indent=2, ensure_ascii=False)

    print(f"[+] Output successfully written to: {args.output_json}")

if __name__ == "__main__":
    main()
