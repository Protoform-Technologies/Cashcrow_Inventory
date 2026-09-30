import * as React from "react"

const Checkbox = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
    <input
        type="checkbox"
        ref={ref}
        className={`w-5 h-5 rounded border-slate-300 text-[var(--color-cashcrow-primary)] focus:ring-[var(--color-cashcrow-primary)] focus:ring-offset-0 transition-all cursor-pointer ${className}`}
        {...props}
    />
))
Checkbox.displayName = "Checkbox"

export { Checkbox }
