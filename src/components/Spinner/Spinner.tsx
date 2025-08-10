import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const spinnerVariants = cva("animate-spin rounded-full border-solid border-current border-r-transparent", {
  variants: {
    size: {
      sm: "h-4 w-4 border-2",
      default: "h-6 w-6 border-2",
      lg: "h-8 w-8 border-2",
      xl: "h-12 w-12 border-4",
    },
    variant: {
      default: "text-gray-600",
      primary: "text-teal-600",
      secondary: "text-gray-400",
      white: "text-white",
      success: "text-green-600",
      warning: "text-yellow-600",
      error: "text-red-600",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
})

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof spinnerVariants> {
  label?: string
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, label = "Loading...", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(spinnerVariants({ size, variant, className }))}
        role="status"
        aria-label={label}
        {...props}
      >
        <span className="sr-only">{label}</span>
      </div>
    )
  },
)
Spinner.displayName = "Spinner"

export { Spinner, spinnerVariants }
