<template>
  <div v-if="modelValue" class="asset-modal-overlay" @click.self="close">
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
          />
        </aside>

        <main class="asset-area">
          <div class="asset-grid">
            <AssetCard
              v-for="asset in filteredAssets"
              :key="asset.id"
              :asset="asset"
              @select="selectAsset"
            />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue"

import AssetCard from "./AssetCard.vue"
import FolderList from "./FolderList.vue"

const props = defineProps({
  modelValue:{
    type:Boolean,
    default:false
  },
  assets:{
    type:Array,
    default:()=>[]
  }
})

const emit = defineEmits([
  "update:modelValue",
  "select"
])

const folders = computed(() => {
  const ids = [
    ...new Set(
      props.assets.map(
        asset => asset.folderId
      )
    )
  ]

  return ids.map(id => ({
    id,
    name:id
  }))
})

const selectedFolder = ref("")

const filteredAssets = computed(() => {
  if (!selectedFolder.value) {
    return props.assets
  }

  return props.assets.filter(
    asset =>
      asset.folderId === selectedFolder.value
  )
})

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
</script>

<style scoped>
.asset-modal-overlay{
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
  font-size:20px;
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
  overflow-y:auto;
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