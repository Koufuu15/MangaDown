<script setup>
import "../assets/writeMD.css"

import { computed, ref } from "vue"
import { useRouter } from "vue-router"

import Renderer from "@/components/renderer/Renderer.vue"
import AssetPicker from "@/components/library/AssetPicker.vue"
import UploadDialog from "@/components/UploadDialog.vue"
import parseMarkdown from "@/parser/markdown/parseMarkdown"
import parseManga from "@/parser/manga/parseManga"

import { validateImageName } from "@/utils/imageValidator"
import { saveUserAsset } from "@/utils/userAssets"
import { getAllAssets } from "@/utils/assetResolver"

const router = useRouter()

const fileInput = ref(null)

const pickerOpen = ref(false)
const uploadOpen = ref(false)
const selectedFile = ref(null)

const assets = ref([])

const initialContent = localStorage.getItem("content") ?? ""
const initialMangaBlock = parseMarkdown(initialContent).find(block => block.type === "manga")

const createPanel = () => ({
  position: { x: 0, y: 0 },
  size: { width: 500, height: 360 },
  backgroundColor: "#f4f0e8",
  border: "solid",
  borderWidth: 2,
  borderColor: "#18181b",
  components: []
})

const manga = ref(initialMangaBlock ? parseManga(initialMangaBlock.content).panels : [])
if (manga.value.length === 0) manga.value.push(createPanel())

const content = ref("")

const mobileView = ref("editor")
const selectedPanel = ref(null)
const shapeOptions = [
  { value: "round", label: "丸" },
  { value: "square", label: "四角" },
  { value: "thought", label: "思考" },
  { value: "shout", label: "叫び" },
  { value: "star", label: "星" }
]

function numberValue(value, fallback = 0) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function serializeObject(object) {
  return `{ x: ${numberValue(object?.x)}, y: ${numberValue(object?.y)} }`
}

function serializeSize(size) {
  return `{ w: ${numberValue(size?.width)}, h: ${numberValue(size?.height)} }`
}

function serializeManga() {
  const lines = [":::manga"]

  manga.value.forEach(panel => {
    lines.push("# panel", `- backgroundColor: ${panel.backgroundColor || "#ffffff"}`, `- border: ${panel.border || "solid"}`, `- borderWidth: ${numberValue(panel.borderWidth, 2)}`, `- borderColor: ${panel.borderColor || "#18181b"}`, `- position: ${serializeObject(panel.position)}`, `- size: ${serializeSize(panel.size)}`, "")

    panel.components.forEach(component => {
      const bubble = component.bubble?.[0]
      const image = component.image?.[0]

      if (bubble) {
        lines.push("## bubble", `- layer: ${numberValue(bubble.layer, 1)}`, `- shape: ${bubble.shape || "round"}`, `- background: ${bubble.background || "#ffffff"}`, `- border: ${bubble.border !== false}`, `- borderWidth: ${numberValue(bubble.borderWidth, 3)}`, `- borderColor: ${bubble.borderColor || "#111111"}`, `- position: ${serializeObject(bubble.position)}`, `- size: ${serializeSize(bubble.size)}`, "", "### text", `- content: "${String(bubble.text?.content || "").replaceAll('"', '\\"')}"`, `- font: ${bubble.text?.font || "sans-serif"}`, `- size: ${numberValue(bubble.text?.fontSize, 18)}`, `- color: ${bubble.text?.color || "#111111"}`, `- direction: ${bubble.text?.direction || "rl"}`, "")
        ;(bubble.tail || []).forEach(tail => lines.push("### tail", `- shape: ${tail.shape || "triangle"}`, `- position: ${numberValue(tail.position)}`, `- size: ${numberValue(tail.size, 1)}`, `- distance: ${numberValue(tail.distance, 47)}`, ""))
      }

      if (image) lines.push("## image", `- name: ${image.name || ""}`, `- layer: ${numberValue(image.layer)}`, `- position: ${serializeObject(image.position)}`, `- size: ${serializeSize(image.size)}`, "")
    })
  })

  lines.push(":::")
  return lines.join("\n")
}

function syncContent() {
  content.value = serializeManga()
  localStorage.setItem("content", content.value)
}

function addPanel() {
  manga.value.push(createPanel())
  syncContent()
}

function removePanel(panelIndex) {
  if (manga.value.length === 1) return
  manga.value.splice(panelIndex, 1)
  syncContent()
}

function addBubble(panel) {
  panel.components.push({ bubble: [{ layer: 1, shape: "round", background: "#ffffff", border: true, borderWidth: 3, borderColor: "#111111", position: { x: 20, y: 15 }, size: { width: 200, height: 100 }, text: { content: "", font: "sans-serif", fontSize: 18, color: "#111111", direction: "rl" }, tail: [] }] })
  syncContent()
}

function addImage(panel) {
  assets.value = getAllAssets()
  selectedPanel.value = panel
  pickerOpen.value = true
}

function removeComponent(panel, component) {
  panel.components.splice(panel.components.indexOf(component), 1)
  syncContent()
}

function addTail(bubble) {
  bubble.tail.push({ shape: "triangle", position: 225, size: 1, distance: 47 })
  syncContent()
}

function removeTail(bubble, tail) {
  bubble.tail.splice(bubble.tail.indexOf(tail), 1)
  syncContent()
}

function openImagePicker() {
  selectedPanel.value = manga.value[0]
  fileInput.value?.click()
}

function openAssetPicker() {
  selectedPanel.value = manga.value[0]
  assets.value = getAllAssets()
  pickerOpen.value = true
}

function closeAssetPicker() {
  pickerOpen.value = false
}

function closeUploadDialog() {
  uploadOpen.value = false
  selectedFile.value = null
}

function onImageSelected(event) {
  const file = event.target.files?.[0]

  if (!file) return

  selectedFile.value = file
  uploadOpen.value = true
  event.target.value = ""
}

function saveImage(data) {
  if (!selectedFile.value) return

  const result = validateImageName(data.name)

  if (!result.valid) {
    alert(result.message)
    return
  }

  const reader = new FileReader()

  reader.onload = () => {
    saveUserAsset({
      name: data.name,
      src: reader.result,
      folderId: data.folderId,
      tags: data.tags,
      createdAt: Date.now()
    })

    selectAsset({ name: data.name })
    closeUploadDialog()
  }

  reader.readAsDataURL(selectedFile.value)
}

function selectAsset(asset) {
  if (!selectedPanel.value) return
  selectedPanel.value.components.push({ image: [{ name: asset.name, layer: 0, position: { x: 20, y: 15 }, size: { width: 180, height: 180 } }] })
  syncContent()
  pickerOpen.value = false
}

const panelCountLabel = computed(() => `${manga.value.length} panel${manga.value.length === 1 ? "" : "s"}`)
syncContent()
</script>

<template>
  <div class="write-md-page">
    <header class="write-md-header">
      <div class="write-md-header-brand">
        <img
          src="../components/icons/MangaDown_logo.ico"
          class="md-home-logo"
          alt="MangaDown Logo"
        >

        <div class="write-md-header-left">
          <h1>Manga Editor</h1>
          <p>Arrange panels, bubbles, tails, and images visually.</p>
        </div>
      </div>
    </header>

    <main class="write-md-workspace">
      <section
        class="write-md-editor-panel"
        :class="{ 'write-md-mobile-hidden': mobileView !== 'editor' }"
      >
        <div class="write-md-panel-title">
          <span>Visual editor <small>{{ panelCountLabel }}</small></span>

          <div class="write-md-editor-toolbar">
            <button class="write-md-toolbar-button" @click="openImagePicker">画像をアップロード</button>
            <button class="write-md-toolbar-button" @click="addPanel">＋ コマを追加</button>

            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              hidden
              @change="onImageSelected"
            />
          </div>
        </div>

        <div class="write-md-form">
          <article v-for="(panel, panelIndex) in manga" :key="panelIndex" class="write-md-panel-card">
            <header class="write-md-card-header">
              <div><span class="write-md-index">{{ String(panelIndex + 1).padStart(2, "0") }}</span><strong>Panel</strong></div>
              <button class="write-md-icon-button" :disabled="manga.length === 1" title="コマを削除" @click="removePanel(panelIndex)">×</button>
            </header>
            <div class="write-md-fields">
              <label>背景色<input v-model="panel.backgroundColor" type="color" @change="syncContent"></label>
              <label>枠線<select v-model="panel.border" @change="syncContent"><option value="solid">実線</option><option value="dashed">破線</option><option value="none">なし</option></select></label>
              <label>枠線幅<input v-model.number="panel.borderWidth" type="number" min="0" step="1" @change="syncContent"></label>
              <label>幅 (px)<input v-model.number="panel.size.width" type="number" min="1" @change="syncContent"></label>
              <label>高さ (px)<input v-model.number="panel.size.height" type="number" min="1" @change="syncContent"></label>
            </div>
            <div class="write-md-component-list">
              <section v-for="(component, componentIndex) in panel.components" :key="componentIndex" class="write-md-component-card">
                <template v-if="component.bubble">
                  <div class="write-md-component-heading"><strong>吹き出し</strong><button class="write-md-remove-link" @click="removeComponent(panel, component)">削除</button></div>
                  <div class="write-md-fields">
                    <label>形<select v-model="component.bubble[0].shape" @change="syncContent"><option v-for="option in shapeOptions" :key="option.value" :value="option.value">{{ option.label }}</option></select></label>
                    <label>レイヤー<input v-model.number="component.bubble[0].layer" type="number" @change="syncContent"></label>
                    <label>左位置 (%)<input v-model.number="component.bubble[0].position.x" type="number" @change="syncContent"></label>
                    <label>上位置 (%)<input v-model.number="component.bubble[0].position.y" type="number" @change="syncContent"></label>
                    <label>幅 (px)<input v-model.number="component.bubble[0].size.width" type="number" min="1" @change="syncContent"></label>
                    <label>高さ (px)<input v-model.number="component.bubble[0].size.height" type="number" min="1" @change="syncContent"></label>
                    <label>塗り<input v-model="component.bubble[0].background" type="color" @change="syncContent"></label>
                    <label>枠線<select v-model="component.bubble[0].border" @change="syncContent"><option :value="true">表示</option><option :value="false">非表示</option></select></label>
                  </div>
                  <div class="write-md-text-editor"><strong>本文</strong><textarea v-model="component.bubble[0].text.content" rows="2" placeholder="吹き出しの文章" @input="syncContent" /><div class="write-md-fields"><label>文字サイズ<input v-model.number="component.bubble[0].text.fontSize" type="number" min="1" @change="syncContent"></label><label>方向<select v-model="component.bubble[0].text.direction" @change="syncContent"><option value="rl">横書き</option><option value="tb">縦書き</option></select></label></div></div>
                  <div v-for="(tail, tailIndex) in component.bubble[0].tail" :key="tailIndex" class="write-md-tail-row"><select v-model="tail.shape" @change="syncContent"><option value="triangle">三角</option><option value="circle">丸</option></select><label>角度<input v-model.number="tail.position" type="number" min="0" max="360" @change="syncContent"></label><label>倍率<input v-model.number="tail.size" type="number" min="0" step="0.1" @change="syncContent"></label><label>距離<input v-model.number="tail.distance" type="number" min="0" @change="syncContent"></label><button class="write-md-remove-link" @click="removeTail(component.bubble[0], tail)">削除</button></div>
                  <button class="write-md-small-button" @click="addTail(component.bubble[0])">＋ しっぽを追加</button>
                </template>
                <template v-else-if="component.image">
                  <div class="write-md-component-heading"><strong>画像: {{ component.image[0].name }}</strong><button class="write-md-remove-link" @click="removeComponent(panel, component)">削除</button></div>
                  <div class="write-md-fields"><label>レイヤー<input v-model.number="component.image[0].layer" type="number" @change="syncContent"></label><label>左位置 (%)<input v-model.number="component.image[0].position.x" type="number" @change="syncContent"></label><label>上位置 (%)<input v-model.number="component.image[0].position.y" type="number" @change="syncContent"></label><label>幅 (px)<input v-model.number="component.image[0].size.width" type="number" min="1" @change="syncContent"></label><label>高さ (px)<input v-model.number="component.image[0].size.height" type="number" min="1" @change="syncContent"></label></div>
                </template>
              </section>
            </div>
            <footer class="write-md-card-actions"><button class="write-md-small-button" @click="addBubble(panel)">＋ 吹き出し</button><button class="write-md-small-button" @click="addImage(panel)">＋ 画像</button></footer>
          </article>
        </div>
      </section>

      <section
        class="write-md-preview-panel"
        :class="{ 'write-md-mobile-hidden': mobileView !== 'preview' }"
      >
        <div class="write-md-panel-title">
          <span>Preview</span>
        </div>

        <div class="write-md-preview">
          <Renderer :content="content" />
        </div>
      </section>
    </main>

    <div class="write-md-mobile-toggle">
      <button
        class="write-md-mobile-toggle-button"
        :class="{ active: mobileView === 'editor' }"
        @click="mobileView = 'editor'"
      >
        編集
      </button>

      <button
        class="write-md-mobile-toggle-button"
        :class="{ active: mobileView === 'preview' }"
        @click="mobileView = 'preview'"
      >
        プレビュー
      </button>
    </div>

    <footer class="write-md-button-panel">
      <button
        class="write-md-secondary-button"
        @click="router.push('/')"
      >
        ← ホームに戻る
      </button>

      <button
        class="write-md-primary-button"
        @click="router.push('/save')"
      >
        出力する →
      </button>
    </footer>

    <AssetPicker
      v-model="pickerOpen"
      :assets="assets"
      @select="selectAsset"
    />

    <UploadDialog
      :open="uploadOpen"
      @close="closeUploadDialog"
      @save="saveImage"
    />
  </div>
</template>