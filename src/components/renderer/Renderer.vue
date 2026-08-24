<script setup>
import { computed, provide, ref } from "vue"

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
    },
    editorBlocks: {
        type: Array,
        default: null
    }
})

const blocks = computed(() => props.editorBlocks
    ? props.editorBlocks.map(block => ({
        type: block.type === "text" ? BLOCK_TYPES.MARKDOWN : BLOCK_TYPES.MANGA,
        content: block.content || "",
        source: block
    }))
    : parseMarkdown(props.content))
const selectedElement = ref(null)
const previewSelection = {
    selectedElement,
    select(element) {
        selectedElement.value = element
    }
}
provide("previewSelection", previewSelection)

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
                :editable-block="block.source"
            />
            <MangaBlock
                v-else-if="block.type===BLOCK_TYPES.MANGA"
                :content="block.content"
                :panels="panelsForBlock(index)"
            />
        </template>
    </div>
</template>
