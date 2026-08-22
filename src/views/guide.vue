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
    const properties =
      item.properties
        ?.map(property => `${property.name} ${property.description}`)
        .join(" ") ?? ""

    const notes = item.notes?.join(" ") ?? ""

    const searchable = [
      item.title,
      item.description,
      item.code,
      properties,
      notes
    ]
      .filter(Boolean)
      .join(" ")

    return searchable.toLowerCase().includes(key)
  })
})

function toggle(id) {
  opened.value[id] = !opened.value[id]
}

async function copyCode(item) {
  try {
    await navigator.clipboard.writeText(item.code)

    copiedId.value = item.id

    window.setTimeout(() => {
      if (copiedId.value === item.id) {
        copiedId.value = ""
      }
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
        <button
          class="secondary-button"
          type="button"
          @click="router.push('/')"
        >
          <span aria-hidden="true">←</span>
          Home
        </button>

        <div class="guide-heading">
          <div class="guide-heading-title">
            <img
              src="../components/icons/MangaDown_logo.ico"
              class="md-guide-logo"
              alt="MangaDown Logo"
            >

            <div>
              <span class="eyebrow">MANGADOWN / REFERENCE</span>
              <h1>Writing Guide</h1>
            </div>
          </div>

          <p>独自Markdownで漫画を組み立てるためのリファレンス</p>
        </div>
      </div>
    </header>

    <div class="guide-layout">
      <!-- Sidebar -->
      <aside
        class="guide-sidebar"
        :class="{ 'is-collapsed': !sidebarOpen }"
      >
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

          <span
            class="sidebar-toggle-icon"
            aria-hidden="true"
          >
            {{ sidebarOpen ? "−" : "+" }}
          </span>
        </button>

        <div
          v-show="sidebarOpen"
          id="guide-navigation"
          class="sidebar-navigation"
        >
          <label
            class="search-label"
            for="guide-search"
          >
            キーワード
          </label>

          <div class="search-wrap">
            <span aria-hidden="true">⌕</span>

            <input
              id="guide-search"
              v-model="keyword"
              class="search-box"
              type="search"
              placeholder="panel, bubble..."
            >
          </div>

          <nav
            class="guide-nav"
            aria-label="ガイドの目次"
          >
            <button
              v-for="(item, index) in guides"
              :key="item.id"
              class="nav-item"
              type="button"
              @click="jump(item.id)"
            >
              <span>
                {{ String(index + 1).padStart(2, "0") }}
                {{ item.title }}
              </span>
            </button>
          </nav>

          <p
            v-if="!guides.length"
            class="empty-search"
          >
            該当する記法がありません。
          </p>
        </div>
      </aside>

      <!-- Content -->
      <main class="guide-content">
        <div class="content-intro">
          <span class="section-kicker">START HERE</span>

          <h2>漫画記法の全体像</h2>

          <p>
            MangaDownでは、通常のMarkdownに加えて独自の記法を使用して
            漫画を組み立てることができます。
            下のサンプルはそのままエディターへ貼り付けて試せます。
          </p>
        </div>

        <div class="guide-list">
          <article
            v-for="(item, index) in guides"
            :id="item.id"
            :key="item.id"
            class="guide-section"
          >
            <!-- Section Header -->
            <button
              class="section-header"
              type="button"
              :aria-expanded="opened[item.id]"
              @click="toggle(item.id)"
            >
              <span class="section-index">
                {{ String(index + 1).padStart(2, "0") }}
              </span>

              <span class="section-title-wrap">
                <strong>{{ item.title }}</strong>
              </span>

              <span
                class="section-toggle"
                aria-hidden="true"
              >
                {{ opened[item.id] ? "−" : "+" }}
              </span>
            </button>

            <!-- Section Body -->
            <div
              v-if="opened[item.id]"
              class="section-body"
            >
              <p class="section-description">
                {{ item.description }}
              </p>

              <!-- Example -->
              <div
                v-if="item.code"
                class="example"
              >
                <!-- Code -->
                <section class="example-code">
                  <div class="example-title">
                    <span>
                      <i
                        class="code-dot"
                        aria-hidden="true"
                      ></i>
                      Markdown
                    </span>

                    <button
                      class="copy-button"
                      type="button"
                      @click.stop="copyCode(item)"
                    >
                      {{ copiedId === item.id ? "Copied" : "Copy code" }}
                    </button>
                  </div>

                  <pre><code>{{ item.code }}</code></pre>
                </section>

                <!-- Preview -->
                <section class="example-preview">
                  <div class="example-title">
                    <span>
                      <i
                        class="preview-dot"
                        aria-hidden="true"
                      ></i>
                      Preview
                    </span>
                  </div>

                  <div class="preview-box">
                    <Renderer
                      :content="item.code"
                    />
                  </div>
                </section>
              </div>

              <!-- Properties -->
              <div
                v-if="item.properties?.length"
                class="reference-block"
              >
                <div class="block-heading">
                  <span>属性リファレンス</span>
                  <small>
                    {{ item.properties.length }} properties
                  </small>
                </div>

                <div class="property-table-wrap">
                  <table class="property-table">
                    <thead>
                      <tr>
                        <th>属性</th>
                        <th>型</th>
                        <th>説明</th>
                        <th>既定値</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr
                        v-for="property in item.properties"
                        :key="property.name"
                      >
                        <td>
                          <code>{{ property.name }}</code>
                        </td>

                        <td>
                          <span class="type-chip">
                            {{ property.type }}
                          </span>
                        </td>

                        <td>
                          {{ property.description }}
                        </td>

                        <td class="default-value">
                          {{ property.default }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Notes -->
              <div
                v-if="item.notes?.length"
                class="notes-block"
              >
                <div class="block-heading">
                  <span>注意</span>
                </div>

                <ul>
                  <li
                    v-for="note in item.notes"
                    :key="note"
                  >
                    {{ note }}
                  </li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  </div>
</template>