import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Frown, MapPin, Tag } from 'lucide-react'

export default async function PostList() {
  const supabase = createServiceRoleClient()

  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      users (
        display_name,
        avatar_url,
        level
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch posts error:', error)
    return <div className="text-stone-500 py-10 text-center">投稿の読み込みに失敗しました</div>
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="bg-stone-900/50 border border-dashed border-stone-800 rounded-2xl py-20 text-center space-y-4">
        <Frown size={48} className="mx-auto text-stone-700" />
        <p className="text-stone-500">まだ絶望は投稿されていません。<br />最初の不運を共有しましょう。</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2 text-stone-400">
        <span className="w-2 h-2 rounded-full bg-yellow-600 animate-pulse"></span>
        最新の絶望タイムライン
      </h2>
      
      {posts.map((post: any) => (
        <article key={post.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md hover:border-stone-700 transition-colors group">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <img 
                src={post.users.avatar_url} 
                alt={post.users.display_name} 
                className="w-10 h-10 rounded-full border border-stone-700 bg-stone-800"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-200">{post.users.display_name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-400 border border-stone-700 font-mono">
                    Lv.{post.users.level}
                  </span>
                </div>
                <time className="text-xs text-stone-500">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ja })}
                </time>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-yellow-600 text-xs font-bold mb-1">
                <Frown size={14} /> 絶望度
              </div>
              <div className="text-2xl font-black italic text-stone-200">
                {post.despair_level}<span className="text-xs ml-0.5">%</span>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-stone-100 mb-2 group-hover:text-yellow-500 transition-colors">
            {post.title}
          </h3>
          
          <p className="text-stone-400 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
            {post.content}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-stone-800">
            <span className="flex items-center gap-1 text-xs bg-stone-800 text-stone-400 px-2 py-1 rounded-md">
              <Tag size={12} /> {post.category}
            </span>
            {post.location_name && (
              <span className="flex items-center gap-1 text-xs text-stone-500">
                <MapPin size={12} /> {post.location_name}
              </span>
            )}
            <div className="ml-auto flex items-center gap-2">
              <button className="text-[10px] font-bold px-3 py-1.5 rounded-full border border-stone-700 hover:bg-stone-800 transition-colors text-stone-400">
                災難だね
              </button>
              <button className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-stone-800 hover:bg-stone-700 border border-stone-700 transition-colors text-yellow-600">
                供養する（投げ銭）
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
