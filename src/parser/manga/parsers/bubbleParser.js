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

    case "backgroundColor":
      bubble.backgroundColor = value
      break
  }
}