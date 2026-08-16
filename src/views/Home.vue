<script setup>
import { useRouter } from "vue-router"
import "../assets/Home.css"

const router = useRouter()
</script>

<template>
  <div class="home-page">
    <main class="manga-page">

      <!-- Top Banner -->
      <header class="brand-banner">
        <div class="brand-main">
          <img
            src="../components/icons/MangaDown_logo.ico"
            class="logo"
            alt="MangaDown Logo"
          >

          <div class="brand-text">
            <h1>MangaDown</h1>
            <p>Turn Markdown into Manga</p>
          </div>
        </div>
      </header>


      <!-- Hero -->
      <section class="markdown-panel">

        <div class="hero-text">
          <span class="hero-label">MARKDOWN × MANGA</span>

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


        <div class="button-group">
          <button
            class="Home.primary-button"
            @click="router.push('/write-md')"
          >
            漫画を作る
            <span>→</span>
          </button>

          <button
            class="Home.secondary-button"
            @click="router.push('/guide')"
          >
            ガイドを見る
          </button>
        </div>

      </section>


      <!-- Footer -->
      <footer class="site-footer">
        <span>© MangaDown</span>

        <span class="footer-divider">|</span>

        <button
          class="terms-link"
          @click="router.push('/terms')"
        >
          利用規約
        </button>
      </footer>

    </main>
  </div>
</template>