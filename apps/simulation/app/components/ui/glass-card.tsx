"use client";

import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = false, ...props }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hoverEffect ? { scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" } : {}}
            className={cn(
                "glass rounded-2xl p-6 border border-white/10 shadow-xl backdrop-blur-md bg-white/5",
                className
            )}
            {...(props as any)}
        >
            {children}
        </motion.div>
    );
}
