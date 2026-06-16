<script setup>
import '../assets/main.css'
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <input type="button" value="このまま公開" @click="router.push('/save')" />
  <div class="flexbox">
    <div class="manga">
      <textarea placeholder="独自のMarkDownを入力" v-model="dataMd" > {{ dataMd }} </textarea>
    </div>
    <div class="manga">
      <p v-if="dataMd" v-html="dataMd"></p>
      <p v-else>プレビュー</p>
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