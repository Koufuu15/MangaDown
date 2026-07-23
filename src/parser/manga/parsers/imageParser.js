import parseObject from "../utils/parseObject"

export default function parseImage(
  image,
  key,
  value,
  state
) {
  switch (key) {

    case "layer":
      if (isNaN(Number(value))) {
        state.errMsg = "layerは数値で入力してください"
      } else {
        image.layer = Number(value)
      }
      break

    case "name":
      image.name = value
      break

    case "position": {
      const pos = parseObject(value)

      image.position = {
        x: pos.x ?? 0,
        y: pos.y ?? 0
      }

      break
    }

    case "size": {
      const size = parseObject(value)

      image.size = {
        width: size.w ?? 100,
        height: size.h ?? 100
      }

      break
    }
  }
}