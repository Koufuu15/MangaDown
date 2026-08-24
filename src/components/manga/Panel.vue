<script setup>
import { ref } from "vue"
import { resolveAsset } from "@/utils/assetResolver"
import Bubble from "./Bubble.vue"

const props = defineProps({
  panel: {
    type: Object,
    required: true
  }
})

const drag = ref(null)

function getPanelRect(event) {
  return event.currentTarget.closest(".manga-panel").getBoundingClientRect()
}

function startDrag(event, target, unit = "percent") {
  if (event.button !== 0) return

  const rect = getPanelRect(event)
  drag.value = {
    mode: "drag",
    target,
    unit,
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

function startResize(event, target) {
  if (event.button !== 0) return

  const rect = getPanelRect(event)
  drag.value = {
    mode: "resize",
    target,
    startX: event.clientX,
    startY: event.clientY,
    x: target.size?.width ?? rect.width,
    y: target.size?.height ?? rect.height,
    width: rect.width,
    height: rect.height
  }
  event.currentTarget.setPointerCapture?.(event.pointerId)
  event.preventDefault()
}

function moveDrag(event) {
  if (!drag.value) return

  const current = drag.value
  const deltaX = event.clientX - current.startX
  const deltaY = event.clientY - current.startY

  if (current.mode === "resize") {
    current.target.size = {
      width: Math.max(40, current.x + deltaX),
      height: Math.max(40, current.y + deltaY)
    }
    return
  }

  const scale = current.unit === "percent" ? 100 : 1
  current.target.position = {
    x: current.x + deltaX / current.width * scale,
    y: current.y + deltaY / current.height * scale
  }
}

function endDrag() {
  drag.value = null
}
</script>

<template>
  <div
    class="manga-panel relative shadow-sm overflow-hidden bg-white"
    @pointerdown.self="startDrag($event, props.panel, 'pixel')"
    @pointermove="moveDrag"
    @pointerup="endDrag"
    @pointercancel="endDrag"
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
    <span
      class="panel-resize-handle"
      @pointerdown.stop="startResize($event, props.panel)"
      @pointermove="moveDrag"
      @pointerup="endDrag"
      @pointercancel="endDrag"
    />
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
        @pointerdown.stop="startDrag($event, bubble)"
        @pointermove="moveDrag"
        @pointerup="endDrag"
        @pointercancel="endDrag"
      />
      <span
        v-if="component.bubble"
        v-for="bubble in component.bubble"
        :key="`bubble-resize-${index}`"
        class="element-resize-handle"
        :style="{ left: `calc(${bubble.position?.x ?? 0}% + ${(bubble.size?.width ?? 100) - 14}px)`, top: `calc(${bubble.position?.y ?? 0}% + ${(bubble.size?.height ?? 60) - 14}px)`, zIndex: (bubble.layer ?? 0) + 1 }"
        @pointerdown.stop="startResize($event, bubble)"
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
        @pointerdown.stop="startDrag($event, image)"
        @pointermove="moveDrag"
        @pointerup="endDrag"
        @pointercancel="endDrag"
      />
      <span
        v-if="component.image"
        v-for="image in component.image"
        :key="`image-resize-${index}`"
        class="element-resize-handle"
        :style="{ left: `calc(${image.position?.x ?? 0}% + ${(image.size?.width ?? 100) - 14}px)`, top: `calc(${image.position?.y ?? 0}% + ${(image.size?.height ?? 100) - 14}px)`, zIndex: (image.layer ?? 0) + 1 }"
        @pointerdown.stop="startResize($event, image)"
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

.panel-resize-handle,
.element-resize-handle {
  position: absolute;
  width: 14px;
  height: 14px;
  border: 2px solid #18181b;
  background: #fff;
  cursor: nwse-resize;
  touch-action: none;
  user-select: none;
}

.panel-resize-handle {
  right: 2px;
  bottom: 2px;
  z-index: 10000;
}

.element-resize-handle {
  pointer-events: auto;
}

p {
  margin: 0;
  word-break: break-word;
  white-space: pre-wrap;
}
</style>