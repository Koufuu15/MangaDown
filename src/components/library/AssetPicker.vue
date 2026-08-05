<template>
  <div v-if="modelValue" class="asset-overlay" @click.self="close">
    <div class="asset-picker">
      <header class="picker-header">
        <h2>画像を選択</h2>
        <button class="close-button" @click="close">×</button>
      </header>

      <div class="picker-body">
        <aside class="folder-area">
          <FolderList
            :folders="folders"
            v-model="selectedFolder"
            @manage="managerOpen=true"
          />
        </aside>

        <main class="asset-area">
          <div class="asset-grid">
            <AssetCard
              v-for="asset in filteredAssets"
              :key="asset.id"
              :asset="asset"
              @select="selectAsset"
              @rename="renameAsset"
              @delete="deleteAsset"
              @move="moveAsset"
            />
          </div>
        </main>
      </div>

      <FolderManager
        v-if="managerOpen"
        @update="refresh"
        @close="managerOpen=false"
      />

      <FolderSelectModal
        v-if="folderSelectOpen"
        @select="completeMove"
        @close="folderSelectOpen=false"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import AssetCard from "./AssetCard.vue"
import FolderList from "./FolderList.vue"
import FolderManager from "./FolderManager.vue"
import FolderSelectModal from "./FolderSelectModal.vue"

import defaultFolders from "@/data/defaultFolders"

import { getAllAssets } from "@/utils/assetResolver"
import { getUserFolders } from "@/utils/userFolders"
import {
  deleteUserAsset,
  renameUserAsset,
  moveUserAsset
} from "@/utils/userAssets"

const props = defineProps({
  modelValue:{
    type:Boolean,
    default:false
  }
})

const emit = defineEmits([
  "update:modelValue",
  "select"
])

const assets = ref([])
const userFolders = ref([])
const selectedFolder = ref("")
const managerOpen = ref(false)

const folderSelectOpen = ref(false)
const moveTarget = ref(null)

const folders = computed(()=>[
  ...defaultFolders,
  ...userFolders.value.map(folder=>({
    ...folder,
    type:"user"
  }))
])

const filteredAssets = computed(()=>{
  if(selectedFolder.value === ""){
    return assets.value.filter(
      asset=>!asset.folderId
    )
  }

  return assets.value.filter(
    asset=>asset.folderId === selectedFolder.value
  )
})

function refresh(){
  assets.value = getAllAssets()
  userFolders.value = getUserFolders()
}

function close(){
  emit(
    "update:modelValue",
    false
  )
}

function selectAsset(asset){
  emit(
    "select",
    asset
  )
  close()
}

function renameAsset(asset){
  const name = prompt(
    "新しい名前",
    asset.name
  )

  if(!name) return

  if(renameUserAsset(asset.id,name)){
    refresh()
  }
}

function deleteAsset(asset){
  if(!confirm(`${asset.name}を削除しますか？`)){
    return
  }

  deleteUserAsset(asset.id)
  refresh()
}

function moveAsset(asset){
  moveTarget.value = asset
  folderSelectOpen.value = true
}

function completeMove(folderId){
  if(!moveTarget.value) return

  moveUserAsset(
    moveTarget.value.id,
    folderId
  )

  moveTarget.value = null
  folderSelectOpen.value = false

  refresh()
}

watch(
  ()=>props.modelValue,
  value=>{
    if(value){
      refresh()
    }
  }
)
</script>

<style scoped>
.asset-overlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.55);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:1000;
}
.asset-picker{
  width:min(900px,90vw);
  height:min(650px,85vh);
  background:white;
  display:flex;
  flex-direction:column;
  overflow:hidden;
}
.picker-header{
  height:60px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 20px;
  border-bottom:1px solid #ddd;
}
.picker-header h2{
  margin:0;
}
.close-button{
  border:none;
  background:none;
  font-size:28px;
  cursor:pointer;
}
.picker-body{
  flex:1;
  display:flex;
  overflow:hidden;
}
.folder-area{
  width:220px;
  border-right:1px solid #ddd;
}
.asset-area{
  flex:1;
  padding:20px;
  overflow-y:auto;
}
.asset-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(140px,1fr));
  gap:20px;
}
</style>