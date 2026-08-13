import createParserState from "./parserState"

import parsePanel from "./parsers/panelParser"
import parseImage from "./parsers/imageParser"
import parseBubble from "./parsers/bubbleParser"
import parseText from "./parsers/textParser"
import parseTail from "./parsers/tailParser"

export default function parseManga(md) {
  if (!md || md.trim() === "") {
    return {
      panels: [],
      errMsg: ""
    }
  }

  const state = createParserState()

  const panels = []
  let currentPanel = null

  const lines = md.split(/\r?\n/)

  for (const raw of lines) {
    const line = raw.trim()

    // --------------------------------
    // Panel開始
    // --------------------------------
    if (line.startsWith("# panel")) {
      currentPanel = {
        components: []
      }

      panels.push(currentPanel)

      state.currentBubble = null
      state.currentTail = null
      state.currentImage = null
      state.section = "panel"

      continue
    }

    // --------------------------------
    // Bubble開始
    // --------------------------------
    if (line.startsWith("## bubble")) {
      if (!currentPanel) continue

      state.currentBubble = {
        tail: [],
        text: {
          content: ""
        }
      }

      currentPanel.components.push({
        bubble: [state.currentBubble]
      })

      state.currentTail = null
      state.section = "bubble"

      continue
    }

    // --------------------------------
    // Bubble内 Text開始
    // --------------------------------
    if (line.startsWith("### text")) {
      if (!state.currentBubble) continue

      if (!state.currentBubble.text) {
        state.currentBubble.text = {
          content: ""
        }
      }

      state.section = "text"

      continue
    }

    // --------------------------------
    // Bubble内 Tail開始
    // --------------------------------
    if (line.startsWith("### tail")) {
      if (!state.currentBubble) continue

      state.currentTail = {}

      state.currentBubble.tail.push(
        state.currentTail
      )

      state.section = "tail"

      continue
    }

    // --------------------------------
    // Image開始
    // --------------------------------
    if (line.startsWith("## image")) {
      if (!currentPanel) continue

      state.currentImage = {}

      currentPanel.components.push({
        image: [state.currentImage]
      })

      state.currentBubble = null
      state.currentTail = null
      state.section = "image"

      continue
    }

    // --------------------------------
    // Text
    // --------------------------------
    if (state.section === "text") {

      // 属性行
      if (line.startsWith("-")) {
        const idx = line.indexOf(":")

        if (idx !== -1) {
          const key = line.substring(1, idx).trim()
          const value = line.substring(idx + 1).trim()

          parseText(
            state.currentBubble,
            key,
            value
          )

          continue
        }
      }

      // 本文
      if (state.currentBubble?.text) {
        const content = state.currentBubble.text.content

        if (content === "") {
          state.currentBubble.text.content = raw
        } else {
          state.currentBubble.text.content += "\n" + raw
        }
      }

      continue
    }

    // --------------------------------
    // 空行
    // --------------------------------
    if (!line) {
      if (
        state.section === "text" &&
        state.currentBubble?.text
      ) {
        const content = state.currentBubble.text.content

        if (content !== "") {
          state.currentBubble.text.content += "\n"
        }
      }

      continue
    }

    // --------------------------------
    // 通常の属性
    // --------------------------------
    if (!line.startsWith("-")) continue

    const idx = line.indexOf(":")
    if (idx === -1) continue

    const key = line.substring(1, idx).trim()
    const value = line.substring(idx + 1).trim()

    switch (state.section) {
      case "panel":
        if (currentPanel) {
          parsePanel(
            currentPanel,
            key,
            value
          )
        }
        break

      case "bubble":
        parseBubble(
          state.currentBubble,
          key,
          value,
          state
        )
        break

      case "tail":
        parseTail(
          state.currentTail,
          key,
          value,
          state
        )
        break

      case "image":
        parseImage(
          state.currentImage,
          key,
          value,
          state
        )
        break
    }
  }

  panels.forEach(panel => {
    panel.components.sort((a, b) => {
      const layerA =
        a.bubble?.[0]?.layer ??
        a.image?.[0]?.layer ??
        0

      const layerB =
        b.bubble?.[0]?.layer ??
        b.image?.[0]?.layer ??
        0

      return layerA - layerB
    })
  })

  return {
    panels,
    errMsg: state.errMsg
  }
}