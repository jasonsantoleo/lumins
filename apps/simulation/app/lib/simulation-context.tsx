"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

// --- Types ---

export interface SimulationState {
  mobile: {
    isLoggedIn: boolean;
    passportId: string | null;
    isSosActive: boolean;
    location: { lat: number; lng: number } | null;
  };
}

const INITIAL_STATE: SimulationState = {
  mobile: {
    isLoggedIn: false,
    passportId: null,
    isSosActive: false,
    location: null,
  },
};

interface SimulationContextType {
  state: SimulationState;
  // Actions that can be called from Mobile
  login: (passportId: string) => void;
  logout: () => void;
  toggleSos: (active: boolean) => void;
  updateLocation: (lat: number, lng: number) => void;
  // Reset for debug
  resetSimulation: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

// --- Provider ---

const CHANNEL_NAME = "smart-sentry-simulation";

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SimulationState>(INITIAL_STATE);

  // Initialize BroadcastChannel
  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);

    const handleMessage = (event: MessageEvent) => {
      // When we receive a message, we update our local state to match the broadcaster
      // We assume the message data IS the new state
      if (event.data && typeof event.data === "object") {
        console.log("Received sync update:", event.data);
        setState(event.data as SimulationState);
      }
    };

    channel.addEventListener("message", handleMessage);

    return () => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
    };
  }, []);

  // Helper to update state AND broadcast it
  const updateAndBroadcast = (newState: SimulationState) => {
    setState(newState);
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage(newState);
    channel.close();
  };

  // --- Actions ---

  const login = (passportId: string) => {
    const newState = {
      ...state,
      mobile: {
        ...state.mobile,
        isLoggedIn: true,
        passportId,
        // Default location to current simulated "tourist spot"
        location: { lat: 48.8566, lng: 2.3522 }, // Paris default
      },
    };
    updateAndBroadcast(newState);
  };

  const logout = () => {
    updateAndBroadcast(INITIAL_STATE);
  };

  const toggleSos = (active: boolean) => {
    const newState = {
      ...state,
      mobile: {
        ...state.mobile,
        isSosActive: active,
      },
    };
    updateAndBroadcast(newState);
  };

  const updateLocation = (lat: number, lng: number) => {
    const newState = {
      ...state,
      mobile: {
        ...state.mobile,
        location: { lat, lng },
      },
    };
    updateAndBroadcast(newState);
  };

  const resetSimulation = () => {
    updateAndBroadcast(INITIAL_STATE);
  };

  return (
    <SimulationContext.Provider
      value={{
        state,
        login,
        logout,
        toggleSos,
        updateLocation,
        resetSimulation,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

// --- Hook ---

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error("useSimulation must be used within a SimulationProvider");
  }
  return context;
}
