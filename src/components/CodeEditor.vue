<template>
  <div ref="wrapper" class="flex flex-col h-screen">
    <div class="flex justify-end flex-shrink-0 mt-4">
      <MagicButton @click="updatePreview"> Run </MagicButton>
    </div>

    <div
      ref="editorsContainer"
      class="editors flex space-x-0 px-4 flex-shrink-0"
      :style="{
        height: `${editorsHeight}px`,
        minHeight: `${MIN_EDITORS_HEIGHT}px`,
      }"
    >
      <div
        class="editor flex flex-col"
        :style="{ width: `${htmlWidth}px`, minWidth: `${MIN_EDITOR_WIDTH}px` }"
      >
        <label class="font-bold text-zinc-300">HTML</label>
        <div
          ref="htmlEditor"
          class="h-36 border border-zinc-300 p-2 rounded"
        ></div>
      </div>

      <div
        class="resizable-divider vertical px-2"
        @mousedown="startResize('html')"
      >
        <div class="resizable-divider gap"></div>
      </div>

      <div
        class="editor flex flex-col"
        :style="{ width: `${cssWidth}px`, minWidth: `${MIN_EDITOR_WIDTH}px` }"
      >
        <label class="font-bold text-zinc-300">CSS</label>
        <div
          ref="cssEditor"
          class="h-36 border border-zinc-300 p-2 rounded"
        ></div>
      </div>

      <div
        class="resizable-divider vertical px-2"
        @mousedown="startResize('css')"
      >
        <div class="resizable-divider gap"></div>
      </div>

      <div
        class="editor flex flex-col"
        :style="{ width: `${jsWidth}px`, minWidth: `${MIN_EDITOR_WIDTH}px` }"
      >
        <label class="font-bold text-zinc-300">JavaScript</label>
        <div
          ref="jsEditor"
          class="h-36 border border-zinc-300 p-2 rounded"
        ></div>
      </div>
    </div>

    <div
      class="resizable-divider horizontal py-2 px-4"
      @mousedown="startHorizontalResize"
    >
      <div class="resizable-divider gap"></div>
    </div>

    <div
      class="view flex space-x-4 mb-4 px-4 flex-1"
      :style="{
        minHeight: `${MIN_EDITORS_HEIGHT}px`,
      }"
    >
      <iframe
        ref="outputFrame"
        class="output-frame basis-9/12 w-full h-full border border-zinc-300 rounded"
      ></iframe>
      <div
        class="console-output p-2 text-white basis-3/12 h-full border border-zinc-300 rounded ace-github-dark"
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

const MIN_EDITOR_WIDTH = 200
const MIN_EDITORS_HEIGHT = 200
const MIN_VIEWER_HEIGHT = 300
const DEFAULT_EDITORS_HEIGHT = 400

const wrapper = ref<HTMLDivElement | null>(null)
const htmlEditor = ref<HTMLDivElement | null>(null)
const cssEditor = ref<HTMLDivElement | null>(null)
const jsEditor = ref<HTMLDivElement | null>(null)
const outputFrame = ref<HTMLIFrameElement | null>(null)
const consoleLogs = ref<string[]>([])
const editorsContainer = ref<HTMLDivElement | null>(null)

let htmlAceEditor: ace.Ace.Editor,
  cssAceEditor: ace.Ace.Editor,
  jsAceEditor: ace.Ace.Editor

const htmlWidth = ref(0)
const cssWidth = ref(0)
const jsWidth = ref(0)
const editorsHeight = ref(DEFAULT_EDITORS_HEIGHT)

let activeEditor: 'html' | 'css' | null = null

const startResize = (editor: 'html' | 'css') => {
  activeEditor = editor
  window.addEventListener('mousemove', resizeEditor)
  window.addEventListener('mouseup', stopResize)
}

const resizeEditor = (event: MouseEvent) => {
  const deltaX = event.movementX
  if (!deltaX) {
    return
  }

  if (activeEditor === 'html') {
    if (htmlWidth.value <= MIN_EDITOR_WIDTH && deltaX < 0) return
    if (cssWidth.value <= MIN_EDITOR_WIDTH && deltaX > 0) return
    htmlWidth.value += deltaX
    cssWidth.value -= deltaX
  } else if (activeEditor === 'css') {
    if (cssWidth.value <= MIN_EDITOR_WIDTH && deltaX < 0) return
    if (jsWidth.value <= MIN_EDITOR_WIDTH && deltaX > 0) return
    cssWidth.value += deltaX
    jsWidth.value -= deltaX
  }
}

const stopResize = () => {
  activeEditor = null
  window.removeEventListener('mousemove', resizeEditor)
  window.removeEventListener('mouseup', stopResize)
}

const startHorizontalResize = () => {
  window.addEventListener('mousemove', resizeVertical)
  window.addEventListener('mouseup', stopVerticalResize)
}

const resizeVertical = (event: MouseEvent) => {
  const deltaY = event.movementY

  if (!wrapper.value) return

  if (!deltaY) return

  if (
    wrapper.value.clientHeight - editorsHeight.value < MIN_VIEWER_HEIGHT &&
    deltaY > 0
  ) {
    return
  }

  if (editorsHeight.value < MIN_EDITORS_HEIGHT && deltaY < 0) {
    return
  }

  const newHeight = editorsHeight.value + deltaY
  if (newHeight >= MIN_EDITORS_HEIGHT) {
    editorsHeight.value = newHeight
  }
}

const stopVerticalResize = () => {
  window.removeEventListener('mousemove', resizeVertical)
  window.removeEventListener('mouseup', stopVerticalResize)
}

const messageListener = (event: MessageEvent) => {
  if (event?.data?.type === 'log') {
    consoleLogs.value.push(event.data.message)
  }
}

const resizeObserver = new ResizeObserver(() => {
  if (editorsContainer.value) {
    const containerWidth = editorsContainer.value.clientWidth
    const totalWidth = htmlWidth.value + cssWidth.value + jsWidth.value
    const scaleFactor = containerWidth / totalWidth

    htmlWidth.value *= scaleFactor
    cssWidth.value *= scaleFactor
    jsWidth.value *= scaleFactor
  }
})

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

  if (editorsContainer.value) {
    const containerWidth = editorsContainer.value.clientWidth
    const equalWidth = containerWidth / 3
    htmlWidth.value = equalWidth
    cssWidth.value = equalWidth
    jsWidth.value = equalWidth

    resizeObserver.observe(editorsContainer.value)
  }

  window.addEventListener('message', messageListener)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', messageListener)
  if (editorsContainer.value) {
    resizeObserver.unobserve(editorsContainer.value)
  }
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

.resizable-divider {
  &.vertical {
    cursor: ew-resize;
  }

  &.horizontal {
    cursor: ns-resize;
  }

  &.gap {
    min-width: 3px;
    min-height: 3px;
    background-color: #353b43;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
</style>
