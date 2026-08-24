<script setup>
import { ref } from "vue"
import { marked } from "marked"

marked.setOptions({
  gfm: true,
  breaks: false,
});

const props = defineProps({
    content:String,
    editableBlock: {
        type: Object,
        default: null
    }
})

const resizing = ref(null)
const moving = ref(null)
const selected = ref(false)
const textStyle = () => props.editableBlock ? {
    position: "relative",
    left: `${props.editableBlock.position?.x ?? 0}px`,
    top: `${props.editableBlock.position?.y ?? 0}px`,
    width: props.editableBlock.size?.width > 0 ? `${props.editableBlock.size.width}px` : "100%",
    minHeight: props.editableBlock.size?.height > 0 ? `${props.editableBlock.size.height}px` : undefined
} : undefined

function startResize(event) {
    if (!props.editableBlock) return
    selected.value = true
    resizing.value = { x: event.clientX, y: event.clientY, width: props.editableBlock.size.width || event.currentTarget.parentElement.offsetWidth, height: props.editableBlock.size.height || event.currentTarget.parentElement.offsetHeight }
    event.currentTarget.setPointerCapture?.(event.pointerId)
}

function startMove(event) {
    if (!props.editableBlock || event.button !== 0) return
    selected.value = true
    moving.value = { x: event.clientX, y: event.clientY, left: props.editableBlock.position?.x ?? 0, top: props.editableBlock.position?.y ?? 0 }
    event.currentTarget.setPointerCapture?.(event.pointerId)
    event.preventDefault()
}

function moveBlock(event) {
    if (!moving.value || !props.editableBlock) return
    props.editableBlock.position = { x: moving.value.left + event.clientX - moving.value.x, y: moving.value.top + event.clientY - moving.value.y }
}

function endMove() {
    moving.value = null
}

function moveResize(event) {
    if (!resizing.value || !props.editableBlock) return
    props.editableBlock.size = { width: Math.max(80, resizing.value.width + event.clientX - resizing.value.x), height: Math.max(40, resizing.value.height + event.clientY - resizing.value.y) }
}

function endResize() {
    resizing.value = null
}
</script>

<template>

<div class="markdown-preview-item" :class="{ 'markdown-selected': selected }" :style="textStyle()" @pointerdown="startMove" @pointermove="moveBlock" @pointerup="endMove" @pointercancel="endMove">
    <div class="markdown" v-html="marked.parse(content, {breaks: true})" />
    <span v-if="editableBlock && selected" class="markdown-resize-handle" @pointerdown.stop="startResize" @pointermove="moveResize" @pointerup="endResize" @pointercancel="endResize" />
</div>

</template>

<style>
.markdown h1 {
    font-size: 2em;
    font-weight: bold;
    margin: .67em 0;
}

.markdown h2 {
    font-size: 1.5em;
    font-weight: bold;
}

.markdown h3 {
    font-size: 1.25em;
    font-weight: bold;
}

.markdown p {
    margin: 1em 0;
}

.markdown ul {
    list-style: disc;
    padding-left: 2rem;
}

.markdown ol {
    list-style: decimal;
    padding-left: 2rem;
}

.markdown li {
    margin: 0.25rem 0;
}

.markdown table {
    border-collapse: collapse;
    margin: 1rem 0;
}

.markdown th,
.markdown td {
    border: 1px solid #ccc;
    padding: 0.5rem 0.75rem;
}

.markdown th {
    background: #f5f5f5;
}
</style>