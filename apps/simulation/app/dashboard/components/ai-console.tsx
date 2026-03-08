"use client";

import { useEffect, useState, useRef } from "react";
import { Terminal, Cpu, Network, ShieldCheck } from "lucide-react";
import { GeoSpatialRiskGNN, DispatchOptimizerMARL, BlockchainVerifier } from "../../lib/ai-models";

export function AiConsole() {
    const [logs, setLogs] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Keep instances stable
    const gnnRef = useRef(new GeoSpatialRiskGNN());
    const marlRef = useRef(new DispatchOptimizerMARL());
    const isoRef = useRef(new BlockchainVerifier());

    const addLog = (msg: string) => {
        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
        setLogs(prev => [...prev.slice(-20), `[${timestamp}] ${msg}`]);
    };

    // Override console.log locally for the demo effect (optional, or just call methods)
    // Here we just manually trigger methods and capture their conceptual output strings
    useEffect(() => {
        const timer = setInterval(async () => {
            const rand = Math.random();

            if (rand < 0.4) {
                // Run GNN
                addLog("[ST-GNN] Updating feature matrix...");
                await gnnRef.current.predictRisk([{ id: 'Sector-7', features: [0.8, 0.1], neighbors: [] }]);
                addLog("[ST-GNN] Risk Matrix Updated.");
            } else if (rand < 0.7) {
                // Run Verification
                const hash = "0x" + Math.random().toString(16).slice(2);
                isoRef.current.verifyTransaction(hash);
                addLog(`[ISO-FOREST] Validated Block ${hash.substring(0, 8)}...`);
            } else {
                // Run Optimization
                addLog("[MARL] optimising dispatch routes...");
                marlRef.current.optimizeDispatch(
                    [{ id: 'Drone-Alpha', type: 'DRONE', position: [0, 0], status: 'IDLE' }],
                    [48.85, 2.35]
                );
                addLog("[MARL] Policy Converged.");
            }

        }, 3500);

        return () => clearInterval(timer);
    }, []);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="bg-black/90 rounded-xl border border-zinc-800 overflow-hidden font-mono text-xs flex flex-col h-full shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-zinc-900 border-b border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400">
                    <Terminal className="w-4 h-4" />
                    <span className="font-bold">AI Kernel Diagnostic</span>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-1 text-[10px] text-blue-400">
                        <Network className="w-3 h-3" /> ST-GNN
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-purple-400">
                        <Cpu className="w-3 h-3" /> MARL-OPT
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-green-400">
                        <ShieldCheck className="w-3 h-3" /> ISO-FOREST
                    </div>
                </div>
            </div>

            {/* Terminal Output */}
            <div ref={scrollRef} className="flex-1 p-3 overflow-y-auto space-y-1 text-green-500/80">
                {logs.map((log, i) => (
                    <div key={i} className="break-all border-l-2 border-transparent hover:border-zinc-700 pl-2 transition-colors">
                        <span className="opacity-50 mr-2">$</span>
                        {log.includes("[ST-GNN]") ? <span className="text-blue-400">{log}</span> :
                            log.includes("[MARL]") ? <span className="text-purple-400">{log}</span> :
                                log.includes("[ISO-FOREST]") ? <span className="text-green-400">{log}</span> :
                                    <span className="text-zinc-300">{log}</span>}
                    </div>
                ))}
                <div className="animate-pulse">_</div>
            </div>
        </div>
    );
}
