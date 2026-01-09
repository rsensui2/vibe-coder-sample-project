'use client'

import { useState } from 'react'
import { createPost } from '@/app/actions/posts'
import { Frown, MapPin, Tag, Send } from 'lucide-react'

export default function PostForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [despairLevel, setDespairLevel] = useState(50)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      await createPost(formData)
      // 成功時にフォームをリセット（簡易版）
      const form = document.querySelector('form') as HTMLFormElement
      form.reset()
      setDespairLevel(50)
      alert('絶望を共有しました。供養を待ちましょう。')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'エラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center gap-2 text-yellow-500 mb-2">
        <Frown size={20} />
        <h2 className="font-bold text-lg">ドロヌマ・ポスト</h2>
      </div>

      <input
        name="title"
        type="text"
        placeholder="絶望のタイトル（例：財布をなくした）"
        required
        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-600 transition-colors"
      />

      <textarea
        name="content"
        placeholder="何が起きたのか詳しく聞かせてください..."
        required
        rows={4}
        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-600 transition-colors resize-none"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs text-stone-500 flex items-center gap-1">
            <Tag size={14} /> カテゴリ
          </label>
          <select
            name="category"
            className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-600 transition-colors appearance-none"
          >
            <option value="金銭">金銭（盗難・紛失）</option>
            <option value="紛失">忘れ物・紛失</option>
            <option value="体調">体調不良・怪我</option>
            <option value="人間関係">人間関係・修羅場</option>
            <option value="その他">その他</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-stone-500 flex items-center gap-1">
            <MapPin size={14} /> 場所（任意）
          </label>
          <input
            name="location_name"
            type="text"
            placeholder="例：成田空港、新宿駅"
            className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-600 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs text-stone-500 flex items-center gap-1">
            <Frown size={14} /> 絶望メーター
          </label>
          <span className="text-sm font-mono font-bold text-yellow-500">{despairLevel}%</span>
        </div>
        <input
          name="despair_level"
          type="range"
          min="1"
          max="100"
          value={despairLevel}
          onChange={(e) => setDespairLevel(parseInt(e.target.value))}
          className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-yellow-600"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-yellow-600 hover:bg-yellow-500 disabled:bg-stone-700 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
        ) : (
          <>
            <Send size={18} />
            絶望を投稿する
          </>
        )}
      </button>
    </form>
  )
}
