// src/data/guideData.js

export default [

{
    id: "getting-started",
    title: "はじめに",
    level: "basic",
    description:
        "漫画は :::manga ～ ::: の中に記述します。通常のMarkdownと組み合わせて利用できます。",

    code: `# はじめての漫画

通常のMarkdownはそのまま表示されます。

:::manga
# panel
- backgroundColor: #eeeeee
- position: { x:0, y:0 }
- size: { w:300, h:300 }

## components

### bubble
- layer: 1
- shape: square
- position: { x:30, y:30 }
- size: { w:40, h:30 }

#### text
- content: "こんにちは！"
- font: UTF-8
- size: 18
- color: black
- position: { x:0, y:0 }

###
images
- name: tarou
- layer: 0
- position: { x:180, y:20 }
- size: { w:180, h:180 }

:::
`
},

{
    id: "panel",
    title: "Panel",
    level: "basic",

    description:
        "Panelは1コマを表します。複数書くことで複数ページ・複数コマを作れます。",

    code: `:::manga

# panel
- backgroundColor: #eeeeee
- position: { x:0, y:0 }
- size: { w:300, h:300 }

# panel
- backgroundColor: #eeeeee
- position: { x:0, y:0 }
- size: { w:300, h:300 }
## components

:::
`,

    properties: [

        {
            name: "backgroundColor",
            type: "color",
            description: "背景色"
        },

        {
            name: "position",
            type: "object",
            description: "配置"
        },

        {
            name: "size",
            type: "object",
            description: "サイズ"
        }

    ]
},

{
    id: "bubble",
    title: "Bubble",
    level: "basic",

    description:
        "吹き出しを追加します。現時点では後にtext要素が必須です。",

    code: `:::manga

# panel
- backgroundColor: #eeeeee
- position: { x:0, y:0 }
- size: { w:300, h:300 }

## components

### bubble
- layer: 1
- shape: square
- position: { x:35, y:30 }
- size: { w:100, h:100 }

#### text
- content: ""
- font: UTF-8
- size: 18
- color: black
- position: { x:0, y:0 }
:::

`,

    properties: [

        {
            name: "shape",
            type: "string",
            description: "吹き出しの形"
        },

        {
            name: "layer",
            type: "number",
            description: "重なり順"
        },

        {
            name: "position",
            type: "object",
            description: "配置"
        },

        {
            name: "size",
            type: "object",
            description: "サイズ"
        }

    ]
},

{
    id: "text",
    title: "Text",
    level: "basic",

    description:
        "TextはBubbleの中に配置します。",

    code: `:::manga

# panel
- backgroundColor: #eeeeee
- position: { x:0, y:0 }
- size: { w:300, h:300 }

## components

### bubble
- layer: 1
- shape: square
- position: { x:40, y:40 }
- size: { w:40, h:30 }

#### text
- content: "こんにちは！"
- font: UTF-8
- size: 20
- color: black
- position: { x:0, y:0 }

:::
`,

    properties: [

        {
            name: "content",
            type: "string",
            description: "表示する文章"
        },

        {
            name: "font",
            type: "string",
            description: "フォント"
        },

        {
            name: "size",
            type: "number",
            description: "文字サイズ"
        },

        {
            name: "color",
            type: "string",
            description: "文字色"
        },

        {
            name: "position",
            type: "object",
            description: "文字位置"
        }

    ]
},

{
    id: "images",
    title: "Images",
    level: "basic",

    description:
        "画像素材を配置します。nameにはアップロード済み、または組み込み画像の名前を指定します。",

    code: `:::manga

# panel
- backgroundColor: lightblue
- position: { x:0, y:0 }
- size: { w:300, h:300 }

## components

### image
- name: tarou
- layer: 1
- position: { x:20, y:20 }
- size: { w:180, h:220 }

:::
`,

    properties: [

        {
            name: "name",
            type: "string",
            description: "画像名"
        },

        {
            name: "layer",
            type: "number",
            description: "重なり順"
        },

        {
            name: "position",
            type: "object",
            description: "配置"
        },

        {
            name: "size",
            type: "object",
            description: "サイズ"
        }

    ]
},

{
    id: "position",
    title: "Position",
    level: "advanced",

    description:
        "positionでパネルや吹き出しの配置を変更します。",

    code: `:::manga

# panel
- backgroundColor: #eeeeee
- position: { x:-80, y:0 }
- size: { w:150, h:300 }

## components

# panel
- backgroundColor: yellow
- position: { x:80, y:-324 }
- size: { w:150, h:300 }

## components

:::
`
},

{
    id: "size",
    title: "Size",
    level: "advanced",

    description:
        "sizeで要素のサイズを変更できます。",

    code: `:::manga

# panel
- backgroundColor: #eeeeee
- position: { x:0, y:0 }
- size: { w:100, h:200 }

## components

:::
`
},

{
    id: "layer",
    title: "Layer",
    level: "advanced",

    description:
        "layerが大きいほど手前に表示されます。",

    code: `:::manga

# panel
- backgroundColor: #eeeeee
- position: { x:0, y:0 }
- size: { w:300, h:300 }

## components

### bubble
- layer: 1
- shape: square
- position: { x:20, y:20 }
- size: { w:80, h:80 }

#### text
- content: "後面に表示"
- font: UTF-8
- size: 18
- color: black
- position: { x:0, y:0 }

### bubble
- layer: 2
- shape: square
- position: { x:40, y:35 }
- size: { w:80, h:80 }

#### text
- content: "前面に表示"
- font: UTF-8
- size: 18
- color: black
- position: { x:0, y:0 }

:::
`
}
]