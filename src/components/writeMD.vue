<script setup>
import "../assets/writeMD.css"

import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

import { EditorView, basicSetup } from "codemirror"
import { markdown } from "@codemirror/lang-markdown"
import { keymap } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"

import Renderer from "./renderer/Renderer.vue"

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

</div>

</template>