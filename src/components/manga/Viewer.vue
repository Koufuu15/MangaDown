<script setup>
import Panel from "./Panel.vue"

const props = defineProps({
  panels: {
    type: Array,
    default: () => []
  }
})
console.log(props.panels)
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
  width: 80px;
  height: 80px;
  border: 1px solid #ccc;
}
</style>