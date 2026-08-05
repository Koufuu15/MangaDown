<script setup>
import { computed, ref, watch } from "vue"

import defaultAssets from "@/data/defaultAssets"
import { getUserAssets } from "@/utils/userAssets"

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits([
  "close",
  "insert"
])

const keyword = ref("")
const userAssets = ref([])

watch(
  () => props.open,
  open => {
    if (!open) return

    userAssets.value = getUserAssets().map(asset => ({
      ...asset,
      type: "user"
    }))
  },
  {
    immediate: true
  }
)

const assets = computed(() => [
  ...defaultAssets,
  ...userAssets.value
])

const filteredAssets = computed(() => {
  const text =
    keyword.value
      .trim()
      .toLowerCase()

  if (!text) {
    return assets.value
  }

  return assets.value.filter(asset => {

    if (
      asset.name
        .toLowerCase()
        .includes(text)
    ) {
      return true
    }

    if (
      asset.folderId
        ?.toLowerCase()
        .includes(text)
    ) {
      return true
    }

    return (asset.tags ?? []).some(tag =>
      tag
        .toLowerCase()
        .includes(text)
    )
  })
})

function closeDrawer() {
  emit("close")
}

function insert(asset) {
  emit(
    "insert",
    asset.name
  )
}
</script>

<template>
  <Teleport to="body">

    <div
      v-if="open"
      class="drawer-overlay"
      @click="closeDrawer"
    />

    <aside
      v-if="open"
      class="image-drawer"
      :class="{ open }"
    >

      <div class="drawer-header">

        <h2>
          Assets
        </h2>

        <button
          class="close-button"
          @click="closeDrawer"
        >
          ✕
        </button>

      </div>

      <div class="drawer-search">

        <input
          v-model="keyword"
          type="text"
          placeholder="画像・タグ・フォルダを検索..."
        />

      </div>

      <div class="drawer-content">

        <div
          v-if="filteredAssets.length === 0"
          class="empty-assets"
        >
          画像がありません
        </div>

        <div
          v-else
          class="asset-grid"
        >

          <button
            v-for="asset in filteredAssets"
            :key="asset.id"
            class="asset-card"
            @click="insert(asset)"
          >

            <img
              :src="asset.src"
              :alt="asset.name"
              loading="lazy"
            />

            <div class="asset-name">
              {{ asset.name }}
            </div>

            <div class="asset-category">
              {{ asset.folderId || "未分類" }}
            </div>

          </button>

        </div>

      </div>

    </aside>

  </Teleport>
</template>