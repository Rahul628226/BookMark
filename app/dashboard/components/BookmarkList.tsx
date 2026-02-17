'use client'

import { useEffect, useState } from 'react'
import { Bookmark } from '@/app/lib/types'
import { createClient } from '@/app/lib/supabase/client'
import BookmarkCard from './BookmarkCard'

interface Props {
    initialBookmarks: Bookmark[]
}

export default function BookmarkList({ initialBookmarks }: Props) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
    const [searchTerm, setSearchTerm] = useState('')
    const [activeFilter, setActiveFilter] = useState('All')
    const supabase = createClient()

    useEffect(() => {
        // Enable real-time updates
        const channel = supabase
            .channel('bookmarks-realtime')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((prev) => [payload.new as Bookmark, ...prev])
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
                    } else if (payload.eventType === 'UPDATE') {
                        setBookmarks((prev) =>
                            prev.map((b) => (b.id === payload.new.id ? (payload.new as Bookmark) : b))
                        )
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    const filteredBookmarks = bookmarks.filter((b) =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.url.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <>
            <div className="mb-10">
                <p className="text-[#666388] text-lg">
                    You have <span className="text-primary font-bold">{bookmarks.length}</span> saved links across your collection.
                </p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div className="flex items-center gap-3">
                    {['All', 'Work', 'Personal'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-5 py-2 text-sm font-semibold rounded-full border transition-all ${activeFilter === filter
                                ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                                : 'bg-white text-[#666388] border-[#dcdce5] hover:bg-white/80'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#666388] text-xl">search</span>
                    <input
                        className="pl-10 pr-4 py-2.5 rounded-lg border border-[#dcdce5] bg-white w-full md:w-72 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
                        placeholder="Search bookmarks..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredBookmarks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredBookmarks.map((bookmark) => (
                        <BookmarkCard key={bookmark.id} bookmark={bookmark} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#dcdce5]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-primary/5 p-5 rounded-full">
                            <span className="material-symbols-outlined text-5xl text-primary/30">bookmark</span>
                        </div>
                        <h4 className="text-[#121118] font-bold text-xl">No bookmarks found</h4>
                        <p className="text-[#666388] max-w-[300px]">
                            {searchTerm
                                ? `We couldn't find anything matching "${searchTerm}"`
                                : "Your collection is empty. Add your first link above!"}
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}
