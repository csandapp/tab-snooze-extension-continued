#!/usr/bin/env python3
"""
Basic script to remove comments from JSON files for Chrome extension builds
"""

import re
import json
import sys
from pathlib import Path

def remove_json_comments(content):
    """
    Remove both single-line (//) and multi-line (/* */) comments from JSON content
    """
    # Remove single-line comments
    content = re.sub(r'(?<!:)//.*$', '', content, flags=re.MULTILINE)
    
    # Remove multi-line comments
    content = re.sub(r'/\*[\s\S]*?\*/', '', content)
    
    return content

def clean_manifest(input_file, output_file):
    """
    Clean comments from input file and write to output file
    """
    try:
        # Read the input file
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        print(f"Reading from: {input_file}")
        
        # Remove comments
        cleaned_content = remove_json_comments(content)
        
        # Validate that it's still valid JSON
        try:
            json.loads(cleaned_content)
            print("✓ JSON validation passed")
        except json.JSONDecodeError as e:
            print(f"✗ JSON validation failed: {e}")
            return False
        
        # Write to output file
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(cleaned_content)
        
        print(f"✓ Clean manifest written to: {output_file}")
        return True
        
    except FileNotFoundError:
        print(f"✗ Error: File {input_file} not found")
        return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

if __name__ == "__main__":
    # Default file paths
    input_file = "public/manifest.dev.json"
    output_file = "public/manifest.json"
    
    # Allow command line arguments
    if len(sys.argv) >= 2:
        input_file = sys.argv[1]
    if len(sys.argv) >= 3:
        output_file = sys.argv[2]
    
    success = clean_manifest(input_file, output_file)
    sys.exit(0 if success else 1)