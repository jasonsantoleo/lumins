"use client";

export default function MobileLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Content Area - Full Screen Mobile Web App */}
            <div className="w-full min-h-screen max-w-md mx-auto bg-zinc-950 relative shadow-2xl overflow-hidden">
                {children}
            </div>
        </div>
    );
}
