<script setup>
import "../assets/writeMD.css"
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { EditorView, basicSetup } from "codemirror"
import { markdown } from "@codemirror/lang-markdown"
import { keymap } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"
import Renderer from "@/components/renderer/Renderer.vue"
import AssetPicker from "@/components/library/AssetPicker.vue"
import UploadDialog from "@/components/UploadDialog.vue"
import { validateImageName } from "@/utils/imageValidator"
import { saveUserAsset } from "@/utils/userAssets"
import { getAllAssets } from "@/utils/assetResolver"

const router = useRouter()
const editor = ref()
const editorView = ref(null)
const fileInput = ref(null)
const pickerOpen = ref(false)
const uploadOpen = ref(false)
const selectedFile = ref(null)
const assets = ref([])
const content = ref(localStorage.getItem("content") ?? "")

function openImagePicker(){fileInput.value?.click()}
function openAssetPicker(){assets.value=getAllAssets();pickerOpen.value=true}
function closeAssetPicker(){pickerOpen.value=false}
function closeUploadDialog(){uploadOpen.value=false;selectedFile.value=null}

function onImageSelected(event){
  const file=event.target.files?.[0]
  if(!file)return
  selectedFile.value=file
  uploadOpen.value=true
  event.target.value=""
}

function saveImage(data){
  if(!selectedFile.value)return
  const result=validateImageName(data.name)
  if(!result.valid){alert(result.message);return}
  const reader=new FileReader()
  reader.onload=()=>{
    saveUserAsset({name:data.name,src:reader.result,folderId:data.folderId,tags:data.tags,createdAt:Date.now()})
    insertImageMarkdown(data.name)
    closeUploadDialog()
  }
  reader.readAsDataURL(selectedFile.value)
}

function selectAsset(asset){insertImageMarkdown(asset.name)}

function insertImageMarkdown(name){
  if(!editorView.value)return
  const insertText=`### image
- name: ${name}
- layer: 1
- position: { x: 50, y: 50 }
- size: { w: 300, h: 300 }

`
  const selection=editorView.value.state.selection.main
  editorView.value.dispatch({changes:{from:selection.from,to:selection.to,insert:insertText}})
  pickerOpen.value=false
}

onMounted(()=>{
  editorView.value=new EditorView({
    doc:content.value,
    extensions:[
      basicSetup,
      markdown(),
      EditorView.lineWrapping,
      keymap.of([indentWithTab]),
      EditorView.updateListener.of(update=>{
        if(!update.docChanged)return
        content.value=update.state.doc.toString()
        localStorage.setItem("content",content.value)
      })
    ],
    parent:editor.value
  })
})
</script>

<template>
<div class="write-md-page">
  <header class="write-md-header">
    <div class="write-md-header-left">
      <h1>Manga Editor</h1>
      <p>Write Markdown and preview your manga.</p>
    </div>
  </header>

  <main class="write-md-workspace">
    <section class="write-md-editor-panel">
      <div class="write-md-panel-title">
        <span>Markdown</span>
        <div class="write-md-editor-toolbar">
          <button class="write-md-toolbar-button" @click="openImagePicker">🖼 Upload</button>
          <button class="write-md-toolbar-button" @click="openAssetPicker">📁 Assets</button>
          <input ref="fileInput" type="file" accept="image/*" hidden @change="onImageSelected" />
        </div>
      </div>
      <div ref="editor" class="write-md-editor" />
    </section>

    <section class="write-md-preview-panel">
      <div class="write-md-panel-title">
        <span>Preview</span>
      </div>
      <div class="write-md-preview">
        <Renderer :content="content" />
      </div>
    </section>
  </main>

  <footer class="write-md-button-panel">
    <button class="write-md-secondary-button" @click="router.push('/')">← Home</button>
    <button class="write-md-primary-button" @click="router.push('/save')">Publish →</button>
  </footer>

  <AssetPicker v-model="pickerOpen" :assets="assets" @select="selectAsset" />
  <UploadDialog :open="uploadOpen" @close="closeUploadDialog" @save="saveImage" />
</div>
</template>