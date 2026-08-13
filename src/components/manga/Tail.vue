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

const tailShape = computed(() => {
  return props.tail?.shape ?? "triangle"
})

const tailPosition = computed(() => {
  const position = Number(props.tail?.position)

  if (isNaN(position)) {
    return 0
  }

  return Math.max(0, Math.min(360, position))
})

const angle = computed(() => {
  return tailPosition.value * Math.PI / 180
})

/*
 * 中心から指定した距離の位置
 *
 * 0°   = 右
 * 90°  = 上
 * 180° = 左
 * 270° = 下
 */
function pointFromCenter(radius) {
  return {
    x: 50 + radius * Math.cos(angle.value),
    y: 50 - radius * Math.sin(angle.value)
  }
}

/*
 * Bubble本体の外周位置
 */
const tailBase = computed(() => {
  const cos = Math.cos(angle.value)
  const sin = Math.sin(angle.value)

  /*
   * Square
   */
  if (props.bubbleShape === "square") {
    const radius =
      47 / Math.max(Math.abs(cos), Math.abs(sin))

    return pointFromCenter(radius)
  }

  /*
   * Round
   */
  if (props.bubbleShape === "round") {
    return pointFromCenter(47)
  }

  /*
   * Thought / Shout / Star
   *
   * 現時点では簡易的に44を外周として扱う。
   */
  return pointFromCenter(44)
})

/*
 * =========================
 * Triangle Tail
 * =========================
 */

const triangleTail = computed(() => {
  if (tailShape.value !== "triangle") {
    return null
  }

  const base = tailBase.value

  const cos = Math.cos(angle.value)
  const sin = Math.sin(angle.value)

  /*
   * 角度方向に対して垂直なベクトル
   */
  const perpendicular = {
    x: -sin,
    y: -cos
  }

  /*
   * Tailの根元の幅
   */
  const baseWidth = 6

  /*
   * Tailの長さ
   */
  const length = 20

  const p1 = {
    x: base.x + perpendicular.x * baseWidth,
    y: base.y + perpendicular.y * baseWidth
  }

  const p2 = {
    x: base.x - perpendicular.x * baseWidth,
    y: base.y - perpendicular.y * baseWidth
  }

  /*
   * Tailの先端
   */
  const tip = {
    x: base.x + cos * length,
    y: base.y - sin * length
  }

  return {
    p1,
    p2,
    tip
  }
})

/*
 * =========================
 * Circle Tail
 * =========================
 *
 * 本体に近いほど大きく、
 * 離れるほど小さくする。
 *
 * 大 → 中 → 小
 */

const circleTail = computed(() => {
  if (tailShape.value !== "circle") {
    return []
  }

  return [
    {
      ...pointFromCenter(53),
      radius: 5.5
    },
    {
      ...pointFromCenter(63),
      radius: 4
    },
    {
      ...pointFromCenter(73),
      radius: 2.5
    }
  ]
})

const tailStroke = computed(() => {
  return props.borderEnabled
    ? props.borderColor
    : "none"
})

const tailStrokeWidth = computed(() => {
  return props.borderEnabled
    ? props.borderWidth
    : 0
})

const circleStrokeWidth = computed(() => {
  if (!props.borderEnabled) {
    return 0
  }

  return Math.max(
    1,
    props.borderWidth * 0.7
  )
})

function pointsToString(points) {
  return points
    .map(point => `${point.x},${point.y}`)
    .join(" ")
}
</script>

<template>
  <svg
    class="bubble-tail"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >

    <!-- =========================
         Triangle
         ========================= -->

    <polygon
      v-if="triangleTail"
      :points="
        pointsToString([
          triangleTail.p1,
          triangleTail.tip,
          triangleTail.p2
        ])
      "
      :fill="background"
      :stroke="tailStroke"
      :stroke-width="tailStrokeWidth"
      stroke-linejoin="round"
    />


    <!-- =========================
         Circle
         ========================= -->

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