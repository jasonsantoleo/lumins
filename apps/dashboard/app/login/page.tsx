"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("http://localhost:3001/auth/login", {
                email,
                password,
            });

            const { user, token } = res.data;
            if (user.role !== "ADMIN" && user.role !== "POLICE" && user.role !== "DISPATCHER") {
                setError("Access denied: Not an authorized portal user");
                return;
            }

            // TODO: Store token
            console.log("Logged in with token:", token);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6 text-cyan-400">Lumen Authority</h1>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-cyan-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-cyan-400"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded font-bold transition duration-200"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
