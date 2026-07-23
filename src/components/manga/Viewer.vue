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
.viewer{
    display:flex;
    flex-direction:column;
    align-items:center;
    gap:24px;
    position:relative;
    width:100%;
    min-width: 500px;
}
</style>