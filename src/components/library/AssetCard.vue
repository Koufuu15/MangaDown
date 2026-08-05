<template>
  <div class="asset-card" @click="select">
    <img :src="asset.src" :alt="asset.name" />

    <p>{{ asset.name }}</p>

    <button
      v-if="asset.type === 'user'"
      class="menu-button"
      @click.stop="menuOpen = !menuOpen"
    >
      ⋮
    </button>

    <div
      v-if="menuOpen"
      class="menu"
      @click.stop
    >
      <button @click="rename">
        名前変更
      </button>

      <button @click="remove">
        削除
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const props = defineProps({
  asset:{
    type:Object,
    required:true
  }
})

const emit = defineEmits([
  "select",
  "rename",
  "delete"
])

const menuOpen = ref(false)

function select(){
  emit(
    "select",
    props.asset
  )
}

function rename(){
  menuOpen.value = false

  emit(
    "rename",
    props.asset
  )
}

function remove(){
  menuOpen.value = false

  emit(
    "delete",
    props.asset
  )
}
</script>

<style scoped>
.asset-card{
  position:relative;
  cursor:pointer;
  border:1px solid #ddd;
  overflow:hidden;
  background:white;
  transition:.15s;
}
.asset-card:hover{
  transform:translateY(-3px);
  border-color:#888;
}
.asset-card img{
  width:100%;
  aspect-ratio:1;
  object-fit:contain;
  display:block;
  background:#f5f5f5;
}
.asset-card p{
  margin:8px;
  text-align:center;
  font-size:14px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.menu-button{
  position:absolute;
  top:6px;
  right:6px;
  width:28px;
  height:28px;
  border:none;
  background:white;
  border-radius:50%;
  cursor:pointer;
  font-size:18px;
  box-shadow:0 1px 4px rgba(0,0,0,.2);
}
.menu{
  position:absolute;
  top:38px;
  right:6px;
  display:flex;
  flex-direction:column;
  background:white;
  border:1px solid #ddd;
  box-shadow:0 2px 8px rgba(0,0,0,.15);
  z-index:10;
}
.menu button{
  border:none;
  background:white;
  padding:8px 14px;
  cursor:pointer;
  white-space:nowrap;
}
.menu button:hover{
  background:#f2f2f2;
}
</style>