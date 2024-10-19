<template>
  <div class="flex flex-col py-4">
    <div class="flex justify-end">
      <button
        @click="updatePreview"
        class="mx-4 bg-slate-800 text-white p-2 rounded w-12"
      >
        Run
      </button>
    </div>

    <div class="flex space-x-4 px-4">
      <div class="editor flex-1 flex flex-col">
        <label>HTML</label>
        <div ref="htmlEditor" class="h-36 border p-2 rounded"></div>
      </div>
      <div class="editor flex-1 flex flex-col">
        <label>CSS</label>
        <div ref="cssEditor" class="h-36 border p-2 rounded"></div>
      </div>
      <div class="editor flex-1 flex flex-col">
        <label>JavaScript</label>
        <div ref="jsEditor" class="h-36 border p-2 rounded"></div>
      </div>
    </div>

    <div class="flex space-x-4 px-4">
      <iframe
        ref="outputFrame"
        class="output-frame basis-9/12 w-full h-96 mt-4 border border-gray-300 rounded"
      ></iframe>
      <div
        class="console-output mt-4 p-2 bg-slate-800 text-white basis-3/12 rounded"
      >
        <p>Console:</p>
        <div v-for="(log, index) in consoleLogs" :key="index">{{ log }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ace from 'ace-builds'
import viewerTemplate from '@/templates/viewer'

ace.config.set('basePath', '/node_modules/ace-builds/src-noconflict')

const htmlEditor = ref<HTMLDivElement | null>(null)
const cssEditor = ref<HTMLDivElement | null>(null)
const jsEditor = ref<HTMLDivElement | null>(null)
const outputFrame = ref<HTMLIFrameElement | null>(null)
const consoleLogs = ref<string[]>([])

let htmlAceEditor: ace.Ace.Editor,
  cssAceEditor: ace.Ace.Editor,
  jsAceEditor: ace.Ace.Editor

const messageListener = (event: MessageEvent) => {
  console.log(event)

  if (['error', 'log'].includes(event.data.type)) {
    consoleLogs.value.push(event.data.message)
  }
}

onMounted(() => {
  if (htmlEditor.value) {
    const htmlCode = localStorage.getItem('htmlCode') || '<h1>Hello World</h1>'

    htmlAceEditor = ace.edit(htmlEditor.value)
    htmlAceEditor.session.setMode('ace/mode/html')
    htmlAceEditor.setValue(htmlCode, 1)
  }

  if (cssEditor.value) {
    const cssCode = localStorage.getItem('cssCode') || 'h1 { color: tomato; }'

    cssAceEditor = ace.edit(cssEditor.value)
    cssAceEditor.session.setMode('ace/mode/css')
    cssAceEditor.setValue(cssCode, 1)
  }

  if (jsEditor.value) {
    const jsCode =
      localStorage.getItem('jsCode') || 'console.log("Hello from JavaScript");'

    jsAceEditor = ace.edit(jsEditor.value)
    jsAceEditor.session.setMode('ace/mode/javascript')
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
  background-color: white;
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
