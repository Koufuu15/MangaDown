<script setup>
import "../assets/guide.css"

import { computed, ref } from "vue"
import { useRouter } from "vue-router"

import Renderer from "@/components/renderer/Renderer.vue"
import guideData from "@/data/guideData"

const router = useRouter()
const keyword = ref("")
const copiedId = ref("")
const sidebarOpen = ref(true)
const opened = ref(
  Object.fromEntries(guideData.map(item => [item.id, true]))
)

const guides = computed(() => {
  const key = keyword.value.trim().toLowerCase()

  if (!key) {
    return guideData
  }

  return guideData.filter(item => {
    const properties = item.properties
      ?.map(property => `${property.name} ${property.description}`)
      .join(" ") ?? ""
    const notes = item.notes?.join(" ") ?? ""
    const searchable = `${item.title} ${item.description} ${item.code ?? ""} ${properties} ${notes}`

    return searchable.toLowerCase().includes(key)
  })
})

const groupedGuides = computed(() => {
  const groups = []

  for (const item of guides.value) {
    let group = groups.find(candidate => candidate.name === item.group)

    if (!group) {
      group = { name: item.group, items: [] }
      groups.push(group)
    }

    group.items.push(item)
  }

  return groups
})

function toggle(id) {
  opened.value[id] = !opened.value[id]
}

async function copyCode(item) {
  try {
    await navigator.clipboard.writeText(item.code)
    copiedId.value = item.id
    window.setTimeout(() => {
      if (copiedId.value === item.id) copiedId.value = ""
    }, 1600)
  } catch {
    alert("コピーに失敗しました。")
  }
}

function jump(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  })
}
</script>

<template>
  <div class="guide-page">
    <header class="guide-header">
      <div class="guide-header-inner">
        <button class="secondary-button" type="button" @click="router.push('/')">
          <span aria-hidden="true">←</span>
          Home
        </button>

        <img
            src="../components/icons/MangaDown_logo.ico"
            class="md-home-logo"
            alt="MangaDown Logo"
        >
        <div class="guide-heading">
          <span class="eyebrow">MANGADOWN / REFERENCE</span>
          <h1>Writing Guide</h1>
          <p>独自Markdownで漫画を組み立てるためのリファレンス</p>
        </div>

        <div class="guide-header-stat">
          <strong>{{ guideData.length }}</strong>
          <span>chapters</span>
        </div>
      </div>
    </header>

    <div class="guide-layout">
      <aside class="guide-sidebar" :class="{ 'is-collapsed': !sidebarOpen }">
        <button
          class="sidebar-toggle"
          type="button"
          :aria-expanded="sidebarOpen"
          aria-controls="guide-navigation"
          @click="sidebarOpen = !sidebarOpen"
        >
          <span class="sidebar-intro">
            <span class="sidebar-label">CONTENTS</span>
            <strong>記法を探す</strong>
          </span>
          <span class="sidebar-toggle-icon" aria-hidden="true">{{ sidebarOpen ? "−" : "+" }}</span>
        </button>

        <div v-show="sidebarOpen" id="guide-navigation" class="sidebar-navigation">
          <label class="search-label" for="guide-search">キーワード</label>
          <div class="search-wrap">
            <span aria-hidden="true">⌕</span>
            <input
              id="guide-search"
              v-model="keyword"
              class="search-box"
              type="search"
              placeholder="panel, layer..."
            />
          </div>

          <nav class="guide-nav" aria-label="ガイドの目次">
            <div v-for="group in groupedGuides" :key="group.name" class="nav-group">
              <span class="nav-group-title">{{ group.name }}</span>
              <button
                v-for="item in group.items"
                :key="item.id"
                class="nav-item"
                type="button"
                @click="jump(item.id)"
              >
                <span>{{ item.title }}</span>
                <small>{{ item.level === "advanced" ? "ADV" : "BASIC" }}</small>
              </button>
            </div>
          </nav>

          <p v-if="!guides.length" class="empty-search">該当する章がありません。</p>
        </div>
      </aside>

      <main class="guide-content">
        <div class="content-intro">
          <span class="section-kicker">START HERE</span>
          <h2>漫画記法の全体像</h2>
          <p>
            まずブロックの囲み方を確認し、次に要素ごとの属性を見ていきます。
            例はそのままエディターへ貼り付けて試せます。
          </p>
          <div class="syntax-path" aria-label="記法の階層">
            <span>manga</span><b>→</b><span>panel</span><b>→</b><span>bubble / image</span><b>→</b><span>text / tail</span>
          </div>
        </div>

        <div v-for="group in groupedGuides" :key="group.name" class="content-group">
          <div class="content-group-heading">
            <span>{{ group.name }}</span>
            <i aria-hidden="true"></i>
          </div>

          <article
            v-for="item in group.items"
            :id="item.id"
            :key="item.id"
            class="guide-section"
            :class="`level-${item.level}`"
          >
            <button
              class="section-header"
              type="button"
              :aria-expanded="opened[item.id]"
              @click="toggle(item.id)"
            >
              <span class="section-index">{{ String(guideData.indexOf(item) + 1).padStart(2, "0") }}</span>
              <span class="section-title-wrap">
                <span class="section-level">{{ item.level === "advanced" ? "ADVANCED" : "BASIC" }}</span>
                <strong>{{ item.title }}</strong>
              </span>
              <span class="section-toggle" aria-hidden="true">{{ opened[item.id] ? "−" : "+" }}</span>
            </button>

            <div v-if="opened[item.id]" class="section-body">
              <p class="section-description">{{ item.description }}</p>

              <div v-if="item.code" class="example">
                <section class="example-code">
                  <div class="example-title">
                    <span><i class="code-dot" aria-hidden="true"></i> Syntax</span>
                    <button class="copy-button" type="button" @click.stop="copyCode(item)">
                      {{ copiedId === item.id ? "Copied" : "Copy code" }}
                    </button>
                  </div>
                  <pre><code>{{ item.code }}</code></pre>
                </section>

                <section class="example-preview">
                  <div class="example-title"><span><i class="preview-dot" aria-hidden="true"></i> Preview</span></div>
                  <div class="preview-box">
                    <Renderer :content="item.code" />
                  </div>
                </section>
              </div>

              <div v-if="item.properties" class="reference-block">
                <div class="block-heading">
                  <span>属性リファレンス</span>
                  <small>{{ item.properties.length }} properties</small>
                </div>
                <div class="property-table-wrap">
                  <table class="property-table">
                    <thead>
                      <tr><th>属性</th><th>型</th><th>説明</th><th>既定値</th></tr>
                    </thead>
                    <tbody>
                      <tr v-for="property in item.properties" :key="property.name">
                        <td><code>{{ property.name }}</code></td>
                        <td><span class="type-chip">{{ property.type }}</span></td>
                        <td>{{ property.description }}</td>
                        <td class="default-value">{{ property.default }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div v-if="item.notes" class="notes-block">
                <div class="block-heading"><span>注意</span></div>
                <ul>
                  <li v-for="note in item.notes" :key="note">{{ note }}</li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  </div>
</template>