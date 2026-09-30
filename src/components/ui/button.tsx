import * as React from "react"

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-sm"

const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-lightgreen)] text-white shadow-lg shadow-[var(--color-cashcrow-primary)]/10",
    secondary: "bg-[var(--color-cashcrow-secondary)] hover:bg-[var(--color-cashcrow-accent)] text-[var(--color-cashcrow-primary)]",
    outline: "border border-[var(--color-cashcrow-accent)] bg-transparent hover:bg-[var(--color-cashcrow-secondary)] text-[var(--color-cashcrow-primary)]",
    ghost: "bg-transparent hover:bg-[var(--color-cashcrow-secondary)] text-[var(--color-cashcrow-primary)] shadow-none",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/10",
}

// Existing size scale kept intact so we don't shift every button in the app.
const sizeStyles: Record<ButtonSize, string> = {
    sm: "h-9 px-3 text-xs",
    md: "h-12 px-6 text-sm",
    lg: "h-14 px-8 text-base",
}

export interface ButtonStyleOptions {
    variant?: ButtonVariant
    size?: ButtonSize
    fullWidth?: boolean
    className?: string
}

/**
 * Returns the composed Button class string. Use this to make a non-<button>
 * element (e.g. a Next.js <Link>) look exactly like a Button, so links and
 * buttons stay visually consistent:
 *
 *   <Link href="/x" className={buttonStyles({ variant: 'primary', fullWidth: true })}>
 */
export function buttonStyles({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
}: ButtonStyleOptions = {}): string {
    return [
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ')
}

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    size?: ButtonSize
    fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth = false, ...props }, ref) => (
        <button
            ref={ref}
            className={buttonStyles({ variant, size, fullWidth, className })}
            {...props}
        />
    )
)
Button.displayName = "Button"

export { Button }
