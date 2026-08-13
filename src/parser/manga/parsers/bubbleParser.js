import parseObject from "../utils/parseObject"

export default function parseBubble(
  bubble,
  key,
  value,
  state
) {
  switch (key) {

    case "layer":
      if (isNaN(Number(value))) {
        state.errMsg = "layerは数値で入力してください"
      } else {
        bubble.layer = Number(value)
      }
      break

    case "shape":
      bubble.shape = value
      break

    case "position": {
      const pos = parseObject(value)

      bubble.position = {
        x: pos.x ?? 0,
        y: pos.y ?? 0
      }

      break
    }

    case "size": {
      const size = parseObject(value)

      bubble.size = {
        width: size.w ?? 100,
        height: size.h ?? 60
      }

      break
    }

    case "background":
      bubble.background = value
      break

    case "border":
      bubble.border = value === true || value === "true"
      break

    case "borderWidth":
      if (isNaN(Number(value))) {
        state.errMsg = "borderWidthは数値で入力してください"
      } else {
        bubble.borderWidth = Number(value)
      }
      break

    case "borderColor":
      bubble.borderColor = value
      break

    // =========================
    // text
    // =========================

    case "text":
      if (!bubble.text) {
        bubble.text = {
          content: "",
          color: null,
          size: null,
          position: null
        }
      }

      bubble.text.content = value
      break

    case "text.color":
      if (!bubble.text) {
        bubble.text = {
          content: "",
          color: null,
          size: null,
          position: null
        }
      }

      bubble.text.color = value
      break

    case "text.size":
      if (!bubble.text) {
        bubble.text = {
          content: "",
          color: null,
          size: null,
          position: null
        }
      }

      if (isNaN(Number(value))) {
        state.errMsg = "text.sizeは数値で入力してください"
      } else {
        bubble.text.size = Number(value)
      }

      break

    case "text.position": {
      if (!bubble.text) {
        bubble.text = {
          content: "",
          color: null,
          size: null,
          position: null
        }
      }

      const pos = parseObject(value)

      bubble.text.position = {
        x: pos.x ?? 0,
        y: pos.y ?? 0
      }

      break
    }
  }
}