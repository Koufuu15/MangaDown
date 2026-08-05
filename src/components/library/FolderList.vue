<template>
  <nav class="folder-list">
    <button
      v-for="folder in folders"
      :key="folder.id"
      :class="{active: modelValue === folder.id}"
      @click="select(folder.id)"
    >
      {{ folder.name }}
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

const emit = defineEmits(["update:modelValue"])

function select(id){
  emit("update:modelValue", id)
}
</script>

<style scoped>
.folder-list{
  display:flex;
  flex-direction:column;
  gap:6px;
  padding:12px;
}
.folder-list button{
  border:none;
  background:none;
  text-align:left;
  padding:10px 12px;
  cursor:pointer;
  font-size:14px;
}
.folder-list button:hover{
  background:#f2f2f2;
}
.folder-list button.active{
  background:#e8e8e8;
  font-weight:bold;
}
</style>