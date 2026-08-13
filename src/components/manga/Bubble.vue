<script setup>
import { computed } from "vue"
import { marked } from "marked"
import Tail from "./Tail.vue"

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

/*
 * Text direction
 *
 * tb = 縦書き
 * rl = 横書き
 */
const textDirection = computed(() => {
  return props.bubble.text?.direction === "tb"
    ? "vertical-rl"
    : "horizontal-tb"
})

/*
 * Text
 *
 * bubble.text.content をMarkdownとして変換する。
 *
 * breaks: true
 * → Markdown上で普通に改行した場合も
 *   <br>として扱う。
 */
const textHtml = computed(() => {
  const content = props.bubble.text?.content ?? ""

  if (!content) {
    return ""
  }

  return marked.parse(content, {
    breaks: true
  })
})

/*
 * Tail
 *
 * bubble.tailは配列として扱う。
 */
const tails = computed(() => {
  if (!Array.isArray(props.bubble.tail)) {
    return []
  }

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

    </svg>


    <!-- =========================
         Tail
         ========================= -->

    <Tail
      v-for="(tail, index) in tails"
      :key="index"
      :tail="tail"
      :bubble-shape="shape"
      :background="background"
      :border-color="borderColor"
      :border-width="borderWidth"
      :border-enabled="borderEnabled"
    />


    <!-- =========================
         Text
         ========================= -->

    <div
      v-if="bubble.text"
      class="bubble-text"
      :style="{
        fontSize: bubble.text.fontSize,
        color: bubble.text.color,
        fontFamily: bubble.text.font,
        writingMode: textDirection
      }"
      v-html="textHtml"
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

  text-orientation: mixed;

  font-size: 14px;
  line-height: 1.5;

  z-index: 2;

  pointer-events: none;

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