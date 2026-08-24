<script setup>
import { inject, ref } from "vue"
import { resolveAsset } from "@/utils/assetResolver"
import Bubble from "./Bubble.vue"

const props = defineProps({
  panel: {
    type: Object,
    required: true
  }
})

const drag = ref(null)
const previewSelection = inject("previewSelection")
const selectedTarget = previewSelection.selectedElement

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

function selectTarget(target) {
  previewSelection.select(target)
}

function selectPanelOrClear(event) {
  if (event.target === event.currentTarget) {
    previewSelection.clear()
    return
  }

  previewSelection.select(props.panel)
  startDrag(event, props.panel, "pixel")
}

function startResize(event, target, corner, unit = "pixel") {
  if (event.button !== 0) return

  const rect = getPanelRect(event)
  drag.value = {
    mode: "resize",
    target,
    corner,
    unit,
    startX: event.clientX,
    startY: event.clientY,
    x: target.size?.width ?? rect.width,
    y: target.size?.height ?? rect.height,
    positionX: target.position?.x ?? 0,
    positionY: target.position?.y ?? 0,
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
    const left = current.corner.includes("left")
    const top = current.corner.includes("top")
    current.target.size = {
      width: Math.max(40, current.x + (left ? -deltaX : deltaX)),
      height: Math.max(40, current.y + (top ? -deltaY : deltaY))
    }
    const positionScale = current.unit === "percent" ? 100 : 1
    if (left) current.target.position.x = current.positionX + deltaX / current.width * positionScale
    if (top) current.target.position.y = current.positionY + deltaY / current.height * positionScale
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
    :class="{ 'panel-selected': selectedTarget === props.panel }"
    @pointerdown="selectPanelOrClear"
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
    <template v-if="selectedTarget === props.panel">
      <span v-for="corner in ['top-left', 'top-right', 'bottom-left', 'bottom-right']" :key="corner" class="panel-resize-handle" :class="`handle-${corner}`" @pointerdown.stop="startResize($event, props.panel, corner, 'pixel')" @pointermove="moveDrag" @pointerup="endDrag" @pointercancel="endDrag" />
    </template>
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
        :class="{ 'element-selected': selectedTarget === bubble }"
        @pointerdown.stop="selectTarget(bubble); startDrag($event, bubble)"
        @select="selectTarget(bubble)"
        @pointermove="moveDrag"
        @pointerup="endDrag"
        @pointercancel="endDrag"
      />
      <template v-for="bubble in component.bubble" :key="`bubble-handles-${index}`">
        <span
          v-if="selectedTarget === bubble"
          v-for="corner in ['top-left', 'top-right', 'bottom-left', 'bottom-right']"
          :key="`bubble-resize-${index}-${corner}`"
          class="element-resize-handle"
          :class="`handle-${corner}`"
          :style="{ '--element-x': `${bubble.position?.x ?? 0}%`, '--element-y': `${bubble.position?.y ?? 0}%`, '--element-width': `${bubble.size?.width ?? 100}px`, '--element-height': `${bubble.size?.height ?? 60}px`, zIndex: (bubble.layer ?? 0) + 1 }"
          @pointerdown.stop="startResize($event, bubble, corner, 'percent')"
          @pointermove="moveDrag"
          @pointerup="endDrag"
          @pointercancel="endDrag"
        />
      </template>

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
        :class="{ 'element-selected': selectedTarget === image }"
        @pointerdown.stop="selectTarget(image); startDrag($event, image)"
        @pointermove="moveDrag"
        @pointerup="endDrag"
        @pointercancel="endDrag"
      />
      <template v-for="image in component.image" :key="`image-handles-${index}`">
        <span
          v-if="selectedTarget === image"
          v-for="corner in ['top-left', 'top-right', 'bottom-left', 'bottom-right']"
          :key="`image-resize-${index}-${corner}`"
          class="element-resize-handle"
          :class="`handle-${corner}`"
          :style="{ '--element-x': `${image.position?.x ?? 0}%`, '--element-y': `${image.position?.y ?? 0}%`, '--element-width': `${image.size?.width ?? 100}px`, '--element-height': `${image.size?.height ?? 100}px`, zIndex: (image.layer ?? 0) + 1 }"
          @pointerdown.stop="startResize($event, image, corner, 'percent')"
          @pointermove="moveDrag"
          @pointerup="endDrag"
          @pointercancel="endDrag"
        />
      </template>

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

.element-selected {
  outline: 2px dashed #2563eb;
  outline-offset: 3px;
}

.panel-selected {
  outline: 2px dashed #2563eb;
  outline-offset: 3px;
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
  border: 2px solid #2563eb;
  border-radius: 50%;
  background: #fff;
  touch-action: none;
  user-select: none;
}

.handle-top-left { left: -7px; top: -7px; cursor: nwse-resize; }
.handle-top-right { right: -7px; top: -7px; cursor: nesw-resize; }
.handle-bottom-left { left: -7px; bottom: -7px; cursor: nesw-resize; }
.handle-bottom-right { right: -7px; bottom: -7px; cursor: nwse-resize; }

.panel-resize-handle {
  z-index: 10000;
}

.element-resize-handle {
  pointer-events: auto;
  left: calc(var(--element-x) - 7px);
  top: calc(var(--element-y) - 7px);
}

.element-resize-handle.handle-top-right {
  left: calc(var(--element-x) + var(--element-width) - 7px);
}

.element-resize-handle.handle-bottom-left {
  top: calc(var(--element-y) + var(--element-height) - 7px);
}

.element-resize-handle.handle-bottom-right {
  left: calc(var(--element-x) + var(--element-width) - 7px);
  top: calc(var(--element-y) + var(--element-height) - 7px);
}

p {
  margin: 0;
  word-break: break-word;
  white-space: pre-wrap;
}
</style>