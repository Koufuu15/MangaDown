<template>
  <div class="folder-overlay" @click.self="close">
    <div class="folder-modal">
      <header class="modal-header">
        <h3>移動先を選択</h3>
        <button class="close-button" @click="close">×</button>
      </header>

      <div class="folder-list">
        <button
          v-for="folder in folders"
          :key="folder.id"
          class="folder-item"
          @click="select(folder.id)"
        >
          <span>{{ folder.icon ?? "📁" }}</span>
          <span>{{ folder.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import defaultFolders from "@/data/defaultFolders"
import { getUserFolders } from "@/utils/userFolders"

const emit = defineEmits([
  "select",
  "close"
])

const folders = computed(() => [
  ...defaultFolders,
  ...getUserFolders().map(folder => ({
    ...folder,
    type:"user"
  }))
])

function select(folderId){
  emit(
    "select",
    folderId
  )
}

function close(){
  emit(
    "close"
  )
}
</script>

<style scoped>
.folder-overlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.45);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:1200;
}
.folder-modal{
  width:min(360px,90vw);
  background:white;
  padding:20px;
}
.modal-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:16px;
}
.modal-header h3{
  margin:0;
}
.close-button{
  border:none;
  background:none;
  font-size:24px;
  cursor:pointer;
}
.folder-list{
  display:flex;
  flex-direction:column;
  gap:8px;
}
.folder-item{
  display:flex;
  align-items:center;
  gap:10px;
  width:100%;
  padding:12px;
  border:1px solid #ddd;
  background:white;
  cursor:pointer;
  text-align:left;
}
.folder-item:hover{
  background:#f5f5f5;
}
</style>