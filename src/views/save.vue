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
const markdown = ref(localStorage.getItem("content") || "")
const activeView = ref("preview")
const previewRef = ref(null)

const { copyMarkdown, copyImage } = useClipboard(previewRef, markdown)
const { exportMarkdown, exportHTML, exportPNG, exportPDF } = useExport(previewRef, markdown)
const { shareX, shareFacebook, shareNative } = useShare()

const toggleView = () => {
  activeView.value = activeView.value === "preview" ? "markdown" : "preview"
}
</script>

<template>
  <div class="save-page">
    <header class="save-header">
      <div class="save-header-brand">
        <img
          src="../components/icons/MangaDown_logo.ico"
          class="md-home-logo"
          alt="MangaDown Logo"
        >
        <div>
          <h1 class="save-title">Publish</h1>
          <p class="save-subtitle">Review your manga before publishing.</p>
        </div>
      </div>
    </header>

    <main class="save-main">
      <section class="save-content">
        <div class="save-view">
          <div class="save-view-header">
            <span>{{ activeView === "preview" ? "Preview" : "Markdown" }}</span>
            <div class="save-view-actions">
              <button class="save-copy-button" @click="activeView === 'preview' ? copyImage() : copyMarkdown()">
                {{ "📋 Copy" }}
              </button>
              <div class="save-view-toggle" role="tablist">
                <button
                  class="save-view-option"
                  :class="{ 'save-view-option--active': activeView === 'preview' }"
                  @click="activeView = 'preview'"
                  role="tab"
                  :aria-selected="activeView === 'preview'"
                >
                  Preview
                </button>
                <button
                  class="save-view-option"
                  :class="{ 'save-view-option--active': activeView === 'markdown' }"
                  @click="activeView = 'markdown'"
                  role="tab"
                  :aria-selected="activeView === 'markdown'"
                >
                  Markdown
                </button>
              </div>
            </div>
          </div>

          <div v-if="activeView === 'preview'" ref="previewRef" class="save-preview">
            <Renderer :content="markdown" />
          </div>

          <textarea v-else v-model="markdown" readonly class="save-markdown" />
        </div>

        <button class="save-back" @click="router.push('/write-md')">← Back</button>
      </section>

      <aside class="save-actions">
        <section class="save-action-group">
          <h2 class="save-action-title">Export</h2>
          <div class="save-button-grid">
            <button class="save-action-button" @click="exportMarkdown">Markdown</button>
            <button class="save-action-button" @click="exportHTML">HTML</button>
            <button class="save-action-button" @click="exportPNG">PNG</button>
            <button class="save-action-button" @click="exportPDF">PDF</button>
          </div>
        </section>

        <section class="save-action-group">
          <h2 class="save-action-title">Share</h2>
          <div class="save-button-grid">
            <button class="save-action-button" @click="shareX()">X</button>
            <button class="save-action-button" @click="shareFacebook()">Facebook</button>
            <button class="save-action-button" @click="shareNative()">Share</button>
          </div>
        </section>
      </aside>
    </main>
  </div>
</template>