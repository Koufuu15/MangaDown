<script setup>

import BackgroundLayer from "./layers/BackgroundLayer.vue"
import ImageLayer from "./layers/ImageLayer.vue"
import BubbleLayer from "./layers/BubbleLayer.vue"
import CharacterLayer from "./layers/CharacterLayer.vue"
import EffectLayer from "./layers/EffectLayer.vue"
import StampLayer from "./layers/StampLayer.vue"
import ShapeLayer from "./layers/ShapeLayer.vue"
import TextLayer from "./layers/TextLayer.vue"

const props = defineProps({
    layer:Object
})

const map = {
    background:BackgroundLayer,
    image:ImageLayer,
    bubble:BubbleLayer,
    character:CharacterLayer,
    effect:EffectLayer,
    stamp:StampLayer,
    shape:ShapeLayer,
    text:TextLayer
}

</script>

<template>

<component
    :is="map[layer.type]"
    :layer="layer"
/>

</template>