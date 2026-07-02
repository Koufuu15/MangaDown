let json
let errMsg = ""
const IMG_BASE_URL = "src/data/images"
import JSON5 from "json5"

export default function parseManga(json5Text){
  console.log("txt" + json5Text)
  
  try {
    json = JSON5.parse(json5Text)
  } catch (e) {
    console.error(e)
  }

  console.log("json"+json)

  return{
    panels: json.panels.map(parsePanel),
    errMsg
  }
}

function parsePanel(panel){
  return{
    position: {
      x: (panel.position?.x ?? 0) + "px",
      y: (panel.position?.y ?? 0) + "px"
    },
    size: {
      width: (panel.size?.width ?? 80) + "px",
      height: (panel.size?.height ?? 80) + "px"
    },
    backgroundImg: (IMG_BASE_URL + panel.backgroundImg) ?? null,
    backgroundColor: panel.backgroundColor ??  "#eee",
    components: panel.components.map(parseComponent)
  }
}

function parseComponent(component){
  if (component.bubble) {
    return {
      bubble: component.bubble.map(parseBubble)
    }
  }
}

function parseBubble(bubble){
  if(isNaN(bubble.layer)){
    errMsg = "layerには数値しか代入できません。"
    return
  }

  if(isNaN(bubble.text.fontSize)){
    errMsg = "bubble.text.fontSizeには数値しか代入できません。"
    return
  }

  return{
    "z-index": 9999 - bubble.layer,
    position: {
      x: (bubble.position?.x ?? 0) + "px",
      y: (bubble.position?.y ?? 0) + "px"
    },
    size: {
      width: (bubble.size?.width ?? 80) + "px",
      height: (bubble.size?.height ?? 80) + "px"
    },
    backgroundColor: bubble.backgroundColor ??  "white",
    text: {
      content: bubble.text.content ?? "",
      fontSize: (bubble.text.fontSize ?? 14) + "px"
    }
  }
}