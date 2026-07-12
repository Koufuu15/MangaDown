<script setup>
import { computed } from "vue"

import Viewer from "../manga/Viewer.vue"
import parseManga from "@/parser/manga/parseManga"

const props=defineProps({
    content:String
})

const manga=computed(()=>parseManga(props.content))
</script>

<template>

<Viewer
    :panels="manga.panels"
/>

</template>