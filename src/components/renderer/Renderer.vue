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
    },
    panelGroups: {
        type: Array,
        default: null
    }
})

const blocks = computed(() => parseMarkdown(props.content))

function panelsForBlock(index) {
    if (!props.panelGroups) return null

    const mangaIndex = blocks.value
        .slice(0, index + 1)
        .filter(block => block.type === BLOCK_TYPES.MANGA).length - 1

    return props.panelGroups[mangaIndex] ?? []
}
</script>

<template>
    <div class="renderer">
        <template v-for="(block,index) in blocks" :key="index">
            <MarkdownBlock
                v-if="block.type===BLOCK_TYPES.MARKDOWN"
                :content="block.content"
            />
            <MangaBlock
                v-else-if="block.type===BLOCK_TYPES.MANGA"
                :content="block.content"
                :panels="panelsForBlock(index)"
            />
        </template>
    </div>
</template>
