<script setup>
import "../assets/main.css"
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"

import { EditorView, basicSetup } from "codemirror"
import { markdown } from "@codemirror/lang-markdown"
import { keymap } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"

import Viewer from "./manga/Viewer.vue"
import parseManga from "../parser/parser"

const router = useRouter()

const editor = ref(null)
const content = ref(localStorage.getItem("content") || "")

onMounted(() => {
  new EditorView({
    doc: content.value,
    extensions: [
      basicSetup,
      markdown(),
      keymap.of([indentWithTab]),
      EditorView.updateListener.of((update) => {
        if (!update.docChanged) return
        content.value = update.state.doc.toString()
        localStorage.setItem("content", content.value)
      })
    ],
    parent: editor.value
  })
})

const manga = computed(() => parseManga(content.value))
</script>

<template>
  <div class="flex h-screen">
    <div class="w-1/2 border-r border-gray-300 overflow-auto">
      <div ref="editor"></div>
    </div>

    <div class="w-1/2 bg-gray-100 overflow-auto">
      <Viewer
        v-if="manga.panels.length"
        :panels="manga.panels"
      />
      <div
        v-else
        class="flex items-center justify-center h-full text-gray-500"
      >
        プレビュー
      </div>
    </div>
  </div>

  <div
    v-if="manga.errMsg"
    class="bg-red-100 text-red-700 p-2 border-t"
  >
    {{ manga.errMsg }}
  </div>

  <div class="flex gap-2 p-4 border-t bg-white">
    <button
      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      @click="router.push('/save')"
    >
      このまま公開
    </button>

    <button
      class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      @click="router.push('/')"
    >
      ホームに戻る
    </button>
  </div>
</template>

<style scoped>
:deep(.cm-editor) {
  height: 100%;
  min-height: 100vh;
  font-size: 15px;
}

:deep(.cm-scroller) {
  overflow: auto;
}

:deep(.cm-focused) {
  outline: none;
}
</style>