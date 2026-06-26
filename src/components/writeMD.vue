<script setup>
import '../assets/main.css'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

import { EditorView, basicSetup } from 'codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'

const router = useRouter()
const editor = ref(null)
let content = ""

if (localStorage.getItem('content')) {
  content = localStorage.getItem('content')
} else {
  content = "// ここにMarkDownを記載してください。"
}

onMounted(() => {
  new EditorView({
    // TODO: what's doc?
    doc: content,
    extensions: [
        basicSetup, 
        markdown({ codeLanguages: languages })
      ],
    parent: editor.value,
  })
})

</script>

<template>
  <div class="flexbox">
    <div class="manga">
      <div ref="editor"></div>
    </div>
    <div class="manga">
      <p v-if="dataMd" v-html="dataMd"></p>
      <p v-else>プレビュー</p>
    </div>
  </div>
  <input type="button" value="このまま公開" @click="router.push('/save')" />
  <input type="button" value="ホームに戻る" @click="$router.push('/')"/>
</template>

<style scoped>
.flexbox div {
  display: inline-block;
  padding: 1rem;
  margin-bottom: 1rem;
}
</style>