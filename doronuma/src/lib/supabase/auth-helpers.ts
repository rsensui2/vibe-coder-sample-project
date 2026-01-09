import { auth, currentUser } from '@clerk/nextjs/server'
import { createServiceRoleClient } from './service-role'

/**
 * Clerk のユーザー情報を Supabase の users テーブルに同期（Upsert）します。
 */
export async function ensureSupabaseUser() {
  const { userId } = await auth()
  if (!userId) return null

  const user = await currentUser()
  if (!user) return null

  const supabase = createServiceRoleClient()
  
  const { data, error } = await supabase
    .from('users')
    .upsert(
      {
        clerk_user_id: userId,
        email: user.emailAddresses[0].emailAddress,
        display_name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || '不運なユーザー',
        avatar_url: user.imageUrl,
      },
      { onConflict: 'clerk_user_id' }
    )
    .select()
    .single()

  if (error) {
    console.error('Supabase user sync error:', error)
    throw error
  }
  
  return data
}

/**
 * 現在の Supabase ユーザー情報を取得します。
 */
export async function getSupabaseUser() {
  const { userId } = await auth()
  if (!userId) return null

  const supabase = createServiceRoleClient()
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_user_id', userId)
    .maybeSingle()

  return data
}
