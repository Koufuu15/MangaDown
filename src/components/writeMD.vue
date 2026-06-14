<script setup>
import '../assets/main.css'
</script>

<template>
  <div class="flexbox">
    <div class="manga">
      <textarea placeholder="独自のMarkDownを入力" />
    </div>
    <div class="manga">
      <p>プレビュー</p>
      <div class="preview">
        ここにプレビューが表示される
      </div>
    </div>
  </div>
</template>

<style scoped>
.flexbox div {
  display: inline-block;
  padding: 1rem;
  margin-bottom: 1rem;
}
</style>