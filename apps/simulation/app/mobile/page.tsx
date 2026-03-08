"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, ShieldCheck, Siren, LogOut, CheckCircle2, ShieldAlert, Fingerprint } from "lucide-react";
import { useSimulation } from "../lib/simulation-context";
import { NeoButton } from "../components/ui/neo-button";
import { cn, getDistance } from "../lib/utils";
import { DANGER_ZONES } from "../lib/constants";

export default function MobilePage() {
    const { state, login, logout, toggleSos, updateLocation } = useSimulation();
    const [step, setStep] = useState<'input' | 'verifying'>('input');

    const [passportNumber, setPassportNumber] = useState("");
    const [currentRisk, setCurrentRisk] = useState<{ level: 'Low' | 'Medium' | 'High', color: string, text: string }>({
        level: 'Low',
        color: 'text-green-500',
        text: 'Safe'
    });

    // Login Logic
    const handlePassportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!passportNumber.trim()) return;

        setStep('verifying');

        // Simulate API/Blockchain delay and Hashing
        setTimeout(() => {
            // Create a fake hash from the input to look cool
            const mockHash = "0x" + btoa(passportNumber).substring(0, 12).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
            login(mockHash);
            setStep('input'); // Reset local state for next time
        }, 3000);
    };

    // SOS Logic
    const handleSosPress = () => {
        toggleSos(!state.mobile.isSosActive);
    };

    // Location Tracking Simulation
    useEffect(() => {
        if (state.mobile.isLoggedIn && state.mobile.isSosActive) {
            const interval = setInterval(() => {
                // Jitter location slightly to simulate movement
                const lat = 48.8566 + (Math.random() - 0.5) * 0.002;
                const lng = 2.3522 + (Math.random() - 0.5) * 0.002;
                updateLocation(lat, lng);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [state.mobile.isLoggedIn, state.mobile.isSosActive, updateLocation]);

    // Risk Calculation Logic
    useEffect(() => {
        if (!state.mobile.location) return;

        let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
        let riskText = "Safe";
        let riskColor = "text-green-500";

        // Check if user is in any danger zone
        for (const zone of DANGER_ZONES) {
            const distance = getDistance(
                state.mobile.location.lat,
                state.mobile.location.lng,
                zone.lat,
                zone.lng
            );

            if (distance <= zone.radius) {
                // Inside zone
                riskLevel = zone.level;
                riskText = zone.level === 'High' ? "High Risk Area" : "Caution Area";
                riskColor = zone.level === 'High' ? "text-red-500" : "text-yellow-500";
                break; // Assume worst case wins or first match
            }
        }

        setCurrentRisk({ level: riskLevel, color: riskColor, text: riskText });

    }, [state.mobile.location]);


    return (
        <div className="h-full px-6 flex flex-col relative py-8">
            <AnimatePresence mode="wait">

                {/* LOGIN VIEW */}
                {!state.mobile.isLoggedIn && (
                    <motion.div
                        key="login"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex-1 flex flex-col justify-center space-y-8"
                    >
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="w-10 h-10 text-blue-500" />
                            </div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                                {step === 'input' ? 'Identity Verification' : 'Blockchain Verifying'}
                            </h1>
                            <p className="text-zinc-400 text-sm">
                                {step === 'input'
                                    ? 'Enter your passport details to generate your secure digital identity.'
                                    : 'Validating credentials and generating immutable block hash...'
                                }
                            </p>
                        </div>

                        {step === 'input' ? (
                            <motion.form
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                onSubmit={handlePassportSubmit}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Passport Number</label>
                                    <input
                                        type="text"
                                        value={passportNumber}
                                        onChange={(e) => setPassportNumber(e.target.value)}
                                        placeholder="Enter Passport No. (e.g. A1234567)"
                                        className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-mono tracking-wider"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Full Name"
                                        className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                    />
                                </div>

                                <NeoButton
                                    type="submit"
                                    className="w-full py-4 text-lg"
                                    disabled={!passportNumber}
                                >
                                    Verify Identity <ShieldCheck className="w-5 h-5 ml-2" />
                                </NeoButton>
                            </motion.form>
                        ) : (
                            <div className="relative w-full aspect-square bg-zinc-900/50 rounded-full border border-zinc-800 flex flex-col items-center justify-center overflow-hidden max-w-[280px] mx-auto">
                                <motion.div
                                    className="absolute inset-0 bg-blue-500/20"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    style={{ borderRadius: '40%' }}
                                />
                                <Fingerprint className="w-20 h-20 text-blue-500 relative z-10 animate-pulse" />
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 2.5 }}
                                    className="absolute bottom-0 left-0 h-1 bg-blue-500"
                                />
                                <p className="mt-4 text-blue-400 font-mono text-xs relative z-10">HASHING: 0x{Array.from(passportNumber).map(c => c.charCodeAt(0)).join('').substring(0, 8)}...</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* LOGGED IN VIEW */}
                {state.mobile.isLoggedIn && (
                    <motion.div
                        key="home"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold ring-2 ring-white/10">
                                    ID
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Traveler ID</h3>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                                        <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Blockchain Verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Card */}
                        <div className={cn(
                            "rounded-3xl p-6 border mb-12 relative overflow-hidden group transition-colors duration-500",
                            currentRisk.level === 'High' ? "bg-red-950/30 border-red-900/50" :
                                currentRisk.level === 'Medium' ? "bg-yellow-950/30 border-yellow-900/50" :
                                    "bg-zinc-900/80 border-zinc-800"
                        )}>
                            <div className={cn(
                                "absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl transition-all opacity-50",
                                currentRisk.level === 'High' ? "bg-red-500/20" :
                                    currentRisk.level === 'Medium' ? "bg-yellow-500/20" :
                                        "bg-blue-500/10"
                            )} />

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Safety Status</p>
                                    <h2 className={cn("text-2xl font-bold flex items-center gap-2 transition-colors", currentRisk.color)}>
                                        {currentRisk.text}
                                        <span className={cn(
                                            "flex h-2.5 w-2.5 rounded-full shadow-[0_0_10px_currentColor] animate-pulse",
                                            currentRisk.level === 'High' ? "bg-red-500" :
                                                currentRisk.level === 'Medium' ? "bg-yellow-500" :
                                                    "bg-green-500"
                                        )} />
                                    </h2>
                                </div>
                                <ShieldCheck className={cn("w-8 h-8 transition-colors",
                                    currentRisk.level === 'High' ? "text-red-500" : "text-zinc-600"
                                )} />
                            </div>

                            <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                                <p className="text-[10px] text-zinc-500 mb-1 uppercase tracking-wider">Blockchain Hash</p>
                                <p className="text-xs text-zinc-300 font-mono break-all leading-tight">
                                    {state.mobile.passportId}
                                </p>
                            </div>
                        </div>

                        {/* SOS Button Area */}
                        <div className="flex-1 flex flex-col items-center justify-center relative min-h-[300px]">

                            {state.mobile.isSosActive && (
                                <>
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0.5 }}
                                        animate={{ scale: 2.5, opacity: 0 }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                                        className="absolute inset-0 bg-red-500/20 rounded-full blur-xl z-0"
                                    />
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0.5 }}
                                        animate={{ scale: 2, opacity: 0 }}
                                        transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: "easeOut" }}
                                        className="absolute inset-0 bg-red-500/30 rounded-full blur-2xl z-0"
                                    />
                                </>
                            )}

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSosPress}
                                className={cn(
                                    "w-56 h-56 rounded-full flex flex-col items-center justify-center border-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all relative z-10 bg-gradient-to-br",
                                    state.mobile.isSosActive
                                        ? "from-red-600 to-red-700 border-red-500 text-white shadow-[0_0_100px_rgba(220,38,38,0.6)]"
                                        : "from-zinc-800 to-zinc-900 border-zinc-800 text-zinc-500 hover:text-red-500 hover:border-red-500/50"
                                )}
                            >
                                <Siren className={cn("w-20 h-20 mb-3 transition-transform", state.mobile.isSosActive && "animate-bounce")} />
                                <span className="text-2xl font-black tracking-[0.2em]">
                                    {state.mobile.isSosActive ? "SOS" : "SOS"}
                                </span>
                                {state.mobile.isSosActive && <span className="text-[10px] font-medium tracking-normal mt-1 opacity-80">ACTIVE</span>}
                            </motion.button>
                        </div>

                        <div className="mb-8 text-center h-12">
                            <AnimatePresence>
                                {state.mobile.isSosActive && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="inline-flex items-center gap-2 text-red-200 text-sm font-medium bg-red-900/50 border border-red-500/30 px-6 py-2.5 rounded-full shadow-lg backdrop-blur-md"
                                    >
                                        <ShieldAlert className="w-4 h-4 animate-pulse" />
                                        Broadcasting Accurate Location...
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="mt-auto">
                            <NeoButton
                                variant="ghost"
                                onClick={logout}
                                className="w-full text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900 hover:border-zinc-800 border border-transparent transition-all py-4"
                            >
                                <LogOut className="w-4 h-4 mr-2" /> Deactivate Identity
                            </NeoButton>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
