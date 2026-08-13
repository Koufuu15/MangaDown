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

const border = computed(() => {
  if (!borderEnabled.value) {
    return "none"
  }

  return `${borderWidth.value}px solid ${borderColor.value}`
})

const bubbleStyle = computed(() => ({
  position: "absolute",
  left: `${props.bubble.position?.x ?? 0}%`,
  top: `${props.bubble.position?.y ?? 0}%`,
  width: `${props.bubble.size?.width ?? 100}px`,
  height: `${props.bubble.size?.height ?? 60}px`,
  background: background.value,
  border: border.value,
  boxSizing: "border-box"
}))
</script>

<template>
  <div
    class="bubble"
    :class="`bubble-${shape}`"
    :style="bubbleStyle"
  >
    <!-- square -->
    <svg
      v-if="shape === 'square'"
      class="bubble-svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path
        d="
          M 3 3
          H 97
          V 97
          H 3
          Z
        "
        :fill="background"
        :stroke="borderEnabled ? borderColor : 'none'"
        :stroke-width="borderWidth"
      />
    </svg>

    <!-- round -->
    <svg
      v-else-if="shape === 'round'"
      class="bubble-svg"
      viewBox="0 0 100 100"
        preserveAspectRatio="none"
    >
      <ellipse
        cx="50"
        cy="50"
        rx="47"
        ry="47"
        :fill="background"
        :stroke="borderEnabled ? borderColor : 'none'"
        :stroke-width="borderWidth"
      />
    </svg>

    <!-- thought -->
    <svg
      v-else-if="shape === 'thought'"
      class="bubble-svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path
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
        :stroke="borderEnabled ? borderColor : 'none'"
        :stroke-width="borderWidth"
        stroke-linejoin="round"
      />
    </svg>

    <!-- shout -->
    <svg
      v-else-if="shape === 'shout'"
      class="bubble-svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path
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
        :stroke="borderEnabled ? borderColor : 'none'"
        :stroke-width="borderWidth"
        stroke-linejoin="round"
      />
    </svg>

    <!-- star -->
    <svg
      v-else-if="shape === 'star'"
      class="bubble-svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path
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
        :stroke="borderEnabled ? borderColor : 'none'"
        :stroke-width="borderWidth"
        stroke-linejoin="round"
      />
    </svg>

    <!-- tail -->
    <div
      v-if="tailDirection !== 'none'"
      class="bubble-tail"
      :class="`tail-${tailDirection}`"
      :style="{
        '--tail-position': `${tailPosition}%`,
        '--tail-background': background,
        '--tail-border-color': borderColor,
        '--tail-border-width': `${borderWidth}px`
      }"
    />

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
}


/* =========================
   Tail
   ========================= */

.bubble-tail {
  position: absolute;

  width: 0;
  height: 0;

  z-index: 3;
}


/* bottom */

.tail-bottom {
  left: var(--tail-position);
  bottom: -25px;

  transform: translateX(-50%);

  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 25px solid var(--tail-border-color);
}

.tail-bottom::after {
  content: "";

  position: absolute;

  left: -11px;
  top: -24px;

  border-left: 11px solid transparent;
  border-right: 11px solid transparent;
  border-top: 20px solid var(--tail-background);
}


/* top */

.tail-top {
  left: var(--tail-position);
  top: -25px;

  transform: translateX(-50%);

  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-bottom: 25px solid var(--tail-border-color);
}

.tail-top::after {
  content: "";

  position: absolute;

  left: -11px;
  top: 4px;

  border-left: 11px solid transparent;
  border-right: 11px solid transparent;
  border-bottom: 20px solid var(--tail-background);
}


/* right */

.tail-right {
  top: var(--tail-position);
  right: -25px;

  transform: translateY(-50%);

  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-left: 25px solid var(--tail-border-color);
}

.tail-right::after {
  content: "";

  position: absolute;

  left: -24px;
  top: -11px;

  border-top: 11px solid transparent;
  border-bottom: 11px solid transparent;
  border-left: 20px solid var(--tail-background);
}


/* left */

.tail-left {
  top: var(--tail-position);
  left: -25px;

  transform: translateY(-50%);

  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-right: 25px solid var(--tail-border-color);
}

.tail-left::after {
  content: "";

  position: absolute;

  right: -24px;
  top: -11px;

  border-top: 11px solid transparent;
  border-bottom: 11px solid transparent;
  border-right: 20px solid var(--tail-background);
}
</style>