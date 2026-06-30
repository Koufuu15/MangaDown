<script setup>
defineProps({
  panel: {
    type: Object,
  }
})
</script>

<template>
  <div class="panel"
    :style="{
      left: panel.position.x,
      top: panel.position?.y,
      width: panel.size?.width,
      height: panel.size?.height,
      backgroundImage: panel.backgroundImg,
      backgroundColor: panel.backgroundColor
    }"
  ></div>
  <div
    v-for="(component, index) in panel.components"
    :key="index"
  >
    <!-- Character -->
    <img
      v-if="component.character"
      v-for="component in component.character"
      :src="`$src\data\images{component.name}`"
      :alt="component.name"
      :style="{
        position: 'absolute',
        left: `${character.position.x}%`,
        top: `${character.position.y}%`,
        width: `${character.size?.w || 80}px`,
        height: `${character.size?.h || 120}px`,
        objectFit: 'contain'
      }"
    />

    <!-- Bubble -->
    <div
      v-else-if="component.bubble"
      v-for="bubble in component.bubble"
      :style="{
        left: bubble.position.x,
        top: bubble.position?.y,
        width: bubble.size?.width,
        height: bubble.size?.height,
        border: '1px solid black',
        backgroundColor: bubble.backgroundColor,
        padding: '8px',
        fontSize: bubble.text.fontSize
      }"
    >
    {{ bubble.text.content }}
    </div>
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