import * as React from "react"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-sm"

        const variants = {
            primary: "bg-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-lightgreen)] text-white shadow-lg shadow-[var(--color-cashcrow-primary)]/10",
            secondary: "bg-[var(--color-cashcrow-secondary)] hover:bg-[var(--color-cashcrow-accent)] text-[var(--color-cashcrow-primary)]",
            outline: "border border-[var(--color-cashcrow-accent)] bg-transparent hover:bg-[var(--color-cashcrow-secondary)] text-[var(--color-cashcrow-primary)]",
            ghost: "bg-transparent hover:bg-[var(--color-cashcrow-secondary)] text-[var(--color-cashcrow-primary)] shadow-none"
        }

        const sizes = {
            sm: "h-9 px-3 text-xs",
            md: "h-12 px-6 text-sm",
            lg: "h-14 px-8 text-base"
        }

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
