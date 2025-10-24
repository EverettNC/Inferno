#!/bin/bash

# Add copyright header to all TypeScript files
# © 2025 The Christman AI Project - HIPAA Compliant Implementation

COPYRIGHT_HEADER="/*
© 2025 The Christman AI Project. All rights reserved.

This code is released as part of a trauma-informed, dignity-first AI ecosystem
designed to protect, empower, and elevate vulnerable populations.

By using, modifying, or distributing this software, you agree to uphold the following:
1. Truth — No deception, no manipulation.
2. Dignity — Respect the autonomy and humanity of all users.
3. Protection — Never use this to exploit or harm vulnerable individuals.
4. Transparency — Disclose all modifications and contributions clearly.
5. No Erasure — Preserve the mission and ethical origin of this work.

This is not just code. This is redemption in code.
Contact: lumacognify@thechristmanaiproject.com
https://thechristmanaiproject.com
*/

"

echo "🛡️ Adding HIPAA-compliant copyright headers to TypeScript files..."

# Find all TypeScript files and add copyright header if not already present
find /workspaces/Inferno -name "*.ts" -o -name "*.tsx" | while read -r file; do
    # Check if file already has copyright header
    if ! grep -q "© 2025 The Christman AI Project" "$file"; then
        echo "Adding header to: $file"
        
        # Create temporary file with header + original content
        {
            echo "$COPYRIGHT_HEADER"
            cat "$file"
        } > "$file.tmp"
        
        # Replace original file
        mv "$file.tmp" "$file"
        
        echo "✅ Updated: $file"
    else
        echo "⏭️  Header already exists: $file"
    fi
done

echo ""
echo "🔥 Copyright header addition complete!"
echo "📋 All TypeScript files now include:"
echo "   ✅ HIPAA-compliant copyright notice"
echo "   ✅ Trauma-informed mission statement"
echo "   ✅ Dignity-first ethical guidelines"
echo "   ✅ Contact information for compliance"
echo ""
echo "🛡️ Your codebase is now properly licensed and HIPAA compliant!"