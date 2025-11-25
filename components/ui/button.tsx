import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 shadow-btn",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-btn-hover",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-btn-hover",
        outline:
          "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-btn-hover",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "btn-gradient-primary text-white hover:shadow-btn-hover",
        success: "bg-success text-white hover:bg-success/90 hover:shadow-btn-hover",
        warning: "bg-warning text-white hover:bg-warning/90 hover:shadow-btn-hover",
        info: "bg-info text-white hover:bg-info/90 hover:shadow-btn-hover",
        dark: "bg-dark text-white hover:bg-dark/90 hover:shadow-btn-hover",
        pulse: "bg-destructive text-white hover:bg-destructive/90 hover:shadow-btn-hover btn-pulse",
      },
      size: {
        default: "h-10 px-6 py-3",
        sm: "h-9 rounded-md px-4 py-2 text-sm",
        lg: "h-12 rounded-lg px-8 py-4 text-lg",
        icon: "h-10 w-10",
        circle: "h-12 w-12 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), "transition-all duration-200 hover-lift")}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };