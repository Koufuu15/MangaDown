<template>
  <div class="folder-overlay" @click.self="close">
    <div class="folder-manager">
      <header class="manager-header">
        <h3>フォルダ管理</h3>
        <button class="close-button" @click="close">×</button>
      </header>
      <div class="folder-list">
        <div v-for="folder in folders" :key="folder.id" class="folder-item">
          <div class="folder-info">
            <span>{{ folder.icon }}</span>
            <span>{{ folder.name }}</span>
          </div>
          <div class="folder-actions">
            <button @click="rename(folder)">✏</button>
            <button @click="remove(folder)">🗑</button>
          </div>
        </div>
      </div>
      <button class="add-button" @click="create">＋ フォルダ追加</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { getUserFolders, addUserFolder, renameUserFolder, deleteUserFolder } from "@/utils/userFolders"

const emit = defineEmits(["update","close"])
const folders = ref([])

function refresh(){
  folders.value = getUserFolders()
  emit("update")
}

function create(){
  const name = prompt("フォルダ名を入力してください")
  if(!name) return
  if(addUserFolder(name)) refresh()
}

function rename(folder){
  const name = prompt("新しいフォルダ名", folder.name)
  if(!name) return
  if(renameUserFolder(folder.id,name)) refresh()
}

function remove(folder){
  if(!confirm(`「${folder.name}」を削除しますか？`)) return
  deleteUserFolder(folder.id)
  refresh()
}

function close(){
  emit("close")
}

onMounted(refresh)
</script>

<style scoped>
.folder-overlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.45);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:1100;
}
.folder-manager{
  width:min(400px,90vw);
  background:white;
  padding:20px;
}
.manager-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:16px;
}
.manager-header h3{
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
  justify-content:space-between;
  align-items:center;
  padding:10px;
  border:1px solid #ddd;
}
.folder-info{
  display:flex;
  gap:8px;
}
.folder-actions{
  display:flex;
  gap:6px;
}
.folder-actions button{
  border:none;
  background:none;
  cursor:pointer;
}
.add-button{
  width:100%;
  margin-top:16px;
  padding:10px;
  border:1px dashed #aaa;
  background:white;
  cursor:pointer;
}
</style>