import Navbar from "./components/Navbar";
import AuthButton from "./components/AuthButton";
import { createClient } from "@/app/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="relative flex min-h-screen flex-col group/design-root overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="max-w-[1200px] mx-auto px-6 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 justify-center">
            <div className="flex flex-col gap-8 flex-1 text-center">
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center self-center px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  New: Real-time Syncing
                </div>
                <h1 className="text-[#121118] text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
                  Save your favorite links with <span className="text-primary">one click</span>
                </h1>
                <p className="text-[#666388] text-lg md:text-xl font-normal leading-relaxed max-w-[600px] mx-auto">
                  Organize, search, and access your web content instantly. No more messy folders or lost links. SmartMark remembers it all for you.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AuthButton mode="hero" />
              </div>
              <div className="flex items-center justify-center gap-4 text-[#666388] text-sm">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                      <img
                        className="w-full h-full object-cover"
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                        alt="User avatar"
                      />
                    </div>
                  ))}
                </div>
                <span>Join 10,000+ productive users</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-[#dcdce5] py-12">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center bg-primary text-white p-1 rounded-md">
                <span className="material-symbols-outlined text-xl">bookmarks</span>
              </div>
              <h2 className="text-[#121118] text-lg font-extrabold">SmartMark</h2>
            </div>
            <p className="text-[#666388] text-sm max-w-[280px]">Organizing the world's information, one bookmark at a time.</p>
          </div>
          <div className="mt-12 pt-8 border-t border-[#dcdce5] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#666388] text-xs">© 2026 SmartMark. All rights reserved.</p>
            <div className="flex gap-6">
              <a className="text-[#666388] hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined text-xl">language</span>
              </a>
              <a className="text-[#666388] hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined text-xl">alternate_email</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
