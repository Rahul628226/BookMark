'use client'

import Link from 'next/link'
import AuthButton from './AuthButton'
import { createClient } from '@/app/lib/supabase/client'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [supabase])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[#dcdce5] bg-white/80 backdrop-blur-md px-6 lg:px-20 py-3">
            <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className="bg-primary p-1.5 rounded-lg text-white">
                        <span className="material-symbols-outlined block">bookmarks</span>
                    </div>
                    <h2 className="text-[#121118] text-lg font-bold leading-tight tracking-tight">
                        Smart Bookmark Manager
                    </h2>
                </Link>

                <div className="flex items-center gap-6">
                    {user ? (
                        <>
                            <div className="hidden md:flex items-center gap-2">
                                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                    Pro Account
                                </div>
                            </div>
                            <div className="h-8 w-[1px] bg-[#dcdce5]"></div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-sm font-semibold text-[#666388] hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">logout</span>
                                <span>Logout</span>
                            </button>
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border border-[#dcdce5]"
                                style={{ backgroundImage: `url(${user.user_metadata.avatar_url})` }}
                                title={user.user_metadata.full_name}
                            />
                        </>
                    ) : (
                        <AuthButton />
                    )}
                </div>
            </div>
        </header>
    )
}
