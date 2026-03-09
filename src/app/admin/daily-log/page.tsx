import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import DailyLogClient from './daily-log-client'

export default async function DailyLogPage() {
    const supabase = await createServerSupabaseClient()
    const adminClient = getSupabaseAdmin()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
        console.error('Auth error:', authError)
    }

    if (!user) {
        console.log('No user found, redirecting to login')
        redirect('/')
    }

    console.log('User ID:', user.id)
    console.log('User email:', user.email)

    // Skip profile check - just use email as name
    const fullName = user.email?.split('@')[0] || 'Admin'
    console.log('User name:', fullName)

    // Fetch products for the dropdown
    const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, sku, category, quantity')
        .order('name', { ascending: true })

    if (productsError) {
        console.error('Error fetching products:', productsError)
    } else {
        console.log('Products fetched successfully:', products?.length, 'items')
    }

    // Fetch members with ADMIN role from add_member list using admin client to bypass RLS
    let members: any[] = []
    const { data: membersData, error: membersError } = await adminClient
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('role', 'ADMIN')
        .order('first_name', { ascending: true })

    console.log('Members query result:', membersData)
    console.log('Members error:', membersError)

    if (membersError) {
        console.warn('Could not fetch members:', membersError.message)
        // Use user email as a fallback member
        members = [{ id: user.id, first_name: user.email?.split('@')[0] || 'User', last_name: '' }]
    } else {
        members = membersData || []
        console.log('Members fetched successfully:', members.length, 'items')
    }

    // Fetch all submitted day logs using admin client
    const { data: submittedLogs, error: logsError } = await adminClient
        .from('day_logs')
        .select('*')
        .eq('status', 'SUBMITTED')
        .order('created_at', { ascending: false })

    // Fetch user profiles separately for the logs
    const logCreatorIds = submittedLogs?.map((log: any) => log.created_by) || []
    let profileMap: Record<string, { first_name: string; last_name: string; email: string }> = {}
    
    if (logCreatorIds.length > 0) {
        const { data: profiles } = await adminClient
            .from('profiles')
            .select('id, first_name, last_name, email')
            .in('id', logCreatorIds)
        
        if (profiles) {
            profiles.forEach((profile: any) => {
                profileMap[profile.id] = profile
            })
        }
    }

    // Fetch all taken_by member IDs from items
    const allTakenByIds: string[] = []
    if (submittedLogs) {
        for (const log of submittedLogs) {
            const { data: items } = await adminClient
                .from('day_log_items')
                .select('taken_by')
                .eq('day_log_id', log.id)
            
            if (items) {
                items.forEach((item: any) => {
                    if (item.taken_by) {
                        allTakenByIds.push(item.taken_by)
                    }
                })
            }
        }
    }

    // Fetch member profiles for taken_by
    let takenByProfileMap: Record<string, { first_name: string; last_name: string }> = {}
    if (allTakenByIds.length > 0) {
        const uniqueTakenByIds = [...new Set(allTakenByIds)]
        const { data: takenByProfiles } = await adminClient
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', uniqueTakenByIds)
        
        if (takenByProfiles) {
            takenByProfiles.forEach((profile: any) => {
                takenByProfileMap[profile.id] = { first_name: profile.first_name, last_name: profile.last_name }
            })
        }
    }

    // Fetch items for each log
    const logsWithItems: any[] = []
    
    if (submittedLogs) {
        for (const log of submittedLogs) {
            const { data: items } = await adminClient
                .from('day_log_items')
                .select('*')
                .eq('day_log_id', log.id)
            
            // Fetch product details for each item
            const itemsWithProducts: any[] = []
            if (items) {
                for (const item of items) {
                    const { data: product } = await adminClient
                        .from('products')
                        .select('name, sku, quantity')
                        .eq('id', item.part_id)
                        .single()
                    
                    // Get member name for taken_by
                    const takenByProfile = item.taken_by ? takenByProfileMap[item.taken_by] : null
                    
                    itemsWithProducts.push({ 
                        ...item, 
                        products: product,
                        taken_by_name: takenByProfile ? `${takenByProfile.first_name} ${takenByProfile.last_name}` : null
                    })
                }
            }
            
            logsWithItems.push({
                ...log,
                day_log_items: itemsWithProducts,
                profiles: profileMap[log.created_by] || { first_name: 'Unknown', last_name: '', email: '' }
            })
        }
    }

    if (logsError) {
        console.warn('Could not fetch submitted logs:', logsError.message)
    }

    return (
        <DailyLogClient 
            userName={fullName}
            userId={user.id}
            products={products || []}
            members={members}
            submittedLogs={logsWithItems}
        />
    )
}

