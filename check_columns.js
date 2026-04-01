import { getSupabaseAdmin } from './src/lib/supabase.js'

async function checkColumns() {
  const adminClient = getSupabaseAdmin()
  const { data, error } = await adminClient
    .from('profiles')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error fetching profiles:', error)
    return
  }

  if (data && data.length > 0) {
    console.log('Columns in profiles:', Object.keys(data[0]))
  } else {
    console.log('No data in profiles table to check columns.')
  }
}

checkColumns()
