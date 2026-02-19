import { cn } from "@/lib/utils";
import {
  Card as ShadcnCard,
  CardHeader as ShadcnCardHeader,
  CardContent as ShadcnCardContent,
  CardFooter as ShadcnCardFooter,
  CardTitle as ShadcnCardTitle,
  CardDescription as ShadcnCardDescription,
} from "@/components/ui/card";

interface CardProps extends React.ComponentProps<"div"> {
  className?: string;
}

export function Card({ className, ...props }: CardProps) {
  return <ShadcnCard className={cn("p-4", className)} {...props} />;
}

export function CardHeader({ className, ...props }: CardProps) {
  return <ShadcnCardHeader className={className} {...props} />;
}

export function CardContent({ className, ...props }: CardProps) {
  return <ShadcnCardContent className={className} {...props} />;
}

export function CardFooter({ className, ...props }: CardProps) {
  return <ShadcnCardFooter className={className} {...props} />;
}

export function CardTitle({ className, ...props }: CardProps) {
  return <ShadcnCardTitle className={className} {...props} />;
}

export function CardDescription({ className, ...props }: CardProps) {
  return <ShadcnCardDescription className={className} {...props} />;
}
