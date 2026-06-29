<script setup>
import MangaCanvas from "./components/MangaCanvas.vue"
import manga from "./data/manga.json"
import { parseManga } from "./parser/parser"

const data = parseManga(manga)
</script>

<template>
    <MangaCanvas :manga="data"/>
</template>