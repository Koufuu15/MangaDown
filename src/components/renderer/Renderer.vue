<script setup>
import { computed } from "vue"

import parseMarkdown from "@/parser/markdown/parseMarkdown"

import MarkdownBlock from "./MarkdownBlock.vue"
import MangaBlock from "./MangaBlock.vue"

import { BLOCK_TYPES } from "@/parser/markdown/blockTypes"

const props = defineProps({
    content: {
        type: String,
        default: ""
    }
})

const blocks = computed(() => parseMarkdown(props.content))
</script>

<template>

<template
    v-for="(block,index) in blocks"
    :key="index"
>

<MarkdownBlock
    v-if="block.type===BLOCK_TYPES.MARKDOWN"
    :content="block.content"
/>

<MangaBlock
    v-else-if="block.type===BLOCK_TYPES.MANGA"
    :content="block.content"
/>

</template>

</template>