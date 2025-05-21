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
