<template>
  <label for="url">WebサイトのURLを入力</label><br>
  <input id="url" type="url" placeholder="URLを入力" v-model="url"/>
  <input type="button" value="読み込む" @click="parseUrl"/>

  <div class="manga">
    <p v-if="isLoading">Thinking...</p>
    <p v-else-if="!url">URLを入力してください</p>
    <p v-else-if="resMd">{{ resMd }}</p>
    <p v-else-if="!res">データの取得に失敗しました</p>
  </div>
  <div class="manga">
    <p v-if="resImg" v-html="resImg"></p>
    <p v-else>プレビュー</p>
  </div>

  <input type="button" value="エディタで編集" @click="$router.push('/write-md')"/>
  <input type="button" value="このまま公開" @click="$router.push('/save')"/>
</template>

<script setup>
import { ref } from 'vue'
import '../assets/main.css'

import { useRouter } from 'vue-router'
const router = useRouter()

const url = ref('')
const resMd = ref('')
const resImg = ref('')
const isLoading = ref(false)
function parseUrl() {
  /*
  ここでURLを解析して、生成したMDをresに格納する処理を書く
  if (urlが正しい) 
    url=取得したURL
    AIにレスポンスを投げる
    isLoading=true
    if (AIからレスポンスが返ってきたら)
      isLoading=false
      resMd=AIからのレスポンス
      resImg=AIからのレスポンスをhtmlに変換したもの
      export default {
        props: {
          dataMd: String
        }
      }
      が必要かも。それをrouter.jsで受け取ってwriteMD.vueに渡す
  else url=''
  */
}

</script>