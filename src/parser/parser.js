const DEFAULT_PANEL = {
  position: { x: 0, y: 0 },
  size: { width: 500, height: 500 },
  backgroundColor: "#eee",
  components: []
}

export default function parseManga(md) {
  if (!md || md.trim() === "") {
    return {
      panels: [],
      errMsg: ""
    }
  }

  const panel = structuredClone(DEFAULT_PANEL)
  let currentBubble = null
  let errMsg = ""
  let section = ""

  const lines = md.split(/\r?\n/)

  for (const raw of lines) {
    const line = raw.trim()

    if (!line) continue

    if (line.startsWith("# panel")) continue

    if (line.startsWith("## background")) {
      section = "background"
      continue
    }

    if (line.startsWith("## components")) {
      section = "components"
      continue
    }

    if (line.startsWith("### bubble")) {
      currentBubble = {
        layer: 1,
        shape: "square",
        position: {
          x: 0,
          y: 0
        },
        size: {
          width: 120,
          height: 80
        },
        backgroundColor: "white",
        text: {
          content: "",
          font: "UTF-8",
          fontSize: "16px",
          color: "#333"
        }
      }

      panel.components.push({
        bubble: [currentBubble]
      })

      section = "bubble"
      continue
    }

    if (line.startsWith("#### text")) {
      section = "text"
      continue
    }

    if (!line.startsWith("-")) continue

    const idx = line.indexOf(":")
    if (idx === -1) continue

    const key = line.substring(1, idx).trim()
    const value = line.substring(idx + 1).trim()

    if (section === "background") {
      switch (key) {
        case "color":
          panel.backgroundColor = value
          break

        case "position": {
          const pos = parseObject(value)
          panel.position = {
            x: pos.x ?? 0,
            y: pos.y ?? 0
          }
          break
        }

        case "size": {
          const size = parseObject(value)
          panel.size = {
            width: size.w ?? 500,
            height: size.h ?? 500
          }
          break
        }
      }
      continue
    }

    if (section === "bubble") {
      switch (key) {
        case "layer":
          if (isNaN(Number(value))) {
            errMsg = "layerは数値で入力してください"
          } else {
            currentBubble.layer = Number(value)
          }
          break

        case "shape":
          currentBubble.shape = value
          break

        case "position": {
          const pos = parseObject(value)
          currentBubble.position = {
            x: pos.x ?? 0,
            y: pos.y ?? 0
          }
          break
        }

        case "size": {
          const size = parseObject(value)
          currentBubble.size = {
            width: size.w ?? 100,
            height: size.h ?? 60
          }
          break
        }
      }
      continue
    }

    if (section === "text") {
      switch (key) {
        case "content":
          currentBubble.text.content = value.replace(/^"/, "").replace(/"$/, "")
          break

        case "font":
          currentBubble.text.font = value
          break

        case "size":
          currentBubble.text.fontSize = value + "px"
          break

        case "color":
          currentBubble.text.color = value
          break
      }
    }
  }

  panel.components.sort((a, b) => a.bubble[0].layer - b.bubble[0].layer)

  return {
    panels: [panel],
    errMsg
  }
}

function parseObject(str) {
  const result = {}

  const body = str
    .replace("{", "")
    .replace("}", "")

  body.split(",").forEach(item => {
    const [k, v] = item.split(":")
    if (!k || !v) return
    result[k.trim()] = Number(v.trim())
  })

  return result
}