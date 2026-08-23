<script setup>
import { computed } from "vue"

const props = defineProps({
  tail: {
    type: Object,
    required: true
  },
  bubbleShape: {
    type: String,
    default: "round"
  },
  background: {
    type: String,
    default: "#ffffff"
  },
  borderColor: {
    type: String,
    default: "#111111"
  },
  borderWidth: {
    type: Number,
    default: 3
  },
  borderEnabled: {
    type: Boolean,
    default: true
  }
})

const tailShape = computed(() => props.tail?.shape ?? "triangle")

const tailPosition = computed(() => {
  const position = Number(props.tail?.position)
  if (isNaN(position)) return 0
  return Math.max(0, Math.min(360, position))
})

const tailDistance = computed(() => {
  const distance = Number(props.tail?.distance)
  if (isNaN(distance)) return 47
  return Math.max(0, distance)
})

const tailSize = computed(() => {
  const size = Number(props.tail?.size)
  if (isNaN(size)) return 1
  return Math.max(0, size)
})

const angle = computed(() => {
  return tailPosition.value * Math.PI / 180
})

function pointFromCenter(radius) {
  return {
    x: 50 + radius * Math.cos(angle.value),
    y: 50 - radius * Math.sin(angle.value)
  }
}

const tailBase = computed(() => {
  return pointFromCenter(tailDistance.value)
})

const triangleTail = computed(() => {
  if (tailShape.value !== "triangle") return null

  const base = tailBase.value
  const cos = Math.cos(angle.value)
  const sin = Math.sin(angle.value)

  const perpendicular = {
    x: -sin,
    y: -cos
  }

  const baseWidth = 6 * tailSize.value
  const length = 20 * tailSize.value

  const p1 = {
    x: base.x + perpendicular.x * baseWidth,
    y: base.y + perpendicular.y * baseWidth
  }

  const p2 = {
    x: base.x - perpendicular.x * baseWidth,
    y: base.y - perpendicular.y * baseWidth
  }

  const tip = {
    x: base.x + cos * length,
    y: base.y - sin * length
  }

  return { p1, p2, tip }
})

const circleTail = computed(() => {
  if (tailShape.value !== "circle") return []

  const size = tailSize.value
  const baseDistance = tailDistance.value

  return [
    {
      ...pointFromCenter(baseDistance + 6 * size),
      radius: 5.5 * size
    },
    {
      ...pointFromCenter(baseDistance + 16 * size),
      radius: 4 * size
    },
    {
      ...pointFromCenter(baseDistance + 26 * size),
      radius: 2.5 * size
    }
  ]
})

const tailStroke = computed(() => {
  return props.borderEnabled ? props.borderColor : "none"
})

const tailStrokeWidth = computed(() => {
  return props.borderEnabled ? props.borderWidth : 0
})

const circleStrokeWidth = computed(() => {
  if (!props.borderEnabled) return 0
  return Math.max(1, props.borderWidth * 0.7)
})
</script>

<template>
  <svg
    class="bubble-tail"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <!-- Triangle -->
    <template v-if="triangleTail">
      <!-- Tail本体 -->
      <polygon
        :points="`${triangleTail.p1.x},${triangleTail.p1.y} ${triangleTail.tip.x},${triangleTail.tip.y} ${triangleTail.p2.x},${triangleTail.p2.y}`"
        :fill="background"
        stroke="none"
      />

      <!-- 左側の輪郭線 -->
      <line
        v-if="borderEnabled"
        :x1="triangleTail.p1.x"
        :y1="triangleTail.p1.y"
        :x2="triangleTail.tip.x"
        :y2="triangleTail.tip.y"
        :stroke="tailStroke"
        :stroke-width="tailStrokeWidth"
        stroke-linecap="round"
      />

      <!-- 右側の輪郭線 -->
      <line
        v-if="borderEnabled"
        :x1="triangleTail.tip.x"
        :y1="triangleTail.tip.y"
        :x2="triangleTail.p2.x"
        :y2="triangleTail.p2.y"
        :stroke="tailStroke"
        :stroke-width="tailStrokeWidth"
        stroke-linecap="round"
      />
    </template>

    <!-- Circle -->
    <circle
      v-for="(circle, index) in circleTail"
      :key="index"
      :cx="circle.x"
      :cy="circle.y"
      :r="circle.radius"
      :fill="background"
      :stroke="tailStroke"
      :stroke-width="circleStrokeWidth"
    />
  </svg>
</template>

<style scoped>
.bubble-tail {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  z-index: 1;
}
</style>