<script setup>
import { computed } from "vue"
import LayerRenderer from "./LayerRenderer.vue"

const props = defineProps({
    panel:Object
})

const layers = computed(()=>
    [...props.panel.layers]
        .sort((a,b)=>b.layer-a.layer)
)

</script>

<template>

<div class="panel">

<LayerRenderer
    v-for="layer in layers"
    :layer="layer"
/>

</div>

</template>