import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'
import Navbar from '../components/Navbar'
import AddBookmarkForm from './components/AddBookmarkForm'
import BookmarkList from './components/BookmarkList'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    // Fetch initial bookmarks for this user
    const { data: bookmarks, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching bookmarks:', error.message)
    }

    return (
        <div className="min-h-screen bg-background-light">
            <Navbar />
            <main className="max-w-[1200px] mx-auto px-6 lg:px-20 py-10">
                {/* Dashboard Header */}
                <div className="mb-10">
                    <h1 className="text-[#121118] text-4xl font-black leading-tight tracking-tight mb-2">My Bookmarks</h1>
                    <p className="text-[#666388] text-lg">
                        You have <span className="text-primary font-bold">{bookmarks?.length || 0}</span> saved links across your collection.
                    </p>
                </div>

                {/* Add Bookmark Form */}
                <AddBookmarkForm />

                {/* Bookmark List with Real-time logic */}
                <BookmarkList initialBookmarks={bookmarks || []} />

                {/* Footer Info */}
                <footer className="mt-16 pt-8 border-t border-[#dcdce5] flex flex-col md:flex-row items-center justify-between gap-4 text-[#666388] text-sm">
                    <p>© 2026 SmartMark. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
                        <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
                        <a className="hover:text-primary transition-colors" href="#">Help Center</a>
                    </div>
                </footer>
            </main>
        </div>
    )
}
