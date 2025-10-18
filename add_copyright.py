#!/usr/bin/env python3
"""
Add copyright headers to all Python files
The Christman AI Project Protection Script
"""
import os
from pathlib import Path

COPYRIGHT_HEADER = '''"""
Copyright (C) 2024 Everett N. Christman / The Christman AI Project
All Rights Reserved.

PROPRIETARY AND CONFIDENTIAL

This file is part of The Christman AI Project and contains proprietary
technology and trade secrets. Unauthorized copying, distribution, modification,
public display, or public performance of this file, via any medium, is strictly
prohibited.

No license is granted to any person or entity. All rights are reserved by
Everett N. Christman and The Christman AI Project.

For licensing inquiries: contact@christmanai.com
"""

'''

def add_copyright_to_file(filepath):
    """Add copyright header to a Python file if not already present"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip if already has copyright
        if 'Copyright (C) 2024 Everett N. Christman' in content:
            return False
        
        # Add copyright header
        new_content = COPYRIGHT_HEADER + content
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        return True
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    count = 0
    for root, dirs, files in os.walk('.'):
        # Skip venv, node_modules, __pycache__
        dirs[:] = [d for d in dirs if d not in ['venv', 'node_modules', '__pycache__', '.git', 'env', '.venv']]
        
        for file in files:
            if file.endswith('.py'):
                filepath = os.path.join(root, file)
                if add_copyright_to_file(filepath):
                    count += 1
                    print(f"✅ {filepath}")
    
    print(f"\n🔒 Protected {count} Python files")

if __name__ == '__main__':
    main()
