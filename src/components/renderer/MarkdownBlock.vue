<script setup>
import { marked } from "marked"

const props = defineProps({
  content:String
})
</script>

<template>

<div
    v-html="marked(content)"
/>

</template>