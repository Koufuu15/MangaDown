import { capturePNG } from "@/utils/capture"
import { downloadText, downloadDataURL } from "@/utils/download"
import { downloadPDF } from "@/utils/pdf"

export function useExport(previewRef, markdown) {
  function exportMarkdown() {
    downloadText(markdown.value, "manga.md", "text/markdown")
  }

  async function copyPNG() {
    const png = await capturePNG(previewRef.value)
    const response = await fetch(png)
    const blob = await response.blob()
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob })
    ])
  }

  async function exportPNG() {
    const png = await capturePNG(previewRef.value)
    downloadDataURL(png, "manga.png")
  }

  async function exportPDF() {
    const node = previewRef.value
    const png = await capturePNG(node)
    downloadPDF(png, node.scrollWidth, node.scrollHeight, "manga.pdf")
  }

  return {
    exportMarkdown,
    copyPNG,
    exportPNG,
    exportPDF
  }
}