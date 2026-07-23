<script setup>
import { marked } from "marked"

marked.setOptions({
  gfm: true,
  breaks: false,
});

const props = defineProps({
  content:String
})
</script>

<template>

<div
    class="markdown"
    v-html="marked.parse(content)"
/>

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