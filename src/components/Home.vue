<script setup>
import { useRouter } from "vue-router"
import "../assets/Home.css"

const router = useRouter()
</script>

<template>
  <div class="home-page">

    <main class="manga-page">

      <!-- タイトル -->
      <header class="panel title-panel">

        <img
          src="/favicon.ico"
          class="logo"
        >

        <div>
          <h1>MangaDown</h1>
          <p>Visualize your articles with manga</p>
        </div>

      </header>

      <!-- 左下（大きいコマ） -->
      <section class="panel markdown-panel">

        <div>

          <div class="number blue">
            01
          </div>

          <h2>
            独自Markdownで漫画を作成
          </h2>

          <p>
            独自Markdownを書くだけで、
            漫画のコマ・吹き出し・画像などを自由に配置できます。
            リアルタイムプレビューを見ながら編集できます。
          </p>

        </div>

        <button
          class="primary-button"
          @click="router.push('/write-md')"
        >
          漫画を作る →
        </button>

      </section>

      <!-- 右上（斜めコマ予定） -->
      <section class="panel article-panel">

        <div>

          <div class="number green">
            02
          </div>

          <h2>
            技術記事をAIで漫画化
          </h2>

          <p>
            URLを入力するだけで、
            AIが記事を漫画形式へ変換します。
          </p>

        </div>

        <button
          class="secondary-button"
          @click="router.push('/parse-url')"
        >
          記事を読み込む →
        </button>

      </section>

      <!-- ガイド -->
      <section class="panel guide-panel">

        <div>

          <h3>
            Guide
          </h3>

          <p>
            Markdownの書き方やサンプルはこちら。
          </p>

        </div>

        <button class="guide-button">
          チュートリアル →
        </button>

      </section>

    </main>

  </div>
</template>