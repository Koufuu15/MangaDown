<script setup>
import { computed, ref } from "vue"
import { marked } from "marked"
import Tail from "./Tail.vue"

const props = defineProps({
  bubble: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(["select"])

const textDrag = ref(null)
const tailDrag = ref(null)

function startTextDrag(event) {
  if (event.button !== 0) return
  const rect = event.currentTarget.closest(".bubble").getBoundingClientRect()
  emit("select")
  textDrag.value = { x: event.clientX, y: event.clientY, rect, startX: props.bubble.text.position?.x ?? 0, startY: props.bubble.text.position?.y ?? 0 }
  event.currentTarget.setPointerCapture?.(event.pointerId)
  event.preventDefault()
  event.stopPropagation()
}

function selectBubble(event) {
  emit("select")
  event.stopPropagation()
}

function moveTextDrag(event) {
  if (!textDrag.value) return
  const current = textDrag.value
  props.bubble.text.position = { x: current.startX + (event.clientX - current.x) / current.rect.width * 100, y: current.startY + (event.clientY - current.y) / current.rect.height * 100 }
}

function endTextDrag() {
  textDrag.value = null
}

function startTailDrag(event, tail) {
  if (event.button !== 0) return
  const rect = event.currentTarget.closest(".bubble").getBoundingClientRect()
  emit("select")
  tailDrag.value = { tail, rect }
  event.currentTarget.setPointerCapture?.(event.pointerId)
  event.preventDefault()
  event.stopPropagation()
}

function moveTailDrag(event) {
  if (!tailDrag.value) return
  const { tail, rect } = tailDrag.value
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const deltaX = event.clientX - centerX
  const deltaY = centerY - event.clientY
  tail.position = (Math.atan2(deltaY, deltaX) * 180 / Math.PI + 360) % 360
  tail.distance = Math.min(100, Math.max(0, Math.sqrt(deltaX ** 2 + deltaY ** 2) / Math.min(rect.width, rect.height) * 100))
}

function endTailDrag() {
  tailDrag.value = null
}

const shape = computed(() => props.bubble.shape ?? "round")
const background = computed(() => props.bubble.background ?? "#ffffff")
const borderEnabled = computed(() => props.bubble.border ?? true)
const borderWidth = computed(() => props.bubble.borderWidth ?? 3)
const borderColor = computed(() => props.bubble.borderColor ?? "#111111")

const textDirection = computed(() => {
  return props.bubble.text?.direction === "tb"
    ? "vertical-rl"
    : "horizontal-tb"
})

const textHtml = computed(() => {
  const content = props.bubble.text?.content ?? ""
  if (!content) return ""
  return marked.parse(content, { breaks: true })
})

const tails = computed(() => {
  if (!Array.isArray(props.bubble.tail)) return []
  return props.bubble.tail
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
 * =========================
 * Tail接続部分のマスク
 * =========================
 *
 * 吹き出し本体の輪郭線を、
 * 尻尾の根元と重なる部分だけ背景色で覆う。
 */
const tailMasks = computed(() => {
  return tails.value
    .filter(tail => (tail?.shape ?? "triangle") === "triangle")
    .map(tail => {
      const position = Number(tail?.position)
      const distance = Number(tail?.distance)
      const size = Number(tail?.size)

      const angle =
        (isNaN(position) ? 0 : Math.max(0, Math.min(360, position))) *
        Math.PI / 180

      const radius = isNaN(distance) ? 47 : Math.max(0, distance)
      const scale = isNaN(size) ? 1 : Math.max(0, size)

      const baseWidth = 6 * scale

      const cos = Math.cos(angle)
      const sin = Math.sin(angle)

      const base = {
        x: 50 + radius * cos,
        y: 50 - radius * sin
      }

      const perpendicular = {
        x: -sin,
        y: -cos
      }

      const p1 = {
        x: base.x + perpendicular.x * baseWidth,
        y: base.y + perpendicular.y * baseWidth
      }

      const p2 = {
        x: base.x - perpendicular.x * baseWidth,
        y: base.y - perpendicular.y * baseWidth
      }

      const maskDepth = 10 + borderWidth.value

      const inner = {
        x: base.x - cos * maskDepth,
        y: base.y + sin * maskDepth
      }

      return [p1, inner, p2]
    })
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
    @pointerdown="selectBubble"
  >
    <svg
      class="bubble-svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <!-- Square -->
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

      <!-- Round -->
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

      <!-- Thought -->
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

      <!-- Shout -->
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

      <!-- Star -->
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

      <!-- Tailとの接続部分をマスク -->
      <polygon
        v-for="(mask, index) in tailMasks"
        :key="index"
        :points="pointsToString(mask)"
        :fill="background"
        stroke="none"
      />
    </svg>

    <!-- Tail -->
    <Tail
      v-for="(tail, index) in tails"
      :key="index"
      :tail="tail"
      :bubble-shape="shape"
      :background="background"
      :border-color="borderColor"
      :border-width="borderWidth"
      :border-enabled="borderEnabled"
      @pointerdown="startTailDrag($event, tail)"
      @pointermove="moveTailDrag"
      @pointerup="endTailDrag"
      @pointercancel="endTailDrag"
    />

    <!-- Text -->
    <div
      v-if="bubble.text"
      class="bubble-text"
      :style="{
        fontSize: bubble.text.fontSize,
        color: bubble.text.color,
        fontFamily: bubble.text.font,
        writingMode: textDirection,
        left: `${bubble.text.position?.x ?? 0}%`,
        top: `${bubble.text.position?.y ?? 0}%`
      }"
      v-html="textHtml"
      @pointerdown="startTextDrag"
      @pointermove="moveTextDrag"
      @pointerup="endTextDrag"
      @pointercancel="endTextDrag"
    />

  </div>
</template>

<style scoped>
.bubble {
  position: absolute;
  overflow: visible;
}

.bubble-svg {
  position: absolute;
  width: 100%;
  height: 100%;

  width: 100%;
  height: 100%;
  overflow: visible;
  z-index: 1;
}

.bubble-text {
  position: absolute;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  text-align: center;
  text-orientation: mixed;
  font-size: 14px;
  line-height: 1.5;
  z-index: 2;

  pointer-events: auto;

  /*
   * Markdownが生成するpなどの余白を
   * 吹き出し内では抑える。
   */
  white-space: normal;
}

.bubble-text :deep(p) {
  margin: 0;
}

.bubble-text :deep(strong) {
  font-weight: 700;
}

.bubble-text :deep(em) {
  font-style: italic;
}

.bubble-text :deep(ul),
.bubble-text :deep(ol) {
  margin: 0;
  padding-left: 1.2em;
}

.bubble-text :deep(blockquote) {
  margin: 0;
}
</style>