<script setup>
import { resolveAsset } from "@/utils/assetResolver"
import Bubble from "./Bubble.vue"

defineProps({
  panel: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div
    class="relative border-2 border-zinc-900 shadow-sm overflow-hidden bg-white"
    :style="{
      left: panel.position.x + 'px',
      top: panel.position.y + 'px',
      width: panel.size.width + 'px',
      height: panel.size.height + 'px',
      backgroundColor: panel.backgroundColor
    }"
  >
    <template
      v-for="(component, index) in panel.components"
      :key="index"
    >

      <!-- Bubble -->
      <Bubble
        v-if="component.bubble"
        v-for="(bubble, bubbleIndex) in component.bubble"
        :key="bubbleIndex"
        :bubble="bubble"
        :style="{
          zIndex: bubble.layer
        }"
      />

      <!-- Image -->
      <img
        v-if="component.image"
        v-for="image in component.image"
        :key="image.name"
        :src="resolveAsset(image.name)"
        class="absolute"
        :style="{
          left: image.position.x + '%',
          top: image.position.y + '%',
          width: image.size.width + 'px',
          height: image.size.height + 'px',
          zIndex: image.layer
        }"
      />

    </template>
  </div>
</template>

<style scoped>
p {
  margin: 0;
  word-break: break-word;
  white-space: pre-wrap;
}
</style>