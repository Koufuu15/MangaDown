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
  }
}