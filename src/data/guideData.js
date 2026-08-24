export default [
  {
    id: "getting-started",
    title: "はじめに",
    description:
      "MangaDownでは、通常のMarkdownの中に:::mangaブロックを置いて漫画を作ります。",
    code: `# 【初心者向け】HTTPSとは？
---
Webサイトを見ていると、URLの先頭に https:// と表示されていることがあります。
HTTPSは、Webブラウザとサーバーの間でやり取りするデータを安全に送受信するための仕組みです。

:::manga
# panel
- backgroundColor: #f4f0e8
- position: { x: 0, y: 0 }
- size: { w: 300, h: 300 }

## bubble
- layer: 2
- shape: round
- position: { x: 5, y: 10 }
- size: { w: 150, h: 90 }

### tail
- position: 320

### text
- font: UTF-8
- size: 14
- color: black
- position: { x: 0, y: 0 }
HTTPSでは、
通信が<span style="color: red;">**暗号化**</span>
されるんだ！

## image
- name: girl_standing
- layer: 1
- position: { x: 55, y: 23 }
- size: { w: 120, h: 220 }
:::`
  },

  {
    id: "panel",
    title: "Panel",
    description:
      "Panelは1コマを表します。複数のpanelを並べると、上から順に複数コマになります。",
    code: `:::manga
# panel
- backgroundColor: #eeeeee
- border: solid
- borderWidth: 2
- borderColor: #333333
- position: { x: -80, y: 15 }
- size: { w: 150, h: 150 }

# panel
- backgroundColor: pink
- border: dotted
- borderWidth: 2
- borderColor: rgb(51, 51, 51)
- size: { w: 150, h: 150 }

# panel
- backgroundColor: lightblue
- border: dashed
- borderWidth: 2
- borderColor: gray
- position: { x: 80, y: -333 }
- size: { w: 150, h: 150 }
:::`,
    properties: [
      {
        name: "backgroundColor",
        type: "string",
        description: "背景色",
        default: "#ffffff"
      },
      {
        name: "border",
        type: "string",
        description: "solid/dotted/dashed",
        default: "solid"
      },
      {
        name: "borderWidth",
        type: "number",
        description: "枠線の太さ",
        default: "2"
      },
      {
        name: "borderColor",
        type: "string",
        description: "枠線の色",
        default: "#18181b"
      },
      {
        name: "position",
        type: "{ x, y }",
        description: "位置。単位はpx",
        default: "{ x: 0, y: 0 }"
      },
      {
        name: "size",
        type: "{ w, h }",
        description: "サイズ。単位はpx",
        default: "{ w: 500, h: 500 }"
      }
    ]
  },

  {
    id: "bubble",
    title: "Bubble",
    description:
      "BubbleはPanelの中に吹き出しを追加します。本文を表示するには、子要素としてtextを置きます。",
    code: `:::manga
# panel
- position: { x: 0, y: 10 }
- size: { w: 300, h: 300 }

## bubble
- layer: 1
- shape: thought
- background: #c7e7f4
- border: true
- position: { x: 0, y: 0 }
- size: { w: 180, h: 120 }

## bubble
- layer: 2
- shape: square
- background: lightgreen
- border: true
- borderWidth: 1
- position: { x: 45, y: 20 }
- size: { w: 150, h: 100 }

## bubble
- layer: 3
- shape: star
- background: purple
- border: none
- position: { x: 0, y: 30 }
- size: { w: 200, h: 150 }

## bubble
- layer: 4
- shape: shout
- background: #ffdab3
- border: true
- borderColor: gray
- position: { x: 40, y: 58 }
- size: { w: 170, h: 120 }
:::`,
    properties: [
      {
        name: "layer",
        type: "number",
        description: "重なり順。大きいほど前面",
        default: "0"
      },
      {
        name: "shape",
        type: "string",
        description: "round / square / thought / shout / star",
        default: "round"
      },
      {
        name: "position",
        type: "{ x, y }",
        description: "位置。単位は%",
        default: "{ x: 0, y: 0 }"
      },
      {
        name: "size",
        type: "{ w, h }",
        description: "サイズ。単位はpx",
        default: "{ w: 100, h: 60 }"
      },
      {
        name: "background",
        type: "string",
        description: "塗り色",
        default: "#ffffff"
      },
      {
        name: "border",
        type: "boolean",
        description: "枠線の表示",
        default: "true"
      },
      {
        name: "borderWidth",
        type: "number",
        description: "枠線の太さ",
        default: "3"
      },
      {
        name: "borderColor",
        type: "string",
        description: "枠線の色",
        default: "#111111"
      }
    ]
  },

  {
    id: "text",
    title: "Text",
    description:
      "TextはBubbleの中に配置します。文章はcontentの中に書くほか、\
      何の属性もつけずに書くこともできます。マークダウンや改行も反映されます。",
    code: `:::manga
# panel
- position: { x: 0, y: 10 }
- size: { w: 300, h: 300 }
- backgroundColor: #ccefff

## bubble
- shape: square
- position: { x: 50, y: 2 }
- size: { w: 140, h: 40 }

### text
- size: 13
- color: #111111
- direction: rl
**①sshへの接続**

## bubble
- shape: square
- position: { x: 5, y: 5 }
- size: { w: 40, h: 300 }
- background: transparent
- border: none

### text
- size: 18
- color: 
- direction: tb
CUIを用いて操作します。

## image
- name: terminal-cli
- layer: 1
- position: { x:15, y: 10 }
- size: { w: 250, h: 250 }
:::`,
    properties: [
      {
        name: "content",
        type: "string",
        description: "表示する文章。Markdownとして描画",
        default: "空文字列"
      },
      {
        name: "size",
        type: "number",
        description: "文字サイズ。単位はpx",
        default: "未指定"
      },
      {
        name: "color",
        type: "string",
        description: "文字色",
        default: "未指定"
      },
      {
        name: "direction",
        type: "tb / rl",
        description: "tbは縦書き、rlは横書き",
        default: "rl"
      },
      {
        name: "position",
        type: "{ x, y }",
        description: "文字位置",
        default: "{ x: 0, y: 0 }"
      }
    ]
  },

  {
    id: "tail",
    title: "Tail",
    description:
      "TailはBubbleのしっぽです。1つのBubbleに複数追加できます。",
    code: `:::manga
# panel
- position: { x: 0, y: 10 }
- size: { w: 300, h: 300 }

## bubble
- position: { x: 5, y: 65 }
- size: { w: 180, h: 80 }
- background: pink

### text
- content: "**Wi-Fiが遅いんです!**"

### tail
- shape: triangle
- position: 225
- size: 1
- distance: 47

### tail
- shape: triangle
- position: 250
- size: 1
- distance: 47

## bubble
- shape: thought
- position: { x: 15, y: 5 }
- size: { w: 230, h: 160 }
- background: lightblue

### text
**どの端末？いつから？
もっと詳しく
教えてくれ、、、**

### tail
- shape: circle
- position: 310
- size: 1.5
- distance: 40
:::`,
    properties: [
      {
        name: "shape",
        type: "triangle / circle",
        description: "しっぽの形",
        default: "triangle"
      },
      {
        name: "position",
        type: "number",
        description: "角度。0=右、90=上、180=左、270=下",
        default: "0"
      },
      {
        name: "size",
        type: "number",
        description: "しっぽの倍率。0以上",
        default: "1"
      },
      {
        name: "distance",
        type: "number",
        description: "中心から描画開始位置までの距離。0以上",
        default: "47"
      }
    ]
  },

  {
    id: "image",
    title: "Image",
    description:
      "ImageはPanelの中に画像素材を配置します。nameには組み込み素材、またはアップロード済み素材の名前を指定します。",
    code: `:::manga
# panel
- backgroundColor: lightblue
- size: { w: 300, h: 300 }

## image
- name: boy_arm
- layer: 0
- position: { x: 20, y: 15 }
- size: { w: 220, h: 260 }
:::`,
    properties: [
      {
        name: "name",
        type: "string",
        description: "素材名",
        default: "必須"
      },
      {
        name: "layer",
        type: "number",
        description: "重なり順。大きいほど前面",
        default: "0"
      },
      {
        name: "position",
        type: "{ x, y }",
        description: "位置。単位は%",
        default: "{ x: 0, y: 0 }"
      },
      {
        name: "size",
        type: "{ w, h }",
        description: "サイズ。単位はpx",
        default: "{ w: 100, h: 100 }"
      }
    ]
  }
]