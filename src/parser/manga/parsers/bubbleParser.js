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

    case "tail": {
      const tail = parseObject(value)

      const tailShape = tail.shape
      const tailPosition = Number(tail.position)

      if (
        tailShape !== "triangle" &&
        tailShape !== "circle"
      ) {
        state.errMsg = "tailのshapeはtriangleまたはcircleで指定してください"
        break
      }

      if (
        isNaN(tailPosition) ||
        tailPosition < 0 ||
        tailPosition > 360
      ) {
        state.errMsg = "tailのpositionは0〜360の数値で指定してください"
        break
      }

      bubble.tail = {
        shape: tailShape,
        position: tailPosition
      }

      break
    }
  }
}