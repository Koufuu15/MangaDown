<script setup>
import '../assets/main.css'

import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <header class="manga">
    <img alt="Vue logo" class="logo" src="../public/favicon.ico"/>

    <div class="wrapper">
      <h1>MangaDown</h1>
      <p>Visualize your articles with manga</p>
    </div>
  </header>

  <main>
    <div class="manga">
      <p>01</p>
      <h3>既存の技術記事をAIで漫画化</h3>
      <input type="button" value="記事を読み込む" @click="router.push('/parse-url')" />
    </div>
    <div class="manga">
      <p>02</p>
      <h3>独自MarkDownを用いて、一から漫画を作成</h3>
      <input type="button" value="漫画を作る" @click="router.push('/write-md')" />
    </div>
    <div class="manga">
      <p>使い方は</p>
      <a href="">こちら</a>
    </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
