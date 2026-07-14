import { jsPDF } from "jspdf"

/**
 * PNG(DataURL)からPDFを生成してダウンロード
 *
 * @param {string} pngDataUrl
 * @param {number} width
 * @param {number} height
 * @param {string} filename
 */
export function downloadPDF(
  pngDataUrl,
  width,
  height,
  filename = "manga.pdf"
) {
  const pdf = new jsPDF({
    orientation: width > height ? "landscape" : "portrait",
    unit: "px",
    format: [width, height]
  })

  pdf.addImage(
    pngDataUrl,
    "PNG",
    0,
    0,
    width,
    height
  )

  pdf.save(filename)
}