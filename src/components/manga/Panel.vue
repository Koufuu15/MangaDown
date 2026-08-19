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
    class="relative shadow-sm overflow-hidden bg-white"
    :style="{
      left: (panel.position?.x ?? 0) + 'px',
      top: (panel.position?.y ?? 0) + 'px',
      width: (panel.size?.width ?? 500) + 'px',
      height: (panel.size?.height ?? 500) + 'px',
      backgroundColor: panel.backgroundColor,
      borderStyle: panel.border ?? 'solid',
      borderWidth: (panel.borderWidth ?? 2) + 'px',
      borderColor: panel.borderColor ?? '#18181b'
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
          left: (image.position?.x ?? 0) + '%',
          top: (image.position?.y ?? 0) + '%',
          width: (image.size?.width ?? 100) + 'px',
          height: (image.size?.height ?? 100) + 'px',
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