import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Send an onboarding email to a new laboratory member
 */
export async function sendOnboardingEmail(email: string, firstName: string, lastName: string) {
    const fromEmail = process.env.EMAIL || 'onboarding@resend.dev'
    const fullName = `${firstName} ${lastName}`

    try {
        const { data, error } = await resend.emails.send({
            from: `Cashcrow Inventory <${fromEmail}>`,
            to: [email],
            subject: 'Welcome to Cashcrow Inventory',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #265136; margin: 0;">Cashcrow</h1>
                        <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Laboratory Inventory Management</p>
                    </div>
                    
                    <h2 style="color: #0f172a; margin-top: 0;">Welcome to the Team, ${firstName}!</h2>
                    <p style="color: #334155; line-height: 1.6;">Your laboratory account has been successfully created. You can now log in to manage parts, suppliers, and inventory movements.</p>
                    
                    <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 24px 0;">
                        <p style="margin: 0; font-size: 14px; color: #64748b;">Login Credentials:</p>
                        <p style="margin: 8px 0 0 0; font-size: 16px; color: #0f172a;"><strong>Email:</strong> ${email}</p>
                        <p style="margin: 4px 0 0 0; font-size: 16px; color: #0f172a;"><strong>Temporary Password:</strong> Cashcrow@123</p>
                    </div>
                    
                    <p style="color: #ef4444; font-size: 14px; font-weight: 600;">Important: You will be required to change your password upon your first login.</p>
                    
                    <div style="text-align: center; margin-top: 32px;">
                        <a href="${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('supabase.co', 'cashcrow.com') || '#'}" 
                           style="background-color: #265136; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                            Log In to Dashboard
                        </a>
                    </div>
                    
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
                    <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
                        &copy; 2026 Protoform Technologies Pvt Ltd. All rights reserved.
                    </p>
                </div>
            `
        })

        if (error) {
            console.error('Resend email error:', error)
            return { error: error.message }
        }

        return { success: true, data }
    } catch (err: any) {
        console.error('Email sending failed:', err.message)
        return { error: err.message }
    }
}
