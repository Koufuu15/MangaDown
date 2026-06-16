<template>
  <div class="manga">
    <p v-html="dataMd"></p>
    /*
    横に並列で、左にMD、右にプレビュー。
    右上のクリップボードのアイコンから、それぞれマークダウン、画像をコピーできるように。
    */
  </div>
  <div class="flexbox">
    <div>
      <p>出力形式</p>
      <input type="button" value="MarkDown" />
      <input type="button" value="HTML" />
      <input type="button" value="PDF" />
    </div>

    <div>
      <p>公開設定</p>
      <input type="button" value="X" />
      <input type="button" value="Facebook" />
      <input type="button" value="Instagram" />
    </div>
  </div>
</template>

<script setup>
</script>