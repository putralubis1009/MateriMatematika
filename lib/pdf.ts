import jsPDF from 'jspdf'
import { formatTanggal } from './utils'

export interface MateriPDF {
  judul: string
  isi: string
  diperbarui_pada: string
}

/**
 * Generate PDF dari materi ajar dan return sebagai Uint8Array.
 */
export function generateMateriPDF(materi: MateriPDF): Uint8Array {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  const margin = 20
  const pageWidth = doc.internal.pageSize.getWidth()
  const contentWidth = pageWidth - margin * 2
  let y = margin

  // Header
  doc.setFillColor(37, 99, 235) // biru
  doc.rect(0, 0, pageWidth, 35, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.text('Materi Matematika AI', margin, 15)

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  const judulLines = doc.splitTextToSize(materi.judul, contentWidth)
  doc.text(judulLines, margin, 26)

  y = 45

  // Metadata
  doc.setTextColor(120, 120, 120)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`Diperbarui: ${formatTanggal(materi.diperbarui_pada)}`, margin, y)
  y += 8

  // Garis pemisah
  doc.setDrawColor(220, 220, 220)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  // Isi materi
  doc.setTextColor(30, 30, 30)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')

  const isiLines = doc.splitTextToSize(materi.isi || '(Tidak ada isi)', contentWidth)
  const pageHeight = doc.internal.pageSize.getHeight()

  for (const line of isiLines) {
    if (y + 7 > pageHeight - margin) {
      doc.addPage()
      y = margin
    }
    doc.text(line, margin, y)
    y += 7
  }

  // Footer
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Halaman ${i} dari ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  return doc.output('arraybuffer') as unknown as Uint8Array
}
