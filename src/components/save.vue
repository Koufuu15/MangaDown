<script setup>
import { marked } from 'marked'

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
  .then(() => {
    console.log("Copied!")
  })
  .catch(e => {
    console.error("Copy failed", e)
  })
}
</script>

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