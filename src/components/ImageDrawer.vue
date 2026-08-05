<script setup>
import "@/assets/imageDrawer.css"
import { computed, ref, watch } from "vue"
import defaultAssets from "@/data/defaultAssets"
import defaultFolders from "@/data/defaultFolders"
import {
  getUserAssets,
  deleteUserAsset,
  renameUserAsset,
  getUserAssetsByName,
  getUserAssetsByUpdated
} from "@/utils/userAssets"
import { getUserFolders } from "@/utils/userFolders"

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
      if(folderName.toLowerCase().includes(text)) return true
      
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
      b.updatedAt - a.updatedAt
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

  const newName = prompt("新しい名前",asset.name)
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

      <div class="drawer-folders">

        <button
          v-for="folder in folders"
          :key="folder.id"
          class="folder-button"
          :class="{
            active: selectedFolder === folder.id
          }"
          @click="selectFolder(folder.id)"
        >
          {{ folder.icon }} {{ folder.name }}
        </button>

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