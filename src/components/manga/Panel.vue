<script setup>
import { resolveAsset } from "@/utils/assetResolver"

defineProps({
  panel: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div
    class="relative border-2 border-zinc-900 rounded-md shadow-sm overflow-hidden bg-white"
    :style="{
      width: panel.size.width + 'px',
      height: panel.size.height + 'px',
      backgroundColor: panel.backgroundColor
    }"
  >
    <template
      v-for="(component, index) in panel.components"
      :key="index"
    >
      <div
        v-if="component.bubble"
        v-for="(bubble, bubbleIndex) in component.bubble"
        :key="bubbleIndex"
        class="absolute bg-white border border-zinc-900 rounded-xl px-3 py-2 shadow-sm"
        :style="{
          left: bubble.position.x + '%',
          top: bubble.position.y + '%',
          minWidth: bubble.size.width + 'px',
          minHeight: bubble.size.height + 'px',
          maxWidth: '260px',
          zIndex: bubble.layer
        }"
      >
        <p
          :style="{
            fontSize: bubble.text.fontSize,
            color: bubble.text.color,
            fontFamily: bubble.text.font
          }"
        >
          {{ bubble.text.content }}
        </p>
      </div>

      <img
        v-if="component.image"
        v-for="image in component.image"
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