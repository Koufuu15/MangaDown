<script setup>
import Panel from "./Panel.vue"

defineProps({
  panels: {
    type: Array,
    default: () => []
  }
})

</script>

<template>
  <div class="viewer">
    <Panel
      v-for="(panel, index) in panels"
      :key="index"
      :panel="panel"
    />
  </div>
</template>

<style scoped>
.viewer {
  display:flex; 
  flex-direction:column; 
  gap:0; 
  align-items:center;
  position: relative;
  width: 1000px;
  height: 1500px;
  border: 1px solid #ccc;
}
</style>