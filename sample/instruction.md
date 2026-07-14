# 技術スタック
- Vue3
- Node.js

# ファイル構成
- public
  - favicon.ico
- index.html
- src
  - assets
  - components
    - manga
      - Bubble.vue
      - Panel.vue
      - Viewer.vue
    - Home.vue
    - parseUrl.vue
    - save.vue
    - writeMD.vue
  - parser
    - parser.js
  - router
    - index.js
  - App.vue
  - main.js

# 主要ファイルの中身

## index.html
```html
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" href="/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MangaDown</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

## index.js
```js
import { createRouter, createWebHistory } from 'vue-router'
import parseUrl from '../components/parseUrl.vue'
import resMd from '../components/parseUrl.vue'
import writeMD from '../components/writeMD.vue'
import Home from '../components/Home.vue'
import save from '../components/save.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/parse-url',
      name: 'ParseUrl',
      component: parseUrl
    },
    {
      path: '/write-md',
      name: 'WriteMD',
      component: writeMD,
      props: {
        dataMd: resMd.value
      }
    },
    {
      path: '/save',
      name: 'Save',
      component: save
    }
  ]
})

export default router
```

## parser.js
```js
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
```

## App.vue
```vue
<template>
  <router-view />
</template>
```

## main.js
```js
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import router from './router'

createApp(App).use(router).mount('#app')
```

## Bubble.vue
```vue
<script setup>
defineProps({
  bubble: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div
    :style="{
      position: 'absolute',
      left: `${bubble.position.x}%`,
      top: `${bubble.position.y}%`,
      border: '1px solid black',
      backgroundColor: 'white',
      padding: '8px',
      fontSize: '14px'
    }"
  >
    {{ bubble.text }}
  </div>
</template>
```

## Panel.vue
```vue
<script setup>
defineProps({
  panel: {
    type: Object,
  }
})
</script>

<template>
  <div class="panel"
    :style="{
      left: panel.position.x,
      top: panel.position?.y,
      width: panel.size?.width,
      height: panel.size?.height,
      backgroundImage: panel.backgroundImg,
      backgroundColor: panel.backgroundColor
    }"
  ></div>
  <div
    v-for="(component, index) in panel.components"
    :key="index"
  >
    <!-- Character -->
    <img
      v-if="component.character"
      v-for="component in component.character"
      :src="`$src\data\images{component.name}`"
      :alt="component.name"
      :style="{
        position: 'absolute',
        left: `${character.position.x}%`,
        top: `${character.position.y}%`,
        width: `${character.size?.w || 80}px`,
        height: `${character.size?.h || 120}px`,
        objectFit: 'contain'
      }"
    />

    <!-- Bubble -->
    <div
      v-else-if="component.bubble"
      v-for="bubble in component.bubble"
      :style="{
        left: bubble.position.x,
        top: bubble.position?.y,
        width: bubble.size?.width,
        height: bubble.size?.height,
        border: '1px solid black',
        backgroundColor: bubble.backgroundColor,
        padding: '8px',
        fontSize: bubble.text.fontSize
      }"
    >
    {{ bubble.text.content }}
    </div>
  </div>
</template>

<style scoped>
.panel {
  position: absolute;
  border: 1px solid black;
  background: white;
  overflow: hidden;
}
</style>
```
   
## Viewer.vue
```vue
<script setup>
import Panel from "./Panel.vue"

const props = defineProps({
  panels: {
    type: Array,
    default: () => []
  }
})
console.log(props.panels)
</script>

<template>
  <div class="viewer">
    <Panel
      v-for="(panel, index) in panels"
      :key="index"
      :panel="panel"
    />
  </div>
</template>

<style scoped>
.viewer {
  display:flex; 
  flex-direction:column; 
  gap:0; 
  align-items:center;
  position: relative;
  width: 80px;
  height: 80px;
  border: 1px solid #ccc;
}
</style>
```

## Home.vue
```vue
<script setup>
import '../assets/main.css'

import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <header class="manga">
    <img alt="Vue logo" class="logo" src="../public/favicon.ico"/>

    <div class="wrapper">
      <h1>MangaDown</h1>
      <p>Visualize your articles with manga</p>
    </div>
  </header>

  <main>
    <div class="manga">
      <p>01</p>
      <h3>既存の技術記事をAIで漫画化</h3>
      <input type="button" value="記事を読み込む" @click="router.push('/parse-url')" />
    </div>
    <div class="manga">
      <p>02</p>
      <h3>独自MarkDownを用いて、一から漫画を作成</h3>
      <input type="button" value="漫画を作る" @click="router.push('/write-md')" />
    </div>
    <div class="manga">
      <p>使い方は</p>
      <a href="">こちら</a>
    </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
```

## parseUrl.vue
```vue
<template>
  <label for="url">WebサイトのURLを入力</label><br>
  <input id="url" type="url" placeholder="URLを入力" v-model="url"/>
  <input type="button" value="読み込む" @click="parseUrl"/>

  <div class="flexbox">
    <div class="manga">
      <p v-if="isLoading">Thinking...</p>
      <p v-else-if="!url">URLを入力してください</p>
      <p v-else-if="resMd">{{ resMd }}</p>
      <p v-else-if="!res">データの取得に失敗しました</p>
    </div>
    <div class="manga">
      <p v-if="resImg" v-html="resImg"></p>
      <p v-else>プレビュー</p>
    </div>
  </div>

  <input type="button" value="エディタで編集" @click="gotoEditor(resMd)"/>
  <input type="button" value="このまま公開" @click="$router.push('/save')"/>
  <input type="button" value="ホームに戻る" @click="$router.push('/')"/>
</template>

<script setup>
import { ref } from 'vue'
import '../assets/main.css'

import { useRouter } from 'vue-router'
const router = useRouter()

const url = ref('')
const resMd = ref('')
const resImg = ref('')
const isLoading = ref(false)

function gotoEditor(md) {
  localStorage.setItem('content', md)
  router.push('/write-md')
}

function parseUrl() {
  /*
  ここでURLを解析して、生成したMDをresに格納する処理を書く
  if (urlが正しい) 
    url=取得したURL
    AIにレスポンスを投げる
    isLoading=true
    if (AIからレスポンスが返ってきたら)
      isLoading=false
      resMd=AIからのレスポンス
      resImg=AIからのレスポンスをhtmlに変換したもの
      export default {
        props: {
          dataMd: String
        }
      }
      が必要かも。それをrouter.jsで受け取ってwriteMD.vueに渡す
  else url=''
  */
}

</script>

<style scoped>
.flexbox div {
  display: inline-block;
  padding: 1rem;
  margin-bottom: 1rem;
}
</style>
```

## save.vue
```vue

<template>
  <div class="manga">
    <p>{{ dataMd }}</p>
    <v-icon @click="copyToClipboard(dataMd)">mdi-content-copy</v-icon>
  </div>
  <div class="manga">
    <p v-html="dataMd"></p>
    /*
    横に並列で、左にMD、右にプレビュー。
    右上のクリップボードのアイコンから、それぞれマークダウン、画像をコピーできるように。
    このやり方がいいかも。画像もkピーできるらしい：https://chatgpt.com/g/g-p-69c60e6c83288191bf856f4428985d7b-mangadown/c/6a32bf21-0ea8-83e8-b212-49db8a6c63b7
    */
    <v-icon @click="copyToClipboard(marked(dataMd))">mdi-content-copy</v-icon>
  </div>
  <div class="flexbox">
    <div>
      <p>出力形式</p>
      <input type="button" value="MarkDown" />
      <input type="button" value="HTML" />
      <input type="button" value="PDF" />
    </div>

    <div>
      <p>公開設定</p>
      <input type="button" value="X" />
      <input type="button" value="Facebook" />
      <input type="button" value="Instagram" />
    </div>
  </div>
</template>
```

## writeMD.vue
```vue
<script setup>
import '../assets/main.css'
import { useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'

import { EditorView, basicSetup } from 'codemirror'
import { json } from '@codemirror/lang-json'
import { indentWithTab } from "@codemirror/commands"
import { keymap } from "@codemirror/view"

import Viewer from "./manga/Viewer.vue"
import parseManga from "../parser/parser"

const router = useRouter()
const editor = ref(null)
const content = ref("")

if (localStorage.getItem('content')) {
  content.value = localStorage.getItem('content')
} else {
  content.value = ""
}

onMounted(() => {
  new EditorView({
    doc: content.value,
    extensions: [
      basicSetup,
      keymap.of([indentWithTab]),
      json(),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          content.value = update.state.doc.toString()
          localStorage.setItem("content", content.value)
        }
      })
    ],
    parent: editor.value,
  })
})



const manga = computed(() => {
  console.log("parseManga"+ parseManga)
  console.log("changed")
  try {
    console.log("result" + parseManga(content.value))
    return parseManga(content.value)
  } catch {
    return {
      panels: [],
      errMsg: null
    }
  }
})


</script>

<template>
  <div class="flexbox">
    <div class="manga">
      <div ref="editor"></div>
    </div>
    <div class="manga">
      <Viewer 
        v-if="manga.panels"
        :panels="manga.panels" 
      />
      <p v-else>プレビュー</p>
    </div>
  </div>
  <p v-if="errMsg">{{ manga.errMsg }}</p>
  <input type="button" value="このまま公開" @click="router.push('/save')" />
  <input type="button" value="ホームに戻る" @click="router.push('/')"/>
</template>

<style scoped>
.flexbox div {
  display: inline-block;
  padding: 1rem;
  margin-bottom: 1rem;
}
</style>
```