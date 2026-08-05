<script setup>
import "@/assets/imageDrawer.css"
import { computed, ref, watch } from "vue"
import defaultAssets from "@/data/defaultAssets"
import defaultFolders from "@/data/defaultFolders"
import {
  getUserAssets,
  deleteUserAsset,
  renameUserAsset,
  getUserAsset,
  getUserAssetsByName,
  getUserAssetsByUpdated,
  moveUserAsset
} from "@/utils/userAssets"
import {
  getUserFolders,
  renameUserFolder,
  deleteUserFolder
} from "@/utils/userFolders"

const props = defineProps({
  open:{
    type:Boolean,
    required:true
  }
})

const emit = defineEmits([
  "close",
  "insert"
])

const keyword = ref("")
const selectedFolder = ref("")
const sortType = ref("updated")
const userAssets = ref([])
const userFolders = ref([])
const folderOpen = ref(true)

watch(() => props.open, open => {
  if(!open) return
  reloadAssets()
}, { immediate:true })

function reloadAssets(){
  userAssets.value = getUserAssets().map(asset => ({
    ...asset,
    type:"user"
  }))

  userFolders.value = getUserFolders()
}

const folders = computed(() => [
  {
    id:"",
    name:"All",
    icon:"📁"
  },
  ...defaultFolders,
  ...userFolders.value
])

const assets = computed(() => {
  let result = [
    ...defaultAssets,
    ...userAssets.value
  ]

  if(selectedFolder.value){
    result = result.filter(
      asset => asset.folderId === selectedFolder.value
    )
  }

  const text = keyword.value.trim().toLowerCase()

  if(text){
    result = result.filter(asset => {
      if(asset.name.toLowerCase().includes(text)) return true

      const folderName = getFolderName(asset.folderId)

      if(folderName.toLowerCase().includes(text)){
        return true
      }

      return (asset.tags ?? []).some(tag =>
        tag.toLowerCase().includes(text)
      )
    })
  }

  if(sortType.value === "name"){
    result.sort((a,b) =>
      a.name.localeCompare(b.name,"ja")
    )
  }

  if(sortType.value === "updated"){
    result.sort((a,b) =>
      (b.updatedAt ?? 0) - (a.updatedAt ?? 0)
    )
  }

  return result
})

function closeDrawer(){
  emit("close")
}

function insert(asset){
  emit("insert",asset.name)
}

function selectFolder(id){
  selectedFolder.value = id
}

function removeAsset(asset){
  if(asset.type === "default") return

  const ok = confirm(`${asset.name}を削除しますか？`)

  if(!ok) return

  deleteUserAsset(asset.id)
  reloadAssets()
}

function rename(asset){
  if(asset.type === "default") return

  const newName = prompt(
    "新しい名前",
    asset.name
  )

  if(!newName) return

  const success = renameUserAsset(
    asset.id,
    newName
  )

  if(!success){
    alert("同じ名前の画像があります")
  }

  reloadAssets()
}

function renameFolder(folder){
  if(folder.type === "default") return

  const newName = prompt(
    "新しいフォルダ名",
    folder.name
  )

  if(!newName) return

  const success = renameUserFolder(
    folder.id,
    newName
  )

  if(!success){
    alert("同じ名前のフォルダがあります")
  }

  reloadAssets()
}

function removeFolder(folder){
  if(folder.type === "default") return

  const ok = confirm(
    `${folder.name}を削除しますか？\n中の画像は未分類になります。`
  )

  if(!ok) return

  const success = deleteUserFolder(
    folder.id
  )

  if(!success) return

  const assets = getUserAssets()

  assets.forEach(asset => {
    if(asset.folderId === folder.id){
      moveUserAsset(
        asset.id,
        ""
      )
    }
  })

  reloadAssets()
}

function getFolderName(folderId){
  if(!folderId){
    return "未分類"
  }

  const folder = folders.value.find(
    folder => folder.id === folderId
  )

  return folder?.name ?? folderId
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
        <h2>Assets</h2>

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

      <div class="drawer-folder-header">
        <button
          class="folder-toggle"
          @click="folderOpen = !folderOpen"
        >
          Folders {{ folderOpen ? "▼" : "▶" }}
        </button>
      </div>

      <div
        v-if="folderOpen"
        class="drawer-folders"
      >
        <div
          v-for="folder in folders"
          :key="folder.id"
          class="folder-row"
        >
          <button
            class="folder-button"
            :class="{
              active:selectedFolder === folder.id
            }"
            @click="selectFolder(folder.id)"
          >
            {{ folder.icon }} {{ folder.name }}
          </button>

          <div
            v-if="folder.type !== 'default' && folder.id"
            class="folder-actions"
          >
            <button
              @click="renameFolder(folder)"
            >
              ✏️
            </button>

            <button
              @click="removeFolder(folder)"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      <div class="drawer-sort">
        <select v-model="sortType">
          <option value="updated">
            更新日時順
          </option>

          <option value="name">
            名前順
          </option>
        </select>
      </div>

      <div class="drawer-content">
        <div
          v-if="assets.length === 0"
          class="empty-assets"
        >
          画像がありません
        </div>

        <div
          v-else
          class="asset-grid"
        >
          <div
            v-for="asset in assets"
            :key="asset.id"
            class="asset-card-wrapper"
          >
            <button
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
                {{ getFolderName(asset.folderId) }}
              </div>
            </button>

            <div
              v-if="asset.type === 'user'"
              class="asset-actions"
            >
              <button
                @click.stop="rename(asset)"
              >
                Rename
              </button>

              <button
                @click.stop="removeAsset(asset)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </Teleport>
</template>