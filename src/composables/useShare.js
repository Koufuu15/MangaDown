export function useShare(copyImage) {
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

  async function shareNative({ title = "My Manga", text = "I created a manga!", url = window.location.href } = {}) {
    if (!navigator.share) return alert("このブラウザは共有機能に対応していません。")
    try {
      await navigator.share({ title, text, url })
    } catch (e) {
      console.error(e)
    }
  }

  return { shareX, shareFacebook, shareNative }
}