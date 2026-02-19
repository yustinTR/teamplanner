import { cn } from "@/lib/utils";
import { Input as ShadcnInput } from "@/components/ui/input";

interface InputProps extends React.ComponentProps<"input"> {
  className?: string;
}

export function Input({ className, ...props }: InputProps) {
  return (
    <ShadcnInput
      className={cn("min-h-[44px]", className)}
      {...props}
    />
  );
}
