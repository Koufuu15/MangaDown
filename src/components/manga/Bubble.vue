<script setup>
defineProps({
  bubble: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div
    :style="{
      position: 'absolute',
      left: `${bubble.position.x}%`,
      top: `${bubble.position.y}%`,
      border: '1px solid black',
      backgroundColor: 'white',
      padding: '8px',
      fontSize: '14px'
    }"
  >
    {{ bubble.text }}
  </div>
</template>