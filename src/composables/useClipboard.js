import { marked } from "marked"
import { captureBlob } from "@/utils/capture"

/**
 * クリップボード関連
 *
 * @param {Ref} previewRef
 * @param {Ref} markdown
 */
export function useClipboard(previewRef, markdown) {

  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(markdown.value)
      alert("Markdownをコピーしました！")
    } catch (e) {
      console.error(e)
      alert("コピーに失敗しました")
    }
  }

  async function copyHTML() {
    try {
      const html = marked(markdown.value)

      await navigator.clipboard.writeText(html)

      alert("HTMLをコピーしました！")
    } catch (e) {
      console.error(e)
      alert("コピーに失敗しました")
    }
  }

  async function copyImage() {
    try {
      const blob = await captureBlob(previewRef.value)

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ])

      alert("画像をコピーしました！")
    } catch (e) {
      console.error(e)
      alert("画像コピーに失敗しました")
    }
  }

  return {
    copyMarkdown,
    copyHTML,
    copyImage
  }
}