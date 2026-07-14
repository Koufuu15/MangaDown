export function useShare() {

  /**
   * X(Twitter)
   */
  function shareX(
    text = "I created a manga!",
    url = window.location.href
  ) {
    const shareUrl =
      "https://twitter.com/intent/tweet?" +
      new URLSearchParams({
        text,
        url
      })

    window.open(
      shareUrl,
      "_blank",
      "noopener,noreferrer"
    )
  }

  /**
   * Facebook
   */
  function shareFacebook(
    url = window.location.href
  ) {
    const shareUrl =
      "https://www.facebook.com/sharer/sharer.php?u=" +
      encodeURIComponent(url)

    window.open(
      shareUrl,
      "_blank",
      "noopener,noreferrer"
    )
  }

  /**
   * Web Share API
   * （スマホではInstagramなどを選べる場合がある）
   */
  async function shareNative({
    title = "My Manga",
    text = "I created a manga!",
    url = window.location.href
  } = {}) {

    if (!navigator.share) {
      alert("このブラウザは共有機能に対応していません。")
      return
    }

    try {
      await navigator.share({
        title,
        text,
        url
      })
    } catch (e) {
      console.error(e)
    }
  }

  return {
    shareX,
    shareFacebook,
    shareNative
  }

}