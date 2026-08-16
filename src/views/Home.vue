<script setup>
import { useRouter } from "vue-router"
import "../assets/Home.css"

const router = useRouter()
</script>

<template>
  <div class="md-home-page">
    <main class="md-home-manga-page">

      <!-- Top Banner -->
      <header class="md-home-brand-banner">
        <div class="md-home-brand-main">
          <img
            src="../components/icons/MangaDown_logo.ico"
            class="md-home-logo"
            alt="MangaDown Logo"
          >

          <div class="md-home-brand-text">
            <h1>MangaDown</h1>
            <p>Turn Markdown into Manga</p>
          </div>
        </div>
      </header>


      <!-- Hero -->
      <section class="md-home-markdown-panel">

        <div class="md-home-hero-text">
          <span class="md-home-hero-label">MARKDOWN × MANGA</span>

          <h2>
            Markdownから<br>
            漫画を作ろう。
          </h2>

          <p>
            独自Markdownを書くだけで漫画をレイアウト。
            吹き出し・画像・背景・コマ割りを自由に配置し、
            リアルタイムプレビューを見ながら編集できます。
          </p>
        </div>


        <div class="md-home-button-group">
          <button
            class="md-home-primary-button"
            @click="router.push('/write-md')"
          >
            漫画を作る
            <span>→</span>
          </button>

          <button
            class="md-home-secondary-button"
            @click="router.push('/guide')"
          >
            ガイドを見る
          </button>
        </div>

      </section>


      <!-- Footer -->
      <footer class="md-home-site-footer">
        <span>© MangaDown</span>

        <span class="md-home-footer-divider">|</span>

        <button
          class="md-home-terms-link"
          @click="router.push('/terms')"
        >
          利用規約
        </button>
      </footer>

    </main>
  </div>
</template>