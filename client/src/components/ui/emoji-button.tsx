/*
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


import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmojiButtonProps {
  emoji: string;
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function EmojiButton({ emoji, label, isSelected = false, onClick }: EmojiButtonProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "flex flex-col items-center p-3 rounded-lg border text-center h-auto w-full", 
        isSelected ? "border-primary-200 bg-primary-50" : "border-neutral-200 hover:bg-neutral-50"
      )}
      onClick={onClick}
    >
      <span className="text-2xl mb-1">{emoji}</span>
      <span className="text-xs text-neutral-600">{label}</span>
    </Button>
  );
}
