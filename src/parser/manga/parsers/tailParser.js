export default function parseTail(
  tail,
  key,
  value,
  state
) {
  switch (key) {

    case "shape":
      if (
        value !== "triangle" &&
        value !== "circle"
      ) {
        state.errMsg =
          "tailのshapeはtriangleまたはcircleで指定してください"
      } else {
        tail.shape = value
      }
      break

    case "position": {
      const position = Number(value)

      if (
        isNaN(position) ||
        position < 0 ||
        position > 360
      ) {
        state.errMsg =
          "tailのpositionは0〜360の数値で指定してください"
      } else {
        tail.position = position
      }

      break
    }

    case "size": {
      const size = Number(value)

      if (isNaN(size) || size < 0) {
        state.errMsg =
          "tailのsizeは0以上の数値で指定してください"
      } else {
        tail.size = size
      }

      break
    }

    case "distance": {
      const distance = Number(value)

      if (isNaN(distance) || distance < 0) {
        state.errMsg =
          "tailのdistanceは0以上の数値で指定してください"
      } else {
        tail.distance = distance
      }

      break
    }
  }
}