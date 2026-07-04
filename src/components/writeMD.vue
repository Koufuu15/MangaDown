<script setup>
import "./WriteMD.css"

import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"

import { EditorView, basicSetup } from "codemirror"
import { markdown } from "@codemirror/lang-markdown"
import { keymap } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"

import Viewer from "@/components/manga/Viewer.vue"
import parseManga from "@/parser/parser"

const router = useRouter()

const editor = ref()

const content = ref(
  localStorage.getItem("content") ?? ""
)

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

        localStorage.setItem(
          "content",
          content.value
        )

      })

    ],
    parent: editor.value
  })
})

const manga = computed(() =>
  parseManga(content.value)
)
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

        <Viewer
          v-if="manga.panels.length"
          :panels="manga.panels"
        />

        <div
          v-else
          class="empty-preview"
        >
          プレビュー
        </div>

      </div>

    </section>

  </main>

  <footer
    v-if="manga.errMsg"
    class="error-panel"
  >

    {{ manga.errMsg }}

  </footer>

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

</div>

</template>