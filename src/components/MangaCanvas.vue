<script setup>
import MangaPanel from "./MangaPanel.vue"

defineProps({
    manga:Object
})
</script>

<template>

<div class="canvas">

<MangaPanel
    v-for="panel in manga.panels"
    :panel="panel"
/>

</div>

</template>