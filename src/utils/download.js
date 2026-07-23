/**
 * Blobをダウンロード
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()

  URL.revokeObjectURL(url)
}

/**
 * 文字列をファイルとしてダウンロード
 */
export function downloadText(text, filename, type = "text/plain") {
  const blob = new Blob([text], { type })

  downloadBlob(blob, filename)
}

/**
 * DataURL(PNGなど)をダウンロード
 */
export function downloadDataURL(dataUrl, filename) {
  const a = document.createElement("a")
  a.href = dataUrl
  a.download = filename
  a.click()
}