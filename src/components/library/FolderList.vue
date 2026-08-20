<template>
  <nav class="folder-list">

    <button
      v-for="folder in folders"
      :key="folder.id"
      class="folder-button"
      :class="{active:modelValue === folder.id}"
      @click="select(folder.id)"
    >
      <span>
        {{ folder.icon ?? "📁" }}
      </span>

      <span>
        {{ folder.name }}
      </span>
    </button>


    <button
      class="manage-button"
      @click="manage"
    >
      ⚙ フォルダ管理
    </button>

  </nav>
</template>

<script setup>
const props = defineProps({
  folders:{
    type:Array,
    default:()=>[]
  },
  modelValue:{
    type:String,
    default:""
  }
})

const emit = defineEmits([
  "update:modelValue",
  "manage"
])


function select(id){
  emit(
    "update:modelValue",
    id
  )
}


function manage(){
  emit(
    "manage"
  )
}
</script>

<style scoped>
.folder-list{
  display:flex;
  flex-direction:column;
  gap:6px;
  padding:12px;
}
.folder-button{
  display:flex;
  align-items:center;
  gap:8px;
  width:100%;
  padding:10px 12px;
  border:none;
  background:none;
  cursor:pointer;
  text-align:left;
  font-size:14px;
}
.folder-button:hover{
  background:#f2f2f2;
}
.folder-button.active{
  background:#e8e8e8;
  font-weight:bold;
}
.manage-button{
  margin-top:auto;
  padding:10px 12px;
  border:none;
  background:none;
  border-top:1px solid #ddd;
  cursor:pointer;
  text-align:left;
}
.manage-button:hover{
  background:#f2f2f2;
}
</style>