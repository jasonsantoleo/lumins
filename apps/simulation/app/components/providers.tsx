"use client";

import { SimulationProvider } from "../lib/simulation-context";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SimulationProvider>
            {children}
        </SimulationProvider>
    );
}
