<script setup>
import '../assets/main.css'
import { useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'

import { EditorView, basicSetup } from 'codemirror'
import { json } from '@codemirror/lang-json'
import { indentWithTab } from "@codemirror/commands"
import { keymap } from "@codemirror/view"

import Viewer from "./manga/Viewer.vue"

const router = useRouter()
const editor = ref(null)
const content = ref("")

if (localStorage.getItem('content')) {
  content.value = localStorage.getItem('content')
} else {
  content.value = "// ここにjson形式で記載してください。"
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

const panles = computed(() => {
  try {
    return JSON.parse(content.value)
  } catch {
    return null
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
        v-if="panels"
        :panels="panels" 
      />
      <p v-else>プレビュー</p>
    </div>
  </div>
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