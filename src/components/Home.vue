<script setup>
import '../assets/main.css'

import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-[#efe8d8] py-12">
    <div class="max-w-6xl mx-auto">
      <header class="text-center mb-10">
        <img
          alt="logo"
          src="/favicon.ico"
          class="w-24 h-24 mx-auto mb-4"
        >

        <h1 class="text-5xl font-black">MangaDown</h1>

        <p class="text-gray-600 mt-2">
          Visualize your articles with manga
        </p>
      </header>

      <main class="grid grid-cols-2 gap-6">

        <section class="bg-white border-[5px] border-black rounded-xl p-6 shadow-xl">
          <div class="inline-block bg-black text-white px-3 py-1 rounded mb-4">
            01
          </div>

          <h2 class="text-2xl font-bold mb-4">
            既存の技術記事をAIで漫画化
          </h2>

          <p class="mb-8 text-gray-700">
            URLを入力するだけでAIが漫画形式へ変換します。
          </p>

          <button
            class="
w-full
py-4
bg-blue-500
hover:bg-blue-600
border-[3px]
border-black
rounded-lg
font-black
text-lg
text-white
shadow-[6px_6px_0px_black]
active:translate-x-1
active:translate-y-1
active:shadow-none
transition
"
            @click="router.push('/parse-url')"
          >
            記事を読み込む
          </button>
        </section>

        <section class="bg-white border-[5px] border-black rounded-xl p-6 shadow-xl">
          <div class="inline-block bg-black text-white px-3 py-1 rounded mb-4">
            02
          </div>

          <h2 class="text-2xl font-bold mb-4">
            独自Markdownで漫画を作成
          </h2>

          <p class="mb-8 text-gray-700">
            Markdownを書くだけで漫画を作れます。
          </p>

          <button
            class="
w-full
py-4
bg-blue-500
hover:bg-blue-600
border-[3px]
border-black
rounded-lg
font-black
text-lg
text-white
shadow-[6px_6px_0px_black]
active:translate-x-1
active:translate-y-1
active:shadow-none
transition
"
            @click="router.push('/write-md')"
          >
            漫画を作る
          </button>
        </section>

        <section class="col-span-2 bg-white border-[5px] border-black rounded-xl p-6 shadow-xl">
          <h2 class="text-xl font-bold mb-2">
            使い方
          </h2>

          <a
            href=""
            class="text-blue-600 underline"
          >
            チュートリアルはこちら
          </a>
        </section>

      </main>
    </div>
  </div>
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
