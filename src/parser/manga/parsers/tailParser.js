export default function parseTail(
  bubble,
  key,
  value,
  state
) {
  if (!bubble.tail) {
    bubble.tail = {}
  }

  switch (key) {

    case "shape":
      if (
        value !== "triangle" &&
        value !== "circle"
      ) {
        state.errMsg =
          "tailのshapeはtriangleまたはcircleで指定してください"
      } else {
        bubble.tail.shape = value
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
        bubble.tail.position = position
      }

      break
    }
  }
}