import { marked } from "marked"

import { capturePNG } from "@/utils/capture"
import {
  downloadText,
  downloadDataURL
} from "@/utils/download"
import { downloadPDF } from "@/utils/pdf"

export function useExport(previewRef, markdown) {

  /**
   * Markdown (.md)
   */
  function exportMarkdown() {
    downloadText(
      markdown.value,
      "manga.md",
      "text/markdown"
    )
  }

  /**
   * HTML (.html)
   */
  function exportHTML() {

    const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Manga</title>
</head>

<body>

${marked(markdown.value)}

</body>
</html>`

    downloadText(
      html,
      "manga.html",
      "text/html"
    )
  }

  /**
   * PNG
   */
  async function exportPNG() {

    const png = await capturePNG(
      previewRef.value
    )

    downloadDataURL(
      png,
      "manga.png"
    )
  }

  /**
   * PDF
   */
  async function exportPDF() {

    const node = previewRef.value

    const png = await capturePNG(node)

    downloadPDF(
      png,
      node.scrollWidth,
      node.scrollHeight,
      "manga.pdf"
    )
  }

  return {
    exportMarkdown,
    exportHTML,
    exportPNG,
    exportPDF
  }

}