"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Mock Auth Check
        const token = localStorage.getItem("token");
        if (!token) {
            // router.push("/login");
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <header className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                <h1 className="text-3xl font-bold text-cyan-400">Lumen <span className="text-white text-xl font-normal">| Authority Dashboard</span></h1>
                <button
                    onClick={() => router.push("/login")}
                    className="bg-red-600 px-4 py-2 rounded text-sm hover:bg-red-500"
                >
                    Logout
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-2">Live Alerts</h2>
                    <div className="text-4xl font-bold text-red-500">3</div>
                    <p className="text-gray-400">Active SOS Signals</p>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-2">Active Tourists</h2>
                    <div className="text-4xl font-bold text-green-500">24</div>
                    <p className="text-gray-400">Currently Monitored</p>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-2">Resource Status</h2>
                    <div className="text-4xl font-bold text-yellow-500">98%</div>
                    <p className="text-gray-400">System Uptime</p>
                </div>
            </div>

            <div className="mt-8 bg-gray-800 rounded-lg h-96 overflow-hidden border border-gray-700 shadow-2xl relative">
                <Map />
            </div>
        </div>
    );
}
