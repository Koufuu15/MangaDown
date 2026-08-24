import parseObject from "../utils/parseObject"

export default function parseText(
  bubble,
  key,
  value
) {
  if (!bubble.text) {
    bubble.text = {}
  }

  switch (key) {
    case "content":
      bubble.text.content = value.replace(/^"/, "").replace(/"$/, "")
      break

    case "font":
      bubble.text.font = value
      break

    case "size":
      bubble.text.fontSize = value + "px"
      break

    case "color":
      bubble.text.color = value
      break

    case "direction":
      if (value !== "tb" && value !== "rl") {
        bubble.text.direction = "rl"
      } else {
        bubble.text.direction = value
      }
      break

    case "position":
      bubble.text.position = parseObject(value)
      break
  }
}