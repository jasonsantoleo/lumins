"use client";

import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { Loader2 } from "lucide-react";

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "danger" | "ghost" | "secondary";
    isLoading?: boolean;
}

export function NeoButton({
    children,
    className,
    variant = "primary",
    isLoading,
    disabled,
    ...props
}: NeoButtonProps) {

    const variants = {
        primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20",
        danger: "bg-red-600 hover:bg-red-500 text-white shadow-red-500/20",
        secondary: "bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10",
        ghost: "bg-transparent hover:bg-white/5 text-zinc-300",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={disabled || isLoading}
            className={cn(
                "relative px-6 py-3 rounded-xl font-medium transition-all shadow-lg flex items-center justify-center gap-2",
                variants[variant],
                (disabled || isLoading) && "opacity-50 cursor-not-allowed",
                className
            )}
            {...(props as any)}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {children}
        </motion.button>
    );
}
