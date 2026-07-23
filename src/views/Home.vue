<script setup>
import { useRouter } from "vue-router"
import "../assets/Home.css"

const router = useRouter()

const openTutorial = () => {
  // TODO
}

const openSample = () => {
  // TODO
}
</script>

<template>
  <div class="home-page">
    <main class="manga-page">
      <header class="panel title-panel">
        <span class="sound">ゴゴゴ</span>

        <img
          src="/favicon.ico"
          class="logo"
          alt="MangaDown Logo"
        >

        <div class="title-content">
          <h1>MangaDown</h1>
          <p>Turn Markdown into Manga.</p>
        </div>
      </header>

      <section class="panel markdown-panel">
        <div class="number blue">01</div>

        <div class="hero-text">
          <h2>Markdownから<br>漫画を作ろう。</h2>

          <p>
            独自Markdownを書くだけで漫画をレイアウト。
            吹き出し・画像・背景・コマ割りを自由に配置し、
            リアルタイムプレビューを見ながら編集できます。
          </p>
        </div>

        <div class="button-group">
          <button
            class="primary-button"
            @click="router.push('/write-md')"
          >
            漫画を作る →
          </button>

          <button
            class="secondary-button"
            @click="router.push('/guide')"
          >
            ガイドを見る
          </button>
        </div>
      </section>

      <section
        class="panel guide-panel"
        @click="openTutorial"
      >
        <div class="guide-header">
          <span class="number green">02</span>

          <div>
            <h3>Quick Start</h3>
            <p>3ステップで漫画を作成できます。</p>
          </div>
        </div>

        <div class="guide-steps">
          <div class="step">
            <span>01</span>
            <p>Markdownを書く</p>
          </div>

          <div class="step">
            <span>02</span>
            <p>リアルタイムで編集</p>
          </div>

          <div class="step">
            <span>03</span>
            <p>PNG・PDFで出力</p>
          </div>
        </div>

        <div class="guide-footer">
          チュートリアルを見る →
        </div>
      </section>
    </main>
  </div>
</template>