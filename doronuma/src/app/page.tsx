import PostForm from '@/components/PostForm'
import PostList from '@/components/PostList'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { Frown } from 'lucide-react'

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto space-y-12">
      {/* ヒーローセクション */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-stone-100 italic">
          SHARE YOUR <span className="text-yellow-600 underline decoration-stone-800 underline-offset-8">MISERY.</span>
        </h1>
        <p className="text-stone-400 max-w-lg mx-auto leading-relaxed">
          誰にも言えない失敗、思い出したくない修羅場。<br />
          ここではすべてが「最高の資産」に変わります。
        </p>
      </section>

      {/* 投稿エリア（ログイン時のみ） */}
      <section>
        <SignedIn>
          <PostForm />
        </SignedIn>
        <SignedOut>
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 text-center space-y-4 shadow-xl">
            <Frown size={40} className="mx-auto text-stone-600" />
            <h2 className="text-xl font-bold">あなたの不幸を供養しませんか？</h2>
            <p className="text-stone-500 text-sm">
              投稿するにはログインが必要です。あなたの不運を笑いと共感、そして称号へ。
            </p>
            <SignInButton mode="modal">
              <button className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-full transition-all">
                今すぐログインして絶望を吐き出す
              </button>
            </SignInButton>
          </div>
        </SignedOut>
      </section>

      {/* タイムライン */}
      <section>
        <PostList />
      </section>
    </div>
  )
}
