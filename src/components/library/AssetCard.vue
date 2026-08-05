<template>
  <div class="asset-card" @click="select">
    <img :src="asset.src" :alt="asset.name" />
    <p>{{ asset.name }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  asset:{
    type:Object,
    required:true
  }
})

const emit = defineEmits(["select"])

function select(){
  emit("select", props.asset)
}
</script>

<style scoped>
.asset-card{
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
}
</style>