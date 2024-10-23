<template>
  <div class="flex flex-col py-4">
    <div class="flex justify-end">
      <MagicButton @click="updatePreview"> Run </MagicButton>
    </div>

    <div class="flex space-x-4 px-4">
      <div class="editor flex-1 flex flex-col">
        <label class="font-bold text-zinc-300">HTML</label>
        <div
          ref="htmlEditor"
          class="h-36 border border-zinc-300 p-2 rounded"
        ></div>
      </div>
      <div class="editor flex-1 flex flex-col">
        <label class="font-bold text-zinc-300">CSS</label>
        <div
          ref="cssEditor"
          class="h-36 border border-zinc-300 p-2 rounded"
        ></div>
      </div>
      <div class="editor flex-1 flex flex-col">
        <label class="font-bold text-zinc-300">JavaScript</label>
        <div
          ref="jsEditor"
          class="h-36 border border-zinc-300 p-2 rounded"
        ></div>
      </div>
    </div>

    <div class="flex space-x-4 px-4">
      <iframe
        ref="outputFrame"
        class="output-frame basis-9/12 w-full h-96 mt-4 border border-zinc-300 rounded"
      ></iframe>
      <div
        class="console-output mt-4 p-2 text-white basis-3/12 border border-zinc-300 rounded ace-github-dark"
      >
        <p class="font-bold text-zinc-300">Console output:</p>
        <div v-for="(log, index) in consoleLogs" :key="index">{{ log }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ace from 'ace-builds'
import {
  viewerTemplate,
  htmlTemplate,
  cssTemplate,
  jsTemplate,
} from '@/templates'
import MagicButton from './MagicButton.vue'

ace.config.set('basePath', 'ace')

const htmlEditor = ref<HTMLDivElement | null>(null)
const cssEditor = ref<HTMLDivElement | null>(null)
const jsEditor = ref<HTMLDivElement | null>(null)
const outputFrame = ref<HTMLIFrameElement | null>(null)
const consoleLogs = ref<string[]>([])

let htmlAceEditor: ace.Ace.Editor,
  cssAceEditor: ace.Ace.Editor,
  jsAceEditor: ace.Ace.Editor

const messageListener = (event: MessageEvent) => {
  if (['error', 'log'].includes(event.data.type)) {
    consoleLogs.value.push(event.data.message)
  }
}

onMounted(() => {
  if (htmlEditor.value) {
    const htmlCode = localStorage.getItem('htmlCode') || htmlTemplate

    htmlAceEditor = ace.edit(htmlEditor.value)
    htmlAceEditor.session.setMode('ace/mode/html')
    htmlAceEditor.setTheme('ace/theme/github_dark')
    htmlAceEditor.setValue(htmlCode, 1)
  }

  if (cssEditor.value) {
    const cssCode = localStorage.getItem('cssCode') || cssTemplate

    cssAceEditor = ace.edit(cssEditor.value)
    cssAceEditor.session.setMode('ace/mode/css')
    cssAceEditor.setTheme('ace/theme/github_dark')
    cssAceEditor.setValue(cssCode, 1)
  }

  if (jsEditor.value) {
    const jsCode = localStorage.getItem('jsCode') || jsTemplate

    jsAceEditor = ace.edit(jsEditor.value)
    jsAceEditor.session.setMode('ace/mode/javascript')
    jsAceEditor.setTheme('ace/theme/github_dark')
    jsAceEditor.setValue(jsCode, 1)
  }

  window.addEventListener('message', messageListener)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', messageListener)
})

const updatePreview = () => {
  consoleLogs.value = []

  const htmlCode = htmlAceEditor.getValue()
  localStorage.setItem('htmlCode', htmlCode)

  const cssCode = cssAceEditor.getValue()
  localStorage.setItem('cssCode', cssCode)

  const jsCode = jsAceEditor.getValue()
  localStorage.setItem('jsCode', jsCode)

  if (outputFrame.value) {
    outputFrame.value.srcdoc = viewerTemplate(htmlCode, cssCode, jsCode)
  }
}
</script>

<style scoped>
.output-frame {
  background-color: #e5e5e5b3;
}

.console-output {
  width: 400px;
  white-space: pre-wrap;
  font-family: monospace;
}

.ace_editor {
  width: 100%;
  height: 100%;
}

.editor {
  min-height: 430px;
}
</style>
