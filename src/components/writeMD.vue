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
  <div class="min-h-screen bg-[#efe8d8] py-10">
    <div class="max-w-7xl mx-auto bg-white border-[6px] border-black rounded-2xl shadow-2xl p-6">

      <div class="grid grid-cols-2 gap-6">

        <div class="border-[4px] border-black rounded-xl overflow-hidden bg-white">
          <div ref="editor"></div>
        </div>

        <div class="border-[4px] border-black rounded-xl overflow-auto bg-gray-100">
          <Viewer
            v-if="manga.panels.length"
            :panels="manga.panels"
          />
          <div
            v-else
            class="flex justify-center items-center h-full text-gray-500"
          >
            プレビュー
          </div>
        </div>

      </div>

      <div
        v-if="manga.errMsg"
        class="mt-4 p-3 bg-red-100 border-2 border-red-400 rounded"
      >
        {{ manga.errMsg }}
      </div>

      <div class="flex justify-end gap-4 mt-8">
        <button
          class="
px-8
py-3
rounded-xl
bg-blue-500
hover:bg-blue-600
text-white
font-bold
border-[3px]
border-black
shadow-[5px_5px_0_black]
active:translate-x-1
active:translate-y-1
active:shadow-none
transition
"
          @click="router.push('/save')"
        >
          このまま公開
        </button>

        <button
          class="
px-8
py-3
rounded-xl
bg-blue-500
hover:bg-blue-600
text-white
font-bold
border-[3px]
border-black
shadow-[5px_5px_0_black]
active:translate-x-1
active:translate-y-1
active:shadow-none
transition
"
          @click="router.push('/')"
        >
          ホームへ戻る
        </button>
      </div>

    </div>
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