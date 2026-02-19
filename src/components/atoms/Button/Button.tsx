import { cn } from "@/lib/utils";
import {
  Button as ShadcnButton,
  type buttonVariants,
} from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, ...props }: ButtonProps) {
  return (
    <ShadcnButton
      className={cn("min-h-[44px] min-w-[44px]", className)}
      {...props}
    />
  );
}
