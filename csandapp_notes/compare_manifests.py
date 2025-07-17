#!/usr/bin/env python3
"""
Manifest Comparison Tool
Compares two Chrome extension manifest.json files and shows detailed differences
"""

import json
import sys
from typing import Dict, Any, Set, Tuple
from pathlib import Path


class ManifestDiffer:
    def __init__(self):
        self.differences = []
    
    def load_manifest(self, file_path: str) -> Dict[str, Any]:
        """Load and parse a manifest.json file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Error: File '{file_path}' not found")
            sys.exit(1)
        except json.JSONDecodeError as e:
            print(f"Error: Invalid JSON in '{file_path}': {e}")
            sys.exit(1)
    
    def compare_values(self, key: str, val1: Any, val2: Any, path: str = "") -> None:
        """Compare two values and record differences"""
        current_path = f"{path}.{key}" if path else key
        
        if type(val1) != type(val2):
            self.differences.append({
                'type': 'type_change',
                'path': current_path,
                'old_type': type(val1).__name__,
                'new_type': type(val2).__name__,
                'old_value': val1,
                'new_value': val2
            })
            return
        
        if isinstance(val1, dict):
            self.compare_dicts(val1, val2, current_path)
        elif isinstance(val1, list):
            self.compare_lists(val1, val2, current_path)
        elif val1 != val2:
            self.differences.append({
                'type': 'value_change',
                'path': current_path,
                'old_value': val1,
                'new_value': val2
            })
    
    def compare_lists(self, list1: list, list2: list, path: str) -> None:
        """Compare two lists"""
        # Check for added/removed items
        set1 = set(str(item) for item in list1 if not isinstance(item, (dict, list)))
        set2 = set(str(item) for item in list2 if not isinstance(item, (dict, list)))
        
        added = set2 - set1
        removed = set1 - set2
        
        if added:
            for item in added:
                self.differences.append({
                    'type': 'list_addition',
                    'path': path,
                    'added_value': item
                })
        
        if removed:
            for item in removed:
                self.differences.append({
                    'type': 'list_removal',
                    'path': path,
                    'removed_value': item
                })
        
        # For complex items, compare by index if lengths match
        if len(list1) == len(list2):
            for i, (item1, item2) in enumerate(zip(list1, list2)):
                if isinstance(item1, (dict, list)):
                    self.compare_values(f"[{i}]", item1, item2, path)
    
    def compare_dicts(self, dict1: Dict[str, Any], dict2: Dict[str, Any], path: str = "") -> None:
        """Compare two dictionaries recursively"""
        keys1 = set(dict1.keys())
        keys2 = set(dict2.keys())
        
        # Find added and removed keys
        added_keys = keys2 - keys1
        removed_keys = keys1 - keys2
        common_keys = keys1 & keys2
        
        # Record added keys
        for key in added_keys:
            self.differences.append({
                'type': 'addition',
                'path': f"{path}.{key}" if path else key,
                'value': dict2[key]
            })
        
        # Record removed keys
        for key in removed_keys:
            self.differences.append({
                'type': 'removal',
                'path': f"{path}.{key}" if path else key,
                'value': dict1[key]
            })
        
        # Compare common keys
        for key in common_keys:
            self.compare_values(key, dict1[key], dict2[key], path)
    
    def format_value(self, value: Any) -> str:
        """Format a value for display"""
        if isinstance(value, str):
            return f'"{value}"'
        elif isinstance(value, (dict, list)):
            return json.dumps(value, indent=2)
        else:
            return str(value)
    
    def print_differences(self, manifest1_name: str, manifest2_name: str) -> None:
        """Print all differences in a readable format"""
        if not self.differences:
            print("✅ No differences found between the manifests!")
            return
        
        print(f"\n📋 Comparing {manifest1_name} → {manifest2_name}")
        print("=" * 60)
        
        # Group differences by type
        changes_by_type = {}
        for diff in self.differences:
            diff_type = diff['type']
            if diff_type not in changes_by_type:
                changes_by_type[diff_type] = []
            changes_by_type[diff_type].append(diff)
        
        # Print each type of change
        for change_type, changes in changes_by_type.items():
            print(f"\n🔸 {change_type.upper().replace('_', ' ')}:")
            
            for change in changes:
                path = change['path']
                
                if change_type == 'addition':
                    print(f"  + {path}: {self.format_value(change['value'])}")
                
                elif change_type == 'removal':
                    print(f"  - {path}: {self.format_value(change['value'])}")
                
                elif change_type == 'value_change':
                    print(f"  ~ {path}:")
                    print(f"      Old: {self.format_value(change['old_value'])}")
                    print(f"      New: {self.format_value(change['new_value'])}")
                
                elif change_type == 'type_change':
                    print(f"  ~ {path} (type change: {change['old_type']} → {change['new_type']}):")
                    print(f"      Old: {self.format_value(change['old_value'])}")
                    print(f"      New: {self.format_value(change['new_value'])}")
                
                elif change_type == 'list_addition':
                    print(f"  + {path}: added {self.format_value(change['added_value'])}")
                
                elif change_type == 'list_removal':
                    print(f"  - {path}: removed {self.format_value(change['removed_value'])}")
        
        print(f"\n📊 Total differences: {len(self.differences)}")
    
    def get_summary(self) -> Dict[str, int]:
        """Get a summary of differences by type"""
        summary = {}
        for diff in self.differences:
            diff_type = diff['type']
            summary[diff_type] = summary.get(diff_type, 0) + 1
        return summary


def main():
    if len(sys.argv) != 3:
        print("Usage: python manifest_differ.py <manifest1.json> <manifest2.json>")
        print("Example: python manifest_differ.py old_manifest.json new_manifest.json")
        sys.exit(1)
    
    manifest1_path = sys.argv[1]
    manifest2_path = sys.argv[2]
    
    # Validate files exist
    if not Path(manifest1_path).exists():
        print(f"Error: '{manifest1_path}' does not exist")
        sys.exit(1)
    
    if not Path(manifest2_path).exists():
        print(f"Error: '{manifest2_path}' does not exist")
        sys.exit(1)
    
    # Create differ and compare
    differ = ManifestDiffer()
    
    print("🔍 Loading manifests...")
    manifest1 = differ.load_manifest(manifest1_path)
    manifest2 = differ.load_manifest(manifest2_path)
    
    print("⚖️  Comparing manifests...")
    differ.compare_dicts(manifest1, manifest2)
    
    # Print results
    differ.print_differences(Path(manifest1_path).name, Path(manifest2_path).name)
    
    # Print summary
    summary = differ.get_summary()
    if summary:
        print(f"\n📈 Summary by change type:")
        for change_type, count in summary.items():
            print(f"  {change_type.replace('_', ' ').title()}: {count}")


if __name__ == "__main__":
    main()