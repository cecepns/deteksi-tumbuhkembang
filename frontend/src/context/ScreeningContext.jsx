import { createContext, useContext, useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "deteksi_batita_session";

const defaultSession = {
  profile: null,
  healthHistory: null,
  screening: null,
  screeningResult: null,
};

const ScreeningContext = createContext(null);

export function ScreeningProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultSession;
    } catch {
      return defaultSession;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  const setProfile = useCallback((profile) => {
    setSession((prev) => ({ ...prev, profile }));
  }, []);

  const setHealthHistory = useCallback((healthHistory) => {
    setSession((prev) => ({ ...prev, healthHistory }));
  }, []);

  const setScreening = useCallback((screening) => {
    setSession((prev) => ({ ...prev, screening }));
  }, []);

  const setScreeningResult = useCallback((screeningResult) => {
    setSession((prev) => ({ ...prev, screeningResult }));
  }, []);

  const resetSession = useCallback(() => {
    setSession(defaultSession);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ScreeningContext.Provider
      value={{
        session,
        setProfile,
        setHealthHistory,
        setScreening,
        setScreeningResult,
        resetSession,
      }}
    >
      {children}
    </ScreeningContext.Provider>
  );
}

export function useScreening() {
  const ctx = useContext(ScreeningContext);
  if (!ctx) throw new Error("useScreening must be used within ScreeningProvider");
  return ctx;
}
