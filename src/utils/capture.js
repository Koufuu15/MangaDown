import * as htmlToImage from "html-to-image"

/**
 * Preview全体をPNG(DataURL)として取得
 */
export async function capturePNG(node) {
  return await htmlToImage.toPng(node, {
    canvasWidth: node.scrollWidth,
    canvasHeight: node.scrollHeight,
    width: node.scrollWidth,
    height: node.scrollHeight,
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
  return await htmlToImage.toBlob(node, {
    canvasWidth: node.scrollWidth,
    canvasHeight: node.scrollHeight,
    width: node.scrollWidth,
    height: node.scrollHeight,
    style: {
      overflow: "visible",
      height: `${node.scrollHeight}px`
    }
  })
}