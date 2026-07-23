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

const{
  copyMarkdown,
  copyImage
}=useClipboard(
  previewRef,
  markdown
)

const{
  exportMarkdown,
  exportHTML,
  exportPNG,
  exportPDF
}=useExport(
  previewRef,
  markdown
)

const{
  shareX,
  shareFacebook,
  shareNative
}=useShare()
</script>

<template>

<div class="save-page">

  <header class="save-header">

    <div class="header-left">
      <h1>Publish Manga</h1>
      <p>Review your manga before publishing.</p>
    </div>

    <div class="header-right">
      <span class="publish-status">
        ● Ready
      </span>
    </div>

  </header>

  <main class="save-workspace">

    <section class="markdown-panel">

      <div class="panel-title">

        <span>Markdown</span>

        <button
          class="toolbar-button"
          @click="copyMarkdown"
        >
          📋 Copy
        </button>

      </div>

      <textarea
        v-model="markdown"
        readonly
      />

    </section>

    <section class="preview-panel">

      <div class="panel-title">

        <span>Preview</span>

        <button
          class="toolbar-button"
          @click="copyImage"
        >
          🖼 Copy
        </button>

      </div>

      <div
        ref="previewRef"
        class="preview"
      >

        <Renderer
          :content="markdown"
        />

      </div>

    </section>

  </main>

  <section class="action-panel">

    <div class="action-card">

      <h3>Export</h3>

      <div class="button-grid">

        <button
          class="secondary-button"
          @click="exportMarkdown"
        >
          Markdown
        </button>

        <button
          class="secondary-button"
          @click="exportHTML"
        >
          HTML
        </button>

        <button
          class="secondary-button"
          @click="exportPNG"
        >
          PNG
        </button>

        <button
          class="secondary-button"
          @click="exportPDF"
        >
          PDF
        </button>

      </div>

    </div>

    <div class="action-card">

      <h3>Share</h3>

      <div class="button-grid">

        <button
          class="secondary-button"
          @click="shareX()"
        >
          X
        </button>

        <button
          class="secondary-button"
          @click="shareFacebook()"
        >
          Facebook
        </button>

        <button
          class="secondary-button"
          @click="shareNative()"
        >
          Share
        </button>

      </div>

    </div>

  </section>

  <footer class="button-panel">

    <button
      class="secondary-button"
      @click="router.push('/write-md')"
    >
      ← Back
    </button>

  </footer>

</div>

</template>