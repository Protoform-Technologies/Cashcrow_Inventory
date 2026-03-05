import * as React from "react"
import { LucideIcon } from "lucide-react"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: LucideIcon
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, icon: Icon, ...props }, ref) => {
        return (
            <div className="relative group w-full">
                {Icon && (
                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-cashcrow-textmuted)] group-focus-within:text-[var(--color-cashcrow-primary)] transition-colors pointer-events-none" />
                )}
                <input
                    type={type}
                    className={`
            w-full bg-white border border-slate-200 rounded-lg py-4 
            ${Icon ? 'pl-12' : 'pl-4'} pr-4 text-slate-900 placeholder:text-[var(--color-cashcrow-textmuted)]/50 
            focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] 
            transition-all duration-200 outline-none
            ${className}
          `}
                    ref={ref}
                    {...props}
                />
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
