<script setup>
defineProps({
  panel: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div
    class="relative border-4 border-black rounded-xl shadow-xl overflow-hidden bg-white"
    :style="{
      width: panel.size.width + 'px',
      height: panel.size.height + 'px',
      backgroundColor: panel.backgroundColor
    }"
  >
    <template
      v-for="(component, index) in panel.components"
      :key="index"
    >
      <div
        v-if="component.bubble"
        v-for="(bubble, bubbleIndex) in component.bubble"
        :key="bubbleIndex"
        class="absolute bg-white border-4 border-black rounded-2xl px-3 py-2 shadow-md"
        :style="{
          left: bubble.position.x + '%',
          top: bubble.position.y + '%',
          width: bubble.size.width + 'px',
          height: bubble.size.height + 'px',
          zIndex: bubble.layer
        }"
      >
        <p
          :style="{
            fontSize: bubble.text.fontSize,
            color: bubble.text.color,
            fontFamily: bubble.text.font
          }"
        >
          {{ bubble.text.content }}
        </p>
      </div>
    </template>
  </div>
</template>

<style scoped>
p {
  margin: 0;
  word-break: break-word;
  white-space: pre-wrap;
}
</style>