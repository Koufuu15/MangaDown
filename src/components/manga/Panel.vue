<script setup>
import { ref } from "vue"
import { resolveAsset } from "@/utils/assetResolver"
import Bubble from "./Bubble.vue"

defineProps({
  panel: {
    type: Object,
    required: true
  }
})

const drag = ref(null)

function startDrag(event, target) {
  if (event.button !== 0) return

  const panelElement = event.currentTarget.closest(".relative")
  const rect = panelElement.getBoundingClientRect()
  drag.value = {
    target,
    startX: event.clientX,
    startY: event.clientY,
    x: target.position?.x ?? 0,
    y: target.position?.y ?? 0,
    width: rect.width,
    height: rect.height
  }
  event.currentTarget.setPointerCapture?.(event.pointerId)
  event.preventDefault()
}

function moveDrag(event) {
  if (!drag.value) return

  const current = drag.value
  current.target.position = {
    x: current.x + (event.clientX - current.startX) / current.width * 100,
    y: current.y + (event.clientY - current.startY) / current.height * 100
  }
}

function endDrag() {
  drag.value = null
}
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
        @pointerdown="startDrag($event, bubble)"
        @pointermove="moveDrag"
        @pointerup="endDrag"
        @pointercancel="endDrag"
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
        @pointerdown="startDrag($event, image)"
        @pointermove="moveDrag"
        @pointerup="endDrag"
        @pointercancel="endDrag"
      />

    </template>
  </div>
</template>

<style scoped>
.bubble,
img {
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.bubble:active,
img:active {
  cursor: grabbing;
}

p {
  margin: 0;
  word-break: break-word;
  white-space: pre-wrap;
}
</style>