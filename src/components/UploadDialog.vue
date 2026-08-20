<script setup>
import "../assets/uploadDialog.css"
import { computed, ref, watch } from "vue"

import defaultFolders from "@/data/defaultFolders"
import { getUserFolders, addUserFolder } from "@/utils/userFolders"

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits([
  "close",
  "save"
])

const name = ref("")
const folderId = ref("")
const newFolderMode = ref(false)
const newFolderName = ref("")

const userFolders = ref([])

watch(
  () => props.open,
  open => {
    if (!open) return

    name.value = ""
    folderId.value = ""
    newFolderMode.value = false
    newFolderName.value = ""

    userFolders.value = getUserFolders()
  }
)

const folders = computed(() => [
  ...defaultFolders,
  ...userFolders.value
])

function createFolder() {
  const value = newFolderName.value.trim()

  if (!value) return

  const folder = addUserFolder(value)

  if (!folder) {
    alert("同じ名前のフォルダがあります")
    return
  }

  userFolders.value = getUserFolders()

  folderId.value = folder.id

  newFolderName.value = ""
  newFolderMode.value = false
}

function save() {
  if (!name.value.trim()) {
    alert("画像名を入力してください")
    return
  }

  emit("save", {
    name: name.value.trim(),
    folderId: folderId.value,
    tags: []
  })

  close()
}

function close() {
  emit("close")
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="upload-overlay"
      @click="close"
    />

    <div
      v-if="open"
      class="upload-dialog"
    >
      <h2>
        Upload Image
      </h2>

      <label>
        画像名
      </label>

      <input
        v-model="name"
        type="text"
        placeholder="画像名"
      />

      <label>
        保存先
      </label>

      <select
        v-model="folderId"
      >
        <option value="">
          未分類
        </option>

        <option
          v-for="folder in folders"
          :key="folder.id"
          :value="folder.id"
        >
          {{ folder.icon }} {{ folder.name }}
        </option>
      </select>

      <button
        class="new-folder-button"
        @click="newFolderMode = !newFolderMode"
      >
        ＋ 新しいフォルダ
      </button>

      <div
        v-if="newFolderMode"
        class="new-folder-area"
      >
        <input
          v-model="newFolderName"
          type="text"
          placeholder="フォルダ名"
        />

        <button
          @click="createFolder"
        >
          作成
        </button>
      </div>

      <div class="dialog-actions">
        <button
          @click="close"
        >
          キャンセル
        </button>

        <button
          @click="save"
        >
          保存
        </button>
      </div>
    </div>
  </Teleport>
</template>