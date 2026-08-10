"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Jenjang } from "@/types";
import { JENJANG_CONFIG, getDefaultKelas } from "@/lib/jenjang";

interface JenjangContextValue {
  jenjang: Jenjang;
  kelas: number;
  setJenjang: (j: Jenjang) => void;
  setKelas: (k: number) => void;
  setJenjangKelas: (j: Jenjang, k: number) => void;
}

const JenjangContext = createContext<JenjangContextValue>({
  jenjang: "SMP",
  kelas: 7,
  setJenjang: () => {},
  setKelas: () => {},
  setJenjangKelas: () => {},
});

export function JenjangProvider({ children }: { children: ReactNode }) {
  const [jenjang, setJenjangState] = useState<Jenjang>("SMP");
  const [kelas, setKelasState] = useState<number>(7);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("jenjang_active");
      if (saved) {
        const { jenjang: j, kelas: k } = JSON.parse(saved);
        if (j && JENJANG_CONFIG[j as Jenjang]) {
          setJenjangState(j as Jenjang);
          setKelasState(k ?? getDefaultKelas(j as Jenjang));
        }
      }
    } catch {}
  }, []);

  function persist(j: Jenjang, k: number) {
    try {
      localStorage.setItem("jenjang_active", JSON.stringify({ jenjang: j, kelas: k }));
    } catch {}
  }

  function setJenjang(j: Jenjang) {
    const k = getDefaultKelas(j);
    setJenjangState(j);
    setKelasState(k);
    persist(j, k);
  }

  function setKelas(k: number) {
    setKelasState(k);
    persist(jenjang, k);
  }

  function setJenjangKelas(j: Jenjang, k: number) {
    setJenjangState(j);
    setKelasState(k);
    persist(j, k);
  }

  return (
    <JenjangContext.Provider value={{ jenjang, kelas, setJenjang, setKelas, setJenjangKelas }}>
      {children}
    </JenjangContext.Provider>
  );
}

export function useJenjang() {
  return useContext(JenjangContext);
}
