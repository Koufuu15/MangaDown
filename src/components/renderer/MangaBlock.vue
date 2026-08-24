<script setup>
import { computed } from "vue"

import Viewer from "../manga/Viewer.vue"
import parseManga from "@/parser/manga/parseManga"

const props=defineProps({
    content:String,
    panels: {
        type: Array,
        default: null
    }
})

const manga=computed(()=>props.panels ? { panels: props.panels } : parseManga(props.content))
</script>

<template>

<Viewer
    :panels="manga.panels"
/>

</template>