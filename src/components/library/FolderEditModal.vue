<template>
  <div class="folder-overlay" @click.self="close">
    <div class="folder-modal">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-button" @click="close">×</button>
      </header>

      <template v-if="mode !== 'delete'">
        <input
          v-model="name"
          class="name-input"
          placeholder="フォルダ名"
        />

        <div class="modal-actions">
          <button @click="close">
            キャンセル
          </button>
          <button @click="submit">
            {{ mode === "create" ? "作成" : "変更" }}
          </button>
        </div>
      </template>

      <template v-else>
        <p>
          「{{ folder.name }}」を削除しますか？
        </p>

        <label>
          <input
            v-model="deleteMode"
            type="radio"
            value="move"
          />
          画像を未分類へ移動
        </label>

        <label>
          <input
            v-model="deleteMode"
            type="radio"
            value="delete"
          />
          画像も削除
        </label>

        <div class="modal-actions">
          <button @click="close">
            キャンセル
          </button>

          <button @click="submit">
            削除
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"

const props = defineProps({
  mode:{
    type:String,
    required:true
  },
  folder:{
    type:Object,
    default:null
  }
})

const emit = defineEmits([
  "submit",
  "close"
])

const name = ref(
  props.folder?.name ?? ""
)

const deleteMode = ref("move")

const title = computed(()=>{
  if(props.mode === "create"){
    return "フォルダ作成"
  }

  if(props.mode === "rename"){
    return "フォルダ名変更"
  }

  return "フォルダ削除"
})

function submit(){

  if(props.mode === "delete"){
    emit(
      "submit",
      {
        mode:"delete",
        deleteMode:deleteMode.value,
        folder:props.folder
      }
    )

    return
  }

  if(!name.value.trim()){
    return
  }

  emit(
    "submit",
    {
      mode:props.mode,
      name:name.value.trim(),
      folder:props.folder
    }
  )
}

function close(){
  emit("close")
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
  z-index:1300;
}
.folder-modal{
  width:min(400px,90vw);
  background:white;
  padding:20px;
}
.modal-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:20px;
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
.name-input{
  width:100%;
  padding:10px;
  box-sizing:border-box;
  border:1px solid #ccc;
}
label{
  display:block;
  margin:12px 0;
}
.modal-actions{
  display:flex;
  justify-content:flex-end;
  gap:10px;
  margin-top:20px;
}
.modal-actions button{
  padding:8px 16px;
  cursor:pointer;
  border:1px solid #ccc;
  background:white;
}
</style>