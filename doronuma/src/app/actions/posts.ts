'use server'

import { revalidatePath } from 'next/cache'
import { ensureSupabaseUser } from '@/lib/supabase/auth-helpers'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { z } from 'zod'

const postSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください').max(100),
  content: z.string().min(1, '本文を入力してください').max(1000),
  category: z.string().min(1, 'カテゴリを選択してください'),
  despair_level: z.number().min(1).max(100),
  location_name: z.string().optional(),
})

export async function createPost(formData: FormData) {
  const user = await ensureSupabaseUser()
  
  if (!user) {
    throw new Error('ログインが必要です')
  }

  const rawData = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    category: formData.get('category') as string,
    despair_level: Number(formData.get('despair_level')),
    location_name: formData.get('location_name') as string,
  }

  const validatedData = postSchema.parse(rawData)

  const supabase = createServiceRoleClient()

  const { error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      ...validatedData,
    })

  if (error) {
    console.error('Post creation error:', error)
    throw new Error('投稿に失敗しました')
  }

  revalidatePath('/')
}
