'use client'

import { Bookmark } from '@/app/lib/types'
import { createClient } from '@/app/lib/supabase/client'
import { useState } from 'react'

interface Props {
    bookmark: Bookmark
}

export default function BookmarkCard({ bookmark }: Props) {
    const [isDeleting, setIsDeleting] = useState(false)
    const supabase = createClient()

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!confirm('Are you sure you want to delete this bookmark?')) return

        setIsDeleting(true)
        const { error } = await supabase
            .from('bookmarks')
            .delete()
            .eq('id', bookmark.id)

        if (error) {
            console.error('Error deleting bookmark:', error.message)
            setIsDeleting(false)
        }
    }

    const dateStr = new Date(bookmark.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })

    // Generate a placeholder background based on URL using microlink
    const bgImage = `https://api.microlink.io/?url=${encodeURIComponent(bookmark.url)}&screenshot=true&embed=screenshot.url`

    return (
        <div className="group bg-white rounded-xl border border-[#dcdce5] hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all overflow-hidden flex flex-col">
            <div
                className="h-40 bg-cover bg-center relative bg-gray-50 border-b border-[#f1f0f4]"
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors shadow-sm disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
                <h4 className="text-[#121118] font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {bookmark.title}
                </h4>
                <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm font-medium hover:underline mb-4 flex items-center gap-1"
                >
                    {bookmark.url.replace(/^https?:\/\//, '')}
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                </a>
                <div className="mt-auto flex items-center justify-between text-[#666388] text-xs">
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        Added {dateStr}
                    </span>
                    <span className="bg-background-light px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-[#666388] border border-[#dcdce5]">
                        Bookmark
                    </span>
                </div>
            </div>
        </div>
    )
}
