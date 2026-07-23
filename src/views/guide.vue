<script setup>
import "../assets/guide.css"

import { ref, computed } from "vue"
import { useRouter } from "vue-router"

import Renderer from "@/components/renderer/Renderer.vue"
import guideData from "@/data/guideData"

const router = useRouter()

// 検索キーワード
const keyword = ref("")

// 開いているセクション
const opened = ref(
    Object.fromEntries(
        guideData.map(item => [item.id, true])
    )
)

// 検索
const guides = computed(() => {

    if (!keyword.value.trim()) {
        return guideData
    }

    const key = keyword.value.toLowerCase()

    return guideData.filter(item => {

        return (
            item.title.toLowerCase().includes(key) ||
            item.description.toLowerCase().includes(key) ||
            item.code.toLowerCase().includes(key)
        )

    })

})

// 折りたたみ
function toggle(id) {
    opened.value[id] = !opened.value[id]
}

// コピー
async function copyCode(code) {

    try {

        await navigator.clipboard.writeText(code)

        alert("Copied!")

    } catch {

        alert("コピーに失敗しました。")

    }

}

// サイドバークリック
function jump(id) {

    document
        .getElementById(id)
        ?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        })

}
</script>

<template>

<div class="guide-page">

    <header class="guide-header">

        <div>

            <h1>Writing Guide</h1>

            <p>
                Manga Markdown Reference
            </p>

        </div>

        <button
            class="secondary-button"
            @click="router.push('/')"
        >
            ← Home
        </button>

    </header>

    <div class="guide-body">

        <aside class="guide-sidebar">

            <input
                v-model="keyword"
                class="search-box"
                placeholder="Search..."
            />

            <button
                v-for="item in guides"
                :key="item.id"
                class="nav-item"
                @click="jump(item.id)"
            >
                {{ item.title }}
            </button>

        </aside>

        <main class="guide-content">
          <div
    v-for="item in guides"
    :key="item.id"
    :id="item.id"
    class="guide-section"
>

    <div
        class="section-header"
        @click="toggle(item.id)"
    >

        <h2>
            {{ opened[item.id] ? "▼" : "▶" }}
            {{ item.title }}
        </h2>

    </div>

    <div
        v-if="opened[item.id]"
        class="section-body"
    >

        <p class="section-description">
            {{ item.description }}
        </p>

        <div class="example">

            <!-- Code -->

            <section class="example-code">

                <div class="example-title">

                    <span>Code</span>

                    <button
                        class="copy-button"
                        @click="copyCode(item.code)"
                    >
                        Copy
                    </button>

                </div>

                <pre>
<code>{{ item.code }}</code>
                </pre>

            </section>

            <!-- Preview -->

            <section class="example-preview">

                <div class="example-title">

                    Preview

                </div>

                <div class="preview-box">

                    <Renderer
                        :content="item.code"
                    />

                </div>

            </section>

        </div>

        <!-- Property Table -->

        <table
            v-if="item.properties"
            class="property-table"
        >

            <thead>

                <tr>

                    <th>Name</th>

                    <th>Type</th>

                    <th>Description</th>

                </tr>

            </thead>

            <tbody>

                <tr
                    v-for="property in item.properties"
                    :key="property.name"
                >

                    <td>{{ property.name }}</td>

                    <td>{{ property.type }}</td>

                    <td>{{ property.description }}</td>

                </tr>

            </tbody>

        </table>

    </div>

</div>

        </main>

    </div>

</div>

</template>