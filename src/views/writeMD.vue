<script setup>
import "../assets/writeMD.css"

import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

import { EditorView, basicSetup } from "codemirror"
import { markdown } from "@codemirror/lang-markdown"
import { keymap } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"

import Renderer from "@/components/renderer/Renderer.vue"
import ImageDrawer from "@/components/ImageDrawer.vue"

import { validateImageName } from "@/utils/imageValidator"
import { saveUserAsset } from "@/utils/userAssets"

const router = useRouter()

const editor = ref()
const editorView = ref(null)

const fileInput = ref(null)

const drawerOpen = ref(false)

const content = ref(localStorage.getItem("content") ?? "")

function openImagePicker() {
  fileInput.value?.click()
}

function openDrawer() {
  drawerOpen.value = true
}

function closeDrawer() {
  drawerOpen.value = false
}

function onImageSelected(event) {
  const file = event.target.files?.[0]

  if (!file) return

  const name = prompt("画像名を入力してください")

  if (!name) {
    event.target.value = ""
    return
  }

  const result = validateImageName(name)

  if (!result.valid) {
    alert(result.message)
    event.target.value = ""
    return
  }

  const reader = new FileReader()

  reader.onload = () => {
    saveUserAsset(name, reader.result)

    insertImageMarkdown(name)

    event.target.value = ""
  }

  reader.readAsDataURL(file)
}

function insertImageMarkdown(name) {

  if (!editorView.value) return

  const insertText =
`### image
- name: ${name}
- layer: 1
- position: { x: 50, y: 50 }
- size: { w: 300, h: 300 }

`

  const selection =
    editorView.value.state.selection.main

  editorView.value.dispatch({
    changes: {
      from: selection.from,
      to: selection.to,
      insert: insertText
    }
  })

  drawerOpen.value = false
}

onMounted(() => {

  editorView.value = new EditorView({
    doc: content.value,
    extensions: [
      basicSetup,
      markdown(),
      keymap.of([
        indentWithTab
      ]),

      EditorView.updateListener.of((update) => {
        if (!update.docChanged) return
        content.value =
          update.state.doc.toString()

        localStorage.setItem(
          "content",
          content.value
        )
      })
    ],
    parent: editor.value
  })
})
</script>
<template>
  <div class="write-page">

    <header class="write-header">
      <h1>Manga Editor</h1>
      <p>
        Write Markdown and preview your manga.
      </p>
    </header>

    <main class="workspace">

      <section class="editor-panel">

        <div class="panel-title">
          Markdown
        </div>

        <div class="editor-toolbar">

          <button
            class="secondary-button"
            @click="openImagePicker"
          >
            画像をアップロード
          </button>

          <button
            class="secondary-button"
            @click="openDrawer"
          >
            📁 画像一覧
          </button>

          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            hidden
            @change="onImageSelected"
          />

        </div>

        <div
          ref="editor"
          class="editor"
        />

      </section>

      <section class="preview-panel">

        <div class="panel-title">
          Preview
        </div>

        <div class="preview">
          <Renderer
            :content="content"
          />
        </div>

      </section>

    </main>

    <footer class="button-panel">

      <button
        class="primary-button"
        @click="router.push('/save')"
      >
        公開する
      </button>

      <button
        class="secondary-button"
        @click="router.push('/')"
      >
        ホームへ戻る
      </button>

    </footer>

    <ImageDrawer
      :open="drawerOpen"
      @close="closeDrawer"
      @insert="insertImageMarkdown"
    />

  </div>
</template>