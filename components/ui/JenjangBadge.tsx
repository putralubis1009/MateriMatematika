import type { Jenjang } from "@/types";
import { JENJANG_CONFIG } from "@/types";
import { cn } from "@/lib/utils";

interface JenjangBadgeProps {
  jenjang: Jenjang;
  kelas: number;
  size?: "sm" | "xs";
}

export function JenjangBadge({ jenjang, kelas, size = "sm" }: JenjangBadgeProps) {
  const cfg = JENJANG_CONFIG[jenjang];
  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-full border",
        cfg.bgColor, cfg.color, cfg.borderColor,
        size === "xs" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1"
      )}
    >
      {jenjang} · Kls {kelas}
    </span>
  );
}
