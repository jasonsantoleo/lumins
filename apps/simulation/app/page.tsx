"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Smartphone, Map, ChevronRight, Zap } from "lucide-react";
import { GlassCard } from "./components/ui/glass-card";
import { NeoButton } from "./components/ui/neo-button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[url('/grid-bg.svg')] bg-cover">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 via-zinc-950 to-zinc-950 -z-10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />

      <div className="max-w-4xl w-full space-y-12 z-10">

        {/* Header */}
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium"
          >
            <Zap className="w-4 h-4" />
            <span>Live Blockchain Simulation</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-6xl font-bold tracking-tight text-white"
          >
            Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Sentry</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-400 max-w-2xl mx-auto"
          >
            The future of tourist safety. Experience the seamless integration of Mobile Identity and Command Center operations.
          </motion.p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard hoverEffect className="h-full flex flex-col items-center text-center space-y-6 group cursor-default">
              <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Smartphone className="w-10 h-10 text-blue-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">Tourist App</h2>
                <p className="text-zinc-400">Simulate the user experience: Passport Verification, Blockchain Identity, and SOS alerting.</p>
              </div>
              <div className="mt-auto pt-4">
                <Link href="/mobile">
                  <NeoButton className="w-full">
                    Launch Mobile Sim <ChevronRight className="w-4 h-4" />
                  </NeoButton>
                </Link>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard hoverEffect className="h-full flex flex-col items-center text-center space-y-6 group cursor-default">
              <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                <Map className="w-10 h-10 text-indigo-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">Command Center</h2>
                <p className="text-zinc-400">Monitor live threats, visualize tourist density heatmaps, and respond to SOS alerts.</p>
              </div>
              <div className="mt-auto pt-4">
                <Link href="/dashboard">
                  <NeoButton variant="secondary" className="w-full">
                    Open Dashboard <ChevronRight className="w-4 h-4" />
                  </NeoButton>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-xs text-zinc-600">
            Powered by Next.js & Simulated Blockchain Network
          </p>
        </motion.div>

      </div>
    </main>
  );
}
