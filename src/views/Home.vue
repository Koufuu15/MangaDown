<script setup>
import { useRouter } from "vue-router"
import "../assets/Home.css"

const router = useRouter()
</script>

<template>
  <div class="home-page">
    <main class="manga-page">
      <header class="panel title-panel">
        <div class="brand-block">
          <img src="/logo-mark.svg" class="logo" alt="MangaDown Logo" />
          <div class="title-content">
            <span class="eyebrow">Editorial manga studio</span>
            <h1>MangaDown</h1>
          </div>
        </div>

        <button class="ghost-button" @click="router.push('/guide')">
          ガイドを見る
        </button>
      </header>

      <section class="panel intro-panel">
        <div class="panel-kicker">Create</div>

        <div class="hero-text">
          <h2>Markdownで、<br>本格的な漫画を作る。</h2>
          <p>
            文章とレイアウトを一体で扱える編集環境。<br>
            余白の美しさと読みやすさを保ちながら、<br>
            作品の世界観をそのまま出力できます。
          </p>
        </div>

        <div class="button-group">
          <button class="primary-button" @click="router.push('/write-md')">
            漫画を作成する
          </button>
          <button class="secondary-button" @click="router.push('/save')">
            作品を見る
          </button>
        </div>
      </section>

      <aside class="panel info-panel">
        <div class="panel-kicker muted">Workflow</div>

        <div class="process-list">
          <div class="process-item">
            <span>01</span>
            <div>
              <strong>構成を考える</strong>
              <p>コマ割りと流れを整える</p>
            </div>
          </div>

          <div class="process-item">
            <span>02</span>
            <div>
              <strong>本文を整える</strong>
              <p>注釈と会話を自然に配置</p>
            </div>
          </div>

          <div class="process-item">
            <span>03</span>
            <div>
              <strong>完成を出力</strong>
              <p>PNG / PDF で保存</p>
            </div>
          </div>
        </div>
      </aside>
    </main>
  </div>
</template>