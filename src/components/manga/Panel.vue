<script setup>
defineProps({
  panel: {
    type: Object,
  }
})
</script>

<template>
  <div
    :style="{
      left: (panel.position?.x ?? 0) + 'px',
      top: (panel.position?.y ?? 0) + 'px',
      width: (panel.size?.width ?? 300) + 'px',
      height: (panel.size?.height ?? 300) + 'px',
      backgroundColor: panel.backgroundColor || '#eee'
    }"
  />
</template>

<style scoped>
.panel {
  position: absolute;
  border: 1px solid black;
  background: white;
  overflow: hidden;
}
</style>