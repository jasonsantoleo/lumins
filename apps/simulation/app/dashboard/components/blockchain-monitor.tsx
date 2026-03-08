"use client";

import { useEffect, useState, useRef } from "react";
import { Box, Link, Shield, Cuboid, Database, Lock, Key } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Transaction {
    hash: string;
    type: "IDENTITY" | "SOS_GRANT" | "LOCATION_PROOF";
    status: "PENDING" | "ZK_VERIFY" | "MINED";
    timestamp: string;
}

export function BlockchainMonitor() {
    const [lastBlock, setLastBlock] = useState(1829300);
    const [txs, setTxs] = useState<Transaction[]>([]);

    // Generate simulated traffic
    useEffect(() => {
        // Initial clean state
        setTxs([
            { hash: "0x" + Math.random().toString(16).slice(2, 10), type: "IDENTITY", status: "MINED", timestamp: "10:00:01" },
            { hash: "0x" + Math.random().toString(16).slice(2, 10), type: "LOCATION_PROOF", status: "MINED", timestamp: "10:00:05" },
        ]);

        const interval = setInterval(() => {
            const r = Math.random();
            const newTx: Transaction = {
                hash: "0x" + Math.random().toString(16).slice(2, 14),
                type: r > 0.8 ? "SOS_GRANT" : r > 0.5 ? "LOCATION_PROOF" : "IDENTITY",
                status: "PENDING",
                timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
            };

            // Add new TX
            setTxs(prev => [newTx, ...prev.slice(0, 7)]);

            // Simulate ZK Verification then Mining
            setTimeout(() => {
                setTxs(prev => prev.map(t => t.hash === newTx.hash ? { ...t, status: "ZK_VERIFY" } : t));

                setTimeout(() => {
                    setTxs(prev => prev.map(t => t.hash === newTx.hash ? { ...t, status: "MINED" } : t));
                    if (Math.random() > 0.3) setLastBlock(b => b + 1);
                }, 1500);
            }, 1000);

        }, 2500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-black/90 rounded-xl border border-zinc-800 overflow-hidden font-mono text-xs flex flex-col h-full shadow-2xl relative">
            <div className="absolute top-0 right-0 p-32 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-zinc-900 border-b border-zinc-800 z-10">
                <div className="flex items-center gap-2 text-zinc-400">
                    <Cuboid className="w-4 h-4" />
                    <span className="font-bold">ZK-Rollup Mainnet</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Box className="w-3 h-3" />
                        <span>#{lastBlock}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-3 overflow-y-auto space-y-1 z-10">
                <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-wider mb-2 px-1">
                    <span>Tx Hash</span>
                    <span>Method</span>
                    <span>Status</span>
                </div>

                <AnimatePresence initial={false}>
                    {txs.map((tx) => (
                        <motion.div
                            key={tx.hash}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            layout
                            className="grid grid-cols-[3fr_3fr_2fr] gap-2 items-center p-2 rounded bg-zinc-900/50 border border-zinc-800/50 text-[10px]"
                        >
                            <div className="flex items-center gap-2 font-mono text-zinc-300">
                                <Link className="w-3 h-3 text-zinc-600" />
                                {tx.hash}
                            </div>

                            <div className={`flex items-center gap-1.5 font-bold ${tx.type === 'SOS_GRANT' ? 'text-red-400' :
                                    tx.type === 'IDENTITY' ? 'text-blue-400' : 'text-zinc-400'
                                }`}>
                                {tx.type === 'SOS_GRANT' && <Key className="w-3 h-3" />}
                                {tx.type === 'IDENTITY' && <Shield className="w-3 h-3" />}
                                {tx.type === 'LOCATION_PROOF' && <Database className="w-3 h-3" />}
                                {tx.type}
                            </div>

                            <div className="flex justify-end">
                                {tx.status === 'PENDING' && (
                                    <span className="text-zinc-500 animate-pulse">Pending...</span>
                                )}
                                {tx.status === 'ZK_VERIFY' && (
                                    <span className="text-yellow-500 flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> Proofing
                                    </span>
                                )}
                                {tx.status === 'MINED' && (
                                    <span className="text-green-500 flex items-center gap-1">
                                        Verified
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Network Stats Footer */}
            <div className="px-3 py-2 bg-zinc-900 border-t border-zinc-800 grid grid-cols-3 gap-2 text-[10px] text-zinc-500">
                <div className="text-center border-r border-zinc-800">
                    <div className="text-zinc-600">TPS</div>
                    <div className="text-white font-mono">14,920</div>
                </div>
                <div className="text-center border-r border-zinc-800">
                    <div className="text-zinc-600">Avg Cost</div>
                    <div className="text-white font-mono">$0.001</div>
                </div>
                <div className="text-center">
                    <div className="text-zinc-600">ZK Proof</div>
                    <div className="text-green-400 font-bold font-mono">OK</div>
                </div>
            </div>
        </div>
    );
}
