#!/bin/bash

# Targeted TypeScript License Header Addition
# Only processes source files in server/, client/, and shared/ directories
# HIPAA-compliant implementation

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

echo "🛡️ Adding HIPAA-compliant copyright headers to source TypeScript files..."

# Only process source directories, exclude node_modules, dist, etc.
find /workspaces/Inferno/server -name "*.ts" -o -name "*.tsx" > /tmp/ts_files.txt
find /workspaces/Inferno/client -name "*.ts" -o -name "*.tsx" >> /tmp/ts_files.txt
find /workspaces/Inferno/shared -name "*.ts" -o -name "*.tsx" 2>/dev/null >> /tmp/ts_files.txt || true

# Add any root-level config files
echo "/workspaces/Inferno/vite.config.ts" >> /tmp/ts_files.txt
echo "/workspaces/Inferno/tailwind.config.ts" >> /tmp/ts_files.txt
echo "/workspaces/Inferno/drizzle.config.ts" >> /tmp/ts_files.txt

FILE_COUNT=0
UPDATED_COUNT=0

while read -r file; do
    if [[ -f "$file" ]]; then
        FILE_COUNT=$((FILE_COUNT + 1))
        
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
            
            UPDATED_COUNT=$((UPDATED_COUNT + 1))
        else
            echo "⏭️  Header already exists: $file"
        fi
    fi
done < /tmp/ts_files.txt

# Cleanup
rm -f /tmp/ts_files.txt

echo ""
echo "📊 Summary:"
echo "   📁 Files processed: $FILE_COUNT"
echo "   ✅ Files updated: $UPDATED_COUNT"
echo "   ⏭️  Files skipped: $((FILE_COUNT - UPDATED_COUNT))"
echo ""
echo "🔥 TypeScript source files now properly licensed!"
echo "🛡️ Ready for HIPAA-compliant commit!"