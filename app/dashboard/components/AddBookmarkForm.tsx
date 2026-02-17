'use client'

import { useState } from 'react'
import { createClient } from '@/app/lib/supabase/client'

export default function AddBookmarkForm() {
    const [url, setUrl] = useState('')
    const [title, setTitle] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!url || !title) return

        setIsLoading(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            alert('You must be logged in to add a bookmark')
            setIsLoading(false)
            return
        }

        const { error } = await supabase.from('bookmarks').insert([
            { url, title, user_id: user.id }
        ])

        if (error) {
            console.error('Error adding bookmark:', error.message)
            alert('Failed to add bookmark')
        } else {
            setUrl('')
            setTitle('')
        }
        setIsLoading(false)
    }

    return (
        <section className="bg-white rounded-xl shadow-sm border border-[#dcdce5] overflow-hidden mb-12">
            <div className="p-6 border-b border-[#f1f0f4] bg-primary/[0.02]">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">add_circle</span>
                    <h3 className="text-lg font-bold text-[#121118]">Add New Bookmark</h3>
                </div>
            </div>
            <div className="p-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div className="lg:col-span-2 space-y-2">
                        <label className="text-sm font-semibold text-[#121118]">Website URL</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#666388] text-xl">link</span>
                            <input
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#dcdce5] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-[#666388]/50 text-sm"
                                placeholder="https://example.com"
                                type="url"
                                required
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-2 space-y-2">
                        <label className="text-sm font-semibold text-[#121118]">Bookmark Title</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#666388] text-xl">label</span>
                            <input
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#dcdce5] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-[#666388]/50 text-sm"
                                placeholder="e.g. Design Inspiration"
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/20 disabled:opacity-50 text-sm"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            <span>{isLoading ? 'Saving...' : 'Save'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}
