import createParserState from "./parserState"

import parsePanel from "./parsers/panelParser"
import parseImage from "./parsers/imageParser"
import parseBubble from "./parsers/bubbleParser"
import parseText from "./parsers/textParser"

export default function parseManga(md) {
  if (!md || md.trim() === "") {
    return {
      panels: [],
      errMsg: ""
    }
  }

  const panel = {
    components: []
  }

  const state = createParserState()

  const lines = md.split(/\r?\n/)

  for (const raw of lines) {
    const line = raw.trim()

    if (!line) continue

    if (line.startsWith("# panel")) {
      state.section = "panel"
      continue
    }

    if (line.startsWith("## components")) {
      state.section = "components"
      continue
    }

    if (line.startsWith("### bubble")) {
      state.currentBubble = {}
      panel.components.push({
        bubble: [state.currentBubble]
      })
      state.section = "bubble"
      continue
    }

    if (line.startsWith("#### text")) {
      state.section = "text"
      continue
    }

    if (line.startsWith("### image")) {
      state.currentImage = {}
      panel.components.push({
        image: [state.currentImage]
      })
      state.section = "image"
      continue
    }

    if (!line.startsWith("-")) continue

    const idx = line.indexOf(":")
    if (idx === -1) continue

    const key = line.substring(1, idx).trim()
    const value = line.substring(idx + 1).trim()

    switch (state.section) {
      case "panel":
        parsePanel(panel, key, value)
        break

      case "bubble":
        parseBubble(state.currentBubble, key, value, state)
        break

      case "image":
        parseImage(state.currentImage, key, value, state)
        break

      case "text":
        parseText(state.currentBubble, key, value)
        break
    }
  }

  panel.components.sort((a, b) => {
    const layerA =
        a.bubble?.[0]?.layer ?? a.image?.[0]?.layer ?? 0
    const layerB =
        b.bubble?.[0]?.layer ?? b.image?.[0]?.layer ?? 0

    return layerA - layerB
  })

  return {
    panels: [panel],
    errMsg: state.errMsg
  }
}