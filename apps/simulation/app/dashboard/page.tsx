"use client";

import dynamic from "next/dynamic";
import { useSimulation } from "../lib/simulation-context";
import { Shield, Activity, Users, Radio, TriangleAlert, BadgeCheck, Loader2 } from "lucide-react";
import { GlassCard } from "../components/ui/glass-card";
import { NeoButton } from "../components/ui/neo-button";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { AiConsole } from "./components/ai-console";
import { BlockchainMonitor } from "./components/blockchain-monitor";

// Dynamic Import for Map (No SSR)
const DashboardMap = dynamic(() => import("./components/map"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600">
            <Loader2 className="w-8 h-8 animate-spin" />
        </div>
    ),
});

export default function DashboardPage() {
    const { state, resetSimulation } = useSimulation();
    const [logs, setLogs] = useState<{ time: string, msg: string, type: 'info' | 'alert' }[]>([]);
    const [activeTab, setActiveTab] = useState<'ai' | 'chain'>('ai');

    // Simulate incoming logs
    useEffect(() => {
        const messages = ["New block mined: #189293", "Tourist checked in: Zone A", "Identity Verified: Hash 0x93...", "Network Latency: 12ms"];
        const interval = setInterval(() => {
            const msg = messages[Math.floor(Math.random() * messages.length)];
            setLogs(prev => [{
                time: new Date().toLocaleTimeString(),
                msg,
                type: 'info'
            }, ...prev.slice(0, 8)]);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // SOS Alert Log
    useEffect(() => {
        if (state.mobile.isSosActive) {
            setLogs(prev => [{
                time: new Date().toLocaleTimeString(),
                msg: "CRITICAL ALERT: SOS SIGNAL RECEIVED",
                type: 'alert'
            }, ...prev]);
        }
    }, [state.mobile.isSosActive]);

    return (
        <div className="flex h-screen w-full bg-zinc-950 overflow-hidden">

            {/* Sidebar */}
            <div className="w-96 flex flex-col border-r border-white/10 bg-zinc-900/50 backdrop-blur glass">

                {/* Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-white tracking-tight">Smart Sentry <span className="text-blue-500 text-xs align-top">CMD</span></h1>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-green-400 font-mono">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        SYSTEM ONLINE • ETH MAINNET
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 p-6 border-b border-white/10">
                    <div className="bg-white/5 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                            <Users className="w-3 h-3" /> Active Tourists
                        </div>
                        <div className="text-2xl font-bold text-white">1,204</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                            <Activity className="w-3 h-3" /> Risk Level
                        </div>
                        <div className="text-2xl font-bold text-green-400">Low</div>
                    </div>
                </div>

                {/* Alerts / Active Cards */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 flex flex-col">
                    <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 shrink-0">Live Feeds</h2>

                    <AnimatePresence>
                        {state.mobile.isSosActive ? (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 shadow-[0_0_30px_rgba(239,68,68,0.2)] animate-pulse shrink-0"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2 text-red-500 font-bold">
                                        <TriangleAlert className="w-5 h-5" />
                                        SOS TRIGGERED
                                    </div>
                                    <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded animate-bounce">LIVE</span>
                                </div>
                                <div className="space-y-2 text-sm text-red-200/80 font-mono">
                                    <p>ID: {state.mobile.passportId?.substring(0, 12)}...</p>
                                    <p>LOC: {state.mobile.location?.lat.toFixed(4)}, {state.mobile.location?.lng.toFixed(4)}</p>
                                    <div className="h-1 w-full bg-red-900 rounded-full overflow-hidden mt-3">
                                        <div className="h-full bg-red-500 w-2/3 animate-[progress_1s_ease-in-out_infinite]" />
                                    </div>
                                    <p className="text-[10px] uppercase mt-1">Dispatching Unmanned Drones...</p>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 shrink-0">
                                <BadgeCheck className="w-5 h-5 text-green-500" />
                                <div>
                                    <p className="text-sm font-medium text-green-400">All Zones Secure</p>
                                    <p className="text-xs text-zinc-500">Monitoring 4 active sectors</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* System Monitor Tabs */}
                    <div className="flex-1 min-h-[300px] mt-4 flex flex-col">
                        <div className="flex items-center gap-2 mb-2 p-1 bg-zinc-900/50 rounded-lg">
                            <button
                                onClick={() => setActiveTab('ai')}
                                className={`flex-1 text-[10px] font-bold py-1.5 rounded transition-colors ${activeTab === 'ai' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                AI KERNEL
                            </button>
                            <button
                                onClick={() => setActiveTab('chain')}
                                className={`flex-1 text-[10px] font-bold py-1.5 rounded transition-colors ${activeTab === 'chain' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                LEDGER NODE
                            </button>
                        </div>

                        <div className="flex-1 relative">
                            {activeTab === 'ai' ? <AiConsole /> : <BlockchainMonitor />}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10">
                    <NeoButton variant="secondary" onClick={resetSimulation} className="w-full text-xs h-8">
                        Reset Simulation State
                    </NeoButton>
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative bg-zinc-900">
                <DashboardMap
                    userLocation={state.mobile.location}
                    isSosActive={state.mobile.isSosActive}
                />

                {/* Map Overlay info */}
                <div className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur p-2 rounded-lg border border-white/10 text-xs text-zinc-400 z-[400]">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500/50 rounded-full border border-red-500" /> Danger Zone
                        <div className="w-3 h-3 bg-blue-500/50 rounded-full border border-blue-500 ml-2" /> Tourist Cluster
                    </div>
                </div>
            </div>
        </div>
    );
}
