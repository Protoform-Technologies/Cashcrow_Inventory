import * as React from "react"

const Label = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={`text-slate-900 text-sm font-semibold block px-1 ${className}`}
        {...props}
    />
))
Label.displayName = "Label"

export { Label }
