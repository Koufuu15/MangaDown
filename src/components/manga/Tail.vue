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

/*
 * =========================
 * Tail設定
 * =========================
 */

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

/*
 * =========================
 * Distance
 * =========================
 *
 * 吹き出し中心から、
 * Tailを描き始める位置までの距離。
 *
 * デフォルト:
 * 47
 *
 * 47 = 現在の吹き出し外周付近
 */

const tailDistance = computed(() => {
  const distance = Number(props.tail?.distance)

  if (isNaN(distance)) {
    return 47
  }

  return Math.max(0, distance)
})

/*
 * =========================
 * Size
 * =========================
 *
 * デフォルトサイズに対する倍率。
 *
 * 1   = デフォルト
 * 2   = 2倍
 * 0.5 = 半分
 *
 * 縦横比は維持する。
 */

const tailSize = computed(() => {
  const size = Number(props.tail?.size)

  if (isNaN(size)) {
    return 1
  }

  return Math.max(0, size)
})

/*
 * =========================
 * Angle
 * =========================
 *
 * 0°   = 右
 * 90°  = 上
 * 180° = 左
 * 270° = 下
 */

const angle = computed(() => {
  return tailPosition.value * Math.PI / 180
})

/*
 * =========================
 * 中心から指定距離の座標
 * =========================
 */

function pointFromCenter(radius) {
  return {
    x: 50 + radius * Math.cos(angle.value),
    y: 50 - radius * Math.sin(angle.value)
  }
}

/*
 * =========================
 * Tail開始位置
 * =========================
 *
 * distanceで指定した位置から
 * Tailを描き始める。
 */

const tailBase = computed(() => {
  return pointFromCenter(tailDistance.value)
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
   * =========================
   * デフォルトサイズ
   * =========================
   *
   * 根元の幅: 6
   * Tailの長さ: 20
   */

  const baseWidth = 6 * tailSize.value
  const length = 20 * tailSize.value

  /*
   * 根元の左側
   */
  const p1 = {
    x: base.x + perpendicular.x * baseWidth,
    y: base.y + perpendicular.y * baseWidth
  }

  /*
   * 根元の右側
   */
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
 * distance:
 *   円を描き始める位置
 *
 * size:
 *   円の大きさと間隔を倍率変更
 */

const circleTail = computed(() => {
  if (tailShape.value !== "circle") {
    return []
  }

  const size = tailSize.value

  /*
   * デフォルト:
   *
   * 円1 → 中心から 53
   * 円2 → 中心から 63
   * 円3 → 中心から 73
   *
   * distanceを起点として、
   * デフォルトの間隔をsize倍する。
   */

  const baseDistance = tailDistance.value

  const gap1 = 6 * size
  const gap2 = 16 * size

  return [
    {
      ...pointFromCenter(baseDistance + gap1),
      radius: 5.5 * size
    },
    {
      ...pointFromCenter(baseDistance + gap2),
      radius: 4 * size
    },
    {
      ...pointFromCenter(baseDistance + 26 * size),
      radius: 2.5 * size
    }
  ]
})

/*
 * =========================
 * Border
 * =========================
 */

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

/*
 * =========================
 * SVG polygon helper
 * =========================
 */

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