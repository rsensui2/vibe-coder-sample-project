import { clerkMiddleware } from '@clerk/nextjs/server'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export const proxy = clerkMiddleware(async (auth, request: NextRequest) => {
  // Supabase セッション更新用のレスポンス
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Supabase クライアントの初期化（SSR対応）
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Supabase ユーザーセッションの確認
  await supabase.auth.getUser()

  return supabaseResponse
})

export const config = {
  matcher: [
    // Next.js の内部動作や静的ファイルを除外
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // API ルートは常に実行
    '/(api|trpc)(.*)',
  ],
}
