<script setup>
import { computed } from "vue"

const props = defineProps({
  bubble: {
    type: Object,
    required: true
  }
})

const shape = computed(() => props.bubble.shape ?? "round")
const background = computed(() => props.bubble.background ?? "#ffffff")
const borderEnabled = computed(() => props.bubble.border ?? true)
const borderWidth = computed(() => props.bubble.borderWidth ?? 3)
const borderColor = computed(() => props.bubble.borderColor ?? "#111111")

const tail = computed(() => {
  return props.bubble.tail ?? null
})

const tailShape = computed(() => {
  return tail.value?.shape ?? "none"
})

const tailPosition = computed(() => {
  const position = Number(tail.value?.position)

  if (isNaN(position)) {
    return 0
  }

  return Math.max(0, Math.min(360, position))
})

const bubbleStyle = computed(() => ({
  position: "absolute",
  left: `${props.bubble.position?.x ?? 0}%`,
  top: `${props.bubble.position?.y ?? 0}%`,
  width: `${props.bubble.size?.width ?? 100}px`,
  height: `${props.bubble.size?.height ?? 60}px`,
  boxSizing: "border-box",
  overflow: "visible"
}))

const stroke = computed(() =>
  borderEnabled.value ? borderColor.value : "none"
)

const strokeWidth = computed(() =>
  borderEnabled.value ? borderWidth.value : 0
)

/*
 * 角度をラジアンに変換
 *
 * 0°   = 右
 * 90°  = 上
 * 180° = 左
 * 270° = 下
 *
 * SVGはY軸が下向きなので、
 * sinの部分をマイナスにする。
 */
const angle = computed(() => {
  return tailPosition.value * Math.PI / 180
})

/*
 * 中心から指定角度方向の座標
 */
function pointFromCenter(radius) {
  return {
    x: 50 + radius * Math.cos(angle.value),
    y: 50 - radius * Math.sin(angle.value)
  }
}

/*
 * 本体の外周位置
 *
 * square:
 * 正方形の外周と角度の線が交わる位置を計算
 *
 * round:
 * 円周上の位置
 *
 * その他:
 * おおよその外周位置
 */
const tailBase = computed(() => {
  const cos = Math.cos(angle.value)
  const sin = Math.sin(angle.value)

  if (shape.value === "square") {
    const radius = 47 / Math.max(Math.abs(cos), Math.abs(sin))

    return pointFromCenter(radius)
  }

  if (shape.value === "round") {
    return pointFromCenter(44)
  }

  return pointFromCenter(44)
})

/*
 * triangle tail
 *
 * 本体に接する2点と、
 * 外側に伸びる先端の3点から三角形を作る。
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

  const baseWidth = 6
  const length = 20

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

  return {
    p1,
    p2,
    tip
  }
})

/*
 * circle tail
 *
 * 本体から離れた場所に3個の円を配置。
 *
 * position方向に向かって
 * 小 → 中 → 大
 * の順に配置する。
 */
const circleTail = computed(() => {
  if (tailShape.value !== "circle") {
    return []
  }

  const cos = Math.cos(angle.value)
  const sin = Math.sin(angle.value)

  return [
    {
      ...pointFromCenter(55),
      radius: 5.5
    },
    {
      ...pointFromCenter(67),
      radius: 4
    },
    {
      ...pointFromCenter(78),
      radius: 2.5
    }
  ]
})

function pointsToString(points) {
  return points
    .map(point => `${point.x},${point.y}`)
    .join(" ")
}
</script>

<template>
  <div
    class="bubble"
    :class="`bubble-${shape}`"
    :style="bubbleStyle"
  >

    <svg
      class="bubble-svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >

      <!-- =========================
           Square
           ========================= -->

      <path
        v-if="shape === 'square'"
        d="
          M 3 3
          H 97
          V 97
          H 3
          Z
        "
        :fill="background"
        :stroke="stroke"
        :stroke-width="strokeWidth"
        stroke-linejoin="round"
      />


      <!-- =========================
           Round
           ========================= -->

      <ellipse
        v-else-if="shape === 'round'"
        cx="50"
        cy="50"
        rx="47"
        ry="47"
        :fill="background"
        :stroke="stroke"
        :stroke-width="strokeWidth"
      />


      <!-- =========================
           Thought
           ========================= -->

      <path
        v-else-if="shape === 'thought'"
        d="
          M 10 30
          C 5 22, 12 15, 20 18
          C 20 9, 30 6, 36 13
          C 42 5, 52 8, 53 17
          C 61 9, 71 12, 70 21
          C 81 17, 89 24, 84 32
          C 94 36, 94 46, 85 50
          C 94 56, 89 66, 80 65
          C 82 76, 72 82, 64 75
          C 58 87, 47 87, 44 77
          C 34 84, 24 78, 27 69
          C 16 72, 9 64, 15 56
          C 5 52, 5 40, 14 37
          C 8 35, 8 32, 10 30
          Z
        "
        :fill="background"
        :stroke="stroke"
        :stroke-width="strokeWidth"
        stroke-linejoin="round"
      />


      <!-- =========================
           Shout
           ========================= -->

      <path
        v-else-if="shape === 'shout'"
        d="
          M 50 2
          C 54 12, 57 14, 64 7
          C 64 17, 68 20, 77 15
          C 74 25, 78 28, 88 27
          C 80 35, 83 40, 98 43
          C 86 48, 86 53, 98 58
          C 83 60, 81 66, 88 74
          C 77 72, 73 77, 77 87
          C 67 81, 62 84, 61 98
          C 55 87, 49 87, 43 98
          C 42 85, 36 82, 27 87
          C 31 77, 27 73, 17 75
          C 24 66, 20 61, 5 59
          C 17 53, 17 48, 3 43
          C 17 40, 21 35, 12 27
          C 23 29, 27 24, 23 14
          C 33 20, 38 17, 36 7
          C 44 14, 48 12, 50 2
          Z
        "
        :fill="background"
        :stroke="stroke"
        :stroke-width="strokeWidth"
        stroke-linejoin="round"
      />


      <!-- =========================
           Star
           ========================= -->

      <path
        v-else-if="shape === 'star'"
        d="
          M 50 2
          L 61 35
          L 96 25
          L 70 49
          L 98 68
          L 64 66
          L 55 98
          L 44 67
          L 10 77
          L 31 51
          L 4 31
          L 39 35
          Z
        "
        :fill="background"
        :stroke="stroke"
        :stroke-width="strokeWidth"
        stroke-linejoin="round"
      />


      <!-- =========================
           Triangle Tail
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
        :stroke="stroke"
        :stroke-width="strokeWidth"
        stroke-linejoin="round"
      />


      <!-- =========================
           Circle Tail
           ========================= -->

      <circle
        v-for="(circle, index) in circleTail"
        :key="index"
        :cx="circle.x"
        :cy="circle.y"
        :r="circle.radius"
        :fill="background"
        :stroke="stroke"
        :stroke-width="strokeWidth > 0 ? Math.max(1, strokeWidth * 0.7) : 0"
      />

    </svg>


    <!-- =========================
         Text
         ========================= -->

    <div
      v-if="bubble.text"
      class="bubble-text"
      :style="{
        fontSize: bubble.text.fontSize,
        color: bubble.text.color,
        fontFamily: bubble.text.font
      }"
    >
      {{ bubble.text.content }}
    </div>

  </div>
</template>

<style scoped>
.bubble {
  position: absolute;
  overflow: visible;
}

.bubble-svg {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  overflow: visible;
}

.bubble-text {
  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 8px;

  text-align: center;

  font-size: 14px;

  z-index: 2;

  pointer-events: none;
}
</style>