import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        available: "bg-success/10 text-success",
        unavailable: "bg-danger/10 text-danger",
        maybe: "bg-warning/10 text-warning",
        default: "bg-neutral-100 text-neutral-600",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  label: string;
  className?: string;
}

export function Badge({ variant, label, className }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>{label}</span>
  );
}

export { badgeVariants };
