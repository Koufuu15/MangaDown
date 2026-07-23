<script setup>
import "../assets/main.css"
import "@/assets/save.css"

import { ref } from "vue"
import { useRouter } from "vue-router"

import Renderer from "@/components/renderer/Renderer.vue"

import { useClipboard } from "@/composables/useClipboard"
import { useExport } from "@/composables/useExport"
import { useShare } from "@/composables/useShare"

const router = useRouter()

const markdown = ref(
  localStorage.getItem("content") || ""
)

const previewRef = ref(null)

const {
  copyMarkdown,
  copyImage
} = useClipboard(
  previewRef,
  markdown
)

const {
  exportMarkdown,
  exportHTML,
  exportPNG,
  exportPDF
} = useExport(
  previewRef,
  markdown
)

const {
  shareX,
  shareFacebook,
  shareNative
} = useShare()
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
          @click="copyMarkdown"
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

      <button @click="exportMarkdown">
        Markdown
      </button>

      <button @click="exportHTML">
        HTML
      </button>

      <button @click="exportPDF">
        PDF
      </button>

      <button @click="exportPNG">
        PNG
      </button>

    </div>

  </div>

  <div class="manga section">

    <h2>🌎 Share</h2>

    <div class="button-grid">

      <button @click="shareX()">
        X
      </button>

      <button @click="shareFacebook()">
        Facebook
      </button>

      <button @click="shareNative()">
        Share
      </button>

    </div>

  </div>

  <div class="bottom-buttons">

    <button
      @click="router.push('/write-md')"
    >
      ← エディタへ戻る
    </button>
    
  </div>

</div>
</template>