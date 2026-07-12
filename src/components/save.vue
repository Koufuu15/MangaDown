<script setup>
import "../assets/main.css"

import { ref } from "vue"
import { useRouter } from "vue-router"
import { marked } from "marked"
import * as htmlToImage from "html-to-image"

import Renderer from "./renderer/Renderer.vue"

const router = useRouter()

const markdown = ref(
  localStorage.getItem("content") || ""
)

const previewRef = ref(null)

async function copyText(text) {
  await navigator.clipboard.writeText(text)
  alert("コピーしました！")
}

async function copyHTML() {
  await navigator.clipboard.writeText(marked(markdown.value))
  alert("HTMLをコピーしました！")
}

async function copyImage() {
  try {
    const blob = await htmlToImage.toBlob(previewRef.value)

    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob
      })
    ])

    alert("画像をコピーしました！")
  } catch (e) {
    console.error(e)
    alert("画像コピーに失敗しました")
  }
}

function downloadMarkdown() {
  const blob = new Blob([markdown.value], {
    type: "text/markdown"
  })

  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = "manga.md"
  a.click()

  URL.revokeObjectURL(url)
}

async function downloadPNG() {
  const url = await htmlToImage.toPng(previewRef.value)

  const a = document.createElement("a")
  a.href = url
  a.download = "manga.png"
  a.click()
}
</script>

<template>
<div class="save-page">

  <div class="manga title-card">
    <h1>🎉 Manga Completed!</h1>
    <p>公開前に最終確認してください</p>
  </div>

  <div class="editor-area">

    <div class="manga card">

      <div class="card-header">
        <span>📄 Markdown</span>

        <button
          class="icon-btn"
          @click="copyText(markdown)"
        >
          📋
        </button>

      </div>

      <textarea
        v-model="markdown"
        readonly
      />

    </div>

    <div class="manga card">

      <div class="card-header">

        <span>🖼 Preview</span>

        <button
          class="icon-btn"
          @click="copyImage"
        >
          📋
        </button>

      </div>

      <div
        class="preview"
        ref="previewRef"
      >

        <Renderer
          :content="markdown"
        />

      </div>

    </div>

  </div>

  <div class="manga section">

    <h2>📦 Export</h2>

    <div class="button-grid">

      <button @click="downloadMarkdown">
        Markdown
      </button>

      <button @click="copyHTML">
        HTML
      </button>

      <button>
        PDF
      </button>

      <button @click="downloadPNG">
        PNG
      </button>

    </div>

  </div>

  <div class="manga section">

    <h2>🌎 Share</h2>

    <div class="button-grid">

      <button>X</button>
      <button>Facebook</button>
      <button>Instagram</button>

    </div>

  </div>

  <div class="bottom-buttons">

    <button @click="router.push('/write-md')">
      ← エディタへ戻る
    </button>

    <button class="publish">
      🚀 公開
    </button>

  </div>

</div>
</template>

<style scoped>
.save-page{
  max-width:1400px;
  margin:auto;
  padding:2rem;
  display:flex;
  flex-direction:column;
  gap:2rem;
}

.manga{
  background:#fff;
  border:4px solid #111;
  border-radius:18px;
  box-shadow:8px 8px 0 #111;
}

.title-card{
  padding:2rem;
  text-align:center;
}

.title-card h1{
  margin-bottom:.5rem;
}

.editor-area{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:2rem;
}

.card{
  overflow:hidden;
  border:4px solid #111;
  border-radius:18px;
  box-shadow:8px 8px 0 #111;
  background:white;
}

.card-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:1rem 1.2rem;
  background:#111;
  color:white;
  border-bottom:4px solid #111;
}

.icon-btn{
  width:42px;
  height:42px;
  border:3px solid white;
  border-radius:10px;
  background:none;
  color:white;
  cursor:pointer;
  transition:.15s;
}

.icon-btn:hover{
  background:white;
  color:#111;
}

textarea{
  width:100%;
  height:600px;
  padding:1rem;
  border:none;
  resize:none;
  outline:none;
  font-family:monospace;
}

.preview{
  height:600px;
  overflow:auto;
  padding:1rem;
  background:#fafafa;
}

.section{
  padding:1.5rem;
  border:4px solid #111;
  border-radius:18px;
  box-shadow:8px 8px 0 #111;
}

.section h2{
  margin-bottom:1rem;
  padding-bottom:.8rem;
  border-bottom:3px dashed #111;
}

.button-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:1rem;
}

.button-grid button{
  padding:1rem;
  border:3px solid #111;
  border-radius:12px;
  background:white;
  font-weight:bold;
  cursor:pointer;
  transition:.15s;
}

.button-grid button:hover{
  transform:translate(-2px,-2px);
  box-shadow:4px 4px 0 #111;
}

.bottom-buttons{
  display:flex;
  justify-content:space-between;
}

.bottom-buttons button{
  padding:1rem 2rem;
  border:4px solid #111;
  border-radius:999px;
  background:white;
  font-weight:bold;
  cursor:pointer;
  transition:.15s;
}

.bottom-buttons button:hover{
  transform:translate(-2px,-2px);
  box-shadow:5px 5px 0 #111;
}

.publish{
  background:#111 !important;
  color:white;
}
</style>