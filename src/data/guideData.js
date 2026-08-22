export default [
  {
    id: "getting-started",
    title: "はじめに",
    description:
      "MangaDownでは、通常のMarkdownの中に:::mangaブロックを置いて漫画を作ります。",
    code: `# 漫画の説明

通常のMarkdown本文はそのまま表示されます。

:::manga
# panel
- backgroundColor: #f4f0e8
- position: { x: 0, y: 0 }
- size: { w: 300, h: 200 }

## bubble
- layer: 1
- shape: round
- position: { x: 20, y: 18 }
- size: { w: 200, h: 100 }

### text
- content: "こんにちは！"
- font: UTF-8
- size: 18
- color: black
- position: { x: 0, y: 0 }

## image
- name: boy_arm
- layer: 0
- position: { x: 20, y: 20 }
- size: { w: 150, h: 150 }

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
- position: { x: 0, y: 0 }
- size: { w: 300, h: 300 }
:::`,
    properties: [
      {
        name: "backgroundColor",
        type: "string",
        description: "背景色",
        default: "表示側の既定色"
      },
      {
        name: "backgroundImage",
        type: "string",
        description: "背景画像の値",
        default: "なし"
      },
      {
        name: "border",
        type: "string",
        description: "枠線のスタイル",
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
- size: { w: 300, h: 300 }

## bubble
- layer: 1
- shape: thought
- background: #ffffff
- border: true
- position: { x: 25, y: 20 }
- size: { w: 220, h: 120 }
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
      "TextはBubbleの中に配置します。contentは属性として書くほか、属性でない行を本文として書くこともできます。",
    code: `:::manga
# panel
- size: { w: 300, h: 300 }

## bubble
- position: { x: 25, y: 20 }
- size: { w: 220, h: 120 }

### text
- size: 20
- color: #111111
- direction: rl
これは本文です。
複数行も書けます。
:::`,
    properties: [
      {
        name: "content",
        type: "string",
        description: "表示する文章。Markdownとして描画",
        default: "空文字列"
      },
      {
        name: "font",
        type: "string",
        description: "フォント名",
        default: "実装依存"
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
- size: { w: 300, h: 300 }

## bubble
- position: { x: 30, y: 20 }
- size: { w: 220, h: 120 }

### text
- content: "右下を指す吹き出し"

### tail
- shape: triangle
- position: 225
- size: 1
- distance: 47
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
  },

  {
    id: "layer-position-size",
    title: "共通ルール",
    description:
      "位置・サイズ・重なり順は、要素を調整するときに最もよく使う属性です。単位の違いに注意してください。",
    code: `:::manga
# panel
- position: { x: 0, y: 0 }
- size: { w: 300, h: 300 }

## image
- name: boy_arm
- layer: 0
- position: { x: 10, y: 10 }
- size: { w: 200, h: 200 }

## bubble
- layer: 1
- position: { x: 35, y: 20 }
- size: { w: 180, h: 90 }
:::`,
    notes: [
      "Panelのpositionはpx、BubbleとImageのpositionはパーセントです。",
      "sizeのwとhはすべてpxです。",
      "layerが大きい要素ほど前面に表示されます。"
    ]
  }
]