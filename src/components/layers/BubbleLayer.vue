<script setup>

const props=defineProps({
    layer:Object
})

</script>

<template>

<div class="bubble">

{{layer.text.content}}

</div>

</template>