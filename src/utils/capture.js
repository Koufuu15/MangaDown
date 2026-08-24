import * as htmlToImage from "html-to-image"

const SCALE = 4
const PADDING_X = 40

function getOptions(node) {
  const width = node.scrollWidth
  const height = node.scrollHeight

  return {
    pixelRatio: SCALE,
    width: width + PADDING_X,
    height,
    backgroundColor: "#ffffff",
    style: {
      paddingLeft: `${PADDING_X}px`,
      paddingRight: `${PADDING_X}px`,
      boxSizing: "border-box",
      overflow: "visible",
      maxHeight: "none",
      height: `${height}px`
    }
  }
}

export function capturePNG(node) {
  return htmlToImage.toPng(node, getOptions(node))
}

export function captureBlob(node) {
  return htmlToImage.toBlob(node, getOptions(node))
}