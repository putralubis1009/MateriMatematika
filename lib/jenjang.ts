import type { Jenjang } from '@/types'
import { JENJANG_CONFIG } from '@/types'

export { JENJANG_CONFIG }

export function getKelasForJenjang(jenjang: Jenjang): number[] {
  return JENJANG_CONFIG[jenjang].kelas
}

export function formatJenjangLabel(jenjang: Jenjang, kelas: number): string {
  return `${jenjang} Kelas ${kelas}`
}

export function getDefaultKelas(jenjang: Jenjang): number {
  return JENJANG_CONFIG[jenjang].kelas[0]
}

export const JENJANG_ORDER: Jenjang[] = ['SD', 'SMP', 'SMA']

export function isValidKelasForJenjang(jenjang: Jenjang, kelas: number): boolean {
  return JENJANG_CONFIG[jenjang].kelas.includes(kelas)
}
