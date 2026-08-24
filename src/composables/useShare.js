import { captureBlob } from "@/utils/capture"

export function useShare(previewRef, copyImage) {
  async function getImageFile() {
    const blob = await captureBlob(previewRef.value)
    return new File([blob], "manga.png", { type: blob.type })
  }

  async function shareX(text = "I created a manga with MarkDown!", url = "https://koufuu15.github.io/MangaDown/") {
    const shareUrl = "https://x.com/intent/post?" + new URLSearchParams({ text, url })
    const popup = window.open(shareUrl, "_blank")

    try {
      await copyImage()
      if (popup) popup.focus()
    } catch (e) {
      popup?.close()
      console.error(e)
      alert("画像コピーに失敗しました")
    }
  }

  async function shareFacebook(url = "https://koufuu15.github.io/MangaDown/") {
    const shareUrl = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url)
    const popup = window.open(shareUrl, "_blank")

    try {
      await copyImage()
      if (popup) popup.focus()
    } catch (e) {
      popup?.close()
      console.error(e)
      alert("画像コピーに失敗しました")
    }
  }

  async function shareNative({
    title = "My Manga",
    text = "I created a manga!"
  } = {}) {
    if (!navigator.share) {
      alert("このブラウザは共有機能に対応していません。")
      return
    }

    try {
      const file = await getImageFile()
      const data = { title, text, files: [file] }

      if (navigator.canShare?.(data)) {
        await navigator.share(data)
      } else {
        await navigator.share({ title, text })
      }
    } catch (e) {
      console.error(e)
    }
  }

  return { shareX, shareFacebook, shareNative }
}