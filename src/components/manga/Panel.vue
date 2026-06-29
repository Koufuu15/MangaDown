<script setup>
import Bubble from "./Bubble"

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
  <div
    v-for="(layer, index) in panel.layers"
    :key="index"
  >
    <!-- Character -->
    <img
      v-if="layer.type === 'character'"
      :src="characterAssets[`${layer.name}_${layer.pose}`]"
      :alt="layer.name"
      :style="{
        position: 'absolute',
        left: `${layer.position.x}%`,
        top: `${layer.position.y}%`,
        width: `${layer.size?.w || 80}px`,
        height: `${layer.size?.h || 120}px`,
        objectFit: 'contain'
      }"
    />

    <!-- Bubble -->
    <Bubble
      v-else-if="layer.type === 'bubble'"
      :layer="layer"
    />
  </div>
</template>

<style scoped>
.panel {
  position: absolute;
  border: 1px solid black;
  background: white;
  overflow: hidden;
}
</style>