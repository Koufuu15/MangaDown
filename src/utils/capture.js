import * as htmlToImage from "html-to-image"

/**
 * Preview全体をPNG(DataURL)として取得
 */
export async function capturePNG(node) {
  const scale = 4

  return await htmlToImage.toPng(node, {
    pixelRatio: scale,

    canvasWidth: node.scrollWidth * scale,
    canvasHeight: node.scrollHeight * scale,

    width: node.scrollWidth,
    height: node.scrollHeight,

    cacheBust: true,

    style: {
      overflow: "visible",
      height: `${node.scrollHeight}px`
    }
  })
}

/**
 * Preview全体をBlobとして取得
 */
export async function captureBlob(node) {
  const scale = 4

  return await htmlToImage.toBlob(node, {
    pixelRatio: scale,

    canvasWidth: node.scrollWidth * scale,
    canvasHeight: node.scrollHeight * scale,

    width: node.scrollWidth,
    height: node.scrollHeight,

    cacheBust: true,

    style: {
      overflow: "visible",
      height: `${node.scrollHeight}px`
    }
  })
}