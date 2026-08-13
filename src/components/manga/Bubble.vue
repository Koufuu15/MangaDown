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
  return props.bubble.tail ?? {
    direction: "none",
    position: 50
  }
})

const tailDirection = computed(() => {
  if (typeof tail.value === "string") {
    return tail.value
  }

  return tail.value?.direction ?? "none"
})

const tailPosition = computed(() => {
  if (typeof tail.value === "object") {
    return tail.value.position ?? 50
  }

  return 50
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
        :d="
          tailDirection === 'bottom'
            ? `
              M 3 3
              H 97
              V 97
              H ${tailPosition + 6}
              L ${tailPosition} 115
              L ${tailPosition - 6} 97
              H 3
              Z
            `
            : tailDirection === 'top'
              ? `
                M 3 3
                H ${tailPosition - 6}
                L ${tailPosition} -15
                L ${tailPosition + 6} 3
                H 97
                V 97
                H 3
                Z
              `
              : tailDirection === 'right'
                ? `
                  M 3 3
                  H 97
                  V ${tailPosition - 6}
                  L 115 ${tailPosition}
                  L 97 ${tailPosition + 6}
                  V 97
                  H 3
                  Z
                `
                : tailDirection === 'left'
                  ? `
                    M 3 3
                    H 97
                    V 97
                    H 3
                    V ${tailPosition + 6}
                    L -15 ${tailPosition}
                    L 3 ${tailPosition - 6}
                    Z
                  `
                  : `
                    M 3 3
                    H 97
                    V 97
                    H 3
                    Z
                  `
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
        v-else-if="shape === 'round' && tailDirection === 'none'"
        cx="50"
        cy="50"
        rx="47"
        ry="47"
        :fill="background"
        :stroke="stroke"
        :stroke-width="strokeWidth"
      />

      <path
        v-else-if="shape === 'round'"
        :d="
          tailDirection === 'bottom'
            ? `
              M 8 50
              C 8 24 27 5 50 5
              C 73 5 92 24 92 50
              C 92 73 73 92 50 92
              C 45 92 40 91 36 90
              L ${tailPosition + 5} 110
              L ${tailPosition - 2} 90
              C 20 84 8 69 8 50
              Z
            `
            : tailDirection === 'top'
              ? `
                M 8 50
                C 8 27 27 8 50 8
                C 54 8 58 9 62 10
                L ${tailPosition + 5} -10
                L ${tailPosition - 2} 10
                C 17 16 8 31 8 50
                Z
              `
              : `
                M 8 50
                C 8 25 27 5 50 5
                C 75 5 95 25 95 50
                C 95 75 75 95 50 95
                C 25 95 8 75 8 50
                Z
              `
        "
        :fill="background"
        :stroke="stroke"
        :stroke-width="strokeWidth"
        stroke-linejoin="round"
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