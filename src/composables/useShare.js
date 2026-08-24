import { ref } from "vue"
import { captureBlob } from "@/utils/capture"

export function useShare(previewRef, copyImage) {
  const shareStatus = ref("idle")
  const isSharing = ref(false)

  async function getImageFile() {
    const blob = await captureBlob(previewRef.value)
    return new File([blob], "manga.png", { type: blob.type })
  }

  async function shareX(text = "I created a manga with MarkDown!", url = "https://koufuu15.github.io/MangaDown/") {
    if (isSharing.value) return
    isSharing.value = true
    shareStatus.value = "preparing"

    try {
      await copyImage()
      shareStatus.value = "copied"
      await new Promise(resolve => setTimeout(resolve, 600))
      shareStatus.value = "opening"

      const shareUrl = "https://x.com/intent/post?" + new URLSearchParams({ text, url })
      const popup = window.open(shareUrl, "_blank")

      if (!popup) {
        alert("Xを開けませんでした。ポップアップがブロックされていないか確認してください。")
      } else {
        popup.focus()
      }

      await new Promise(resolve => setTimeout(resolve, 300))
    } catch (e) {
      console.error(e)
      alert("画像コピーに失敗しました")
    } finally {
      isSharing.value = false
      shareStatus.value = "idle"
    }
  }

  async function shareFacebook(url = "https://koufuu15.github.io/MangaDown/") {
    if (isSharing.value) return
    isSharing.value = true
    shareStatus.value = "preparing"

    try {
      await copyImage()
      shareStatus.value = "copied"
      await new Promise(resolve => setTimeout(resolve, 600))
      shareStatus.value = "opening"

      const shareUrl = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url)
      const popup = window.open(shareUrl, "_blank")

      if (!popup) {
        alert("Facebookを開けませんでした。ポップアップがブロックされていないか確認してください。")
      } else {
        popup.focus()
      }

      await new Promise(resolve => setTimeout(resolve, 300))
    } catch (e) {
      console.error(e)
      alert("画像コピーに失敗しました")
    } finally {
      isSharing.value = false
      shareStatus.value = "idle"
    }
  }

  async function shareNative({ title = "My Manga", text = "I created a manga!" } = {}) {
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

  return { shareX, shareFacebook, shareNative, shareStatus, isSharing }
}