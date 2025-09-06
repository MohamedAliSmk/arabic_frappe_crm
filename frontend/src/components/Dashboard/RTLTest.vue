<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">RTL Test for Arabic Text</h2>
    
    <!-- Test the Arabic text "الإيرادات المتوقعة" -->
    <div class="mb-6 p-4 border rounded" :dir="isRTL ? 'rtl' : 'ltr'" :class="{ 'text-right': isRTL }">
      <h3 class="text-lg font-semibold mb-2">الإيرادات المتوقعة</h3>
      <p class="text-gray-600">Expected Revenues in Arabic</p>
    </div>
    
    <!-- Test number chart with Arabic text -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2">Arabic Number Chart Test</h3>
      <div class="w-64 h-32">
        <ArabicNumberChart :config="testConfig" />
      </div>
    </div>
    
    <!-- Toggle RTL -->
    <div class="flex gap-4 items-center">
      <button 
        @click="toggleRTL" 
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {{ isRTL ? 'Switch to LTR' : 'Switch to RTL' }}
      </button>
      <span class="text-sm text-gray-600">
        Current: {{ isRTL ? 'RTL (Arabic)' : 'LTR (English)' }}
      </span>
    </div>
    
    <!-- Language detection info -->
    <div class="mt-4 p-3 bg-gray-100 rounded text-sm">
      <p><strong>Language Detection:</strong></p>
      <p>Document dir: {{ documentDir }}</p>
      <p>Document lang: {{ documentLang }}</p>
      <p>Navigator language: {{ navigatorLang }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ArabicNumberChart from './ArabicNumberChart.vue'

const isRTL = ref(false)

const documentDir = ref('')
const documentLang = ref('')
const navigatorLang = ref('')

const testConfig = computed(() => ({
  title: 'الإيرادات المتوقعة',
  value: 1250000,
  formattedValue: '١,٢٥٠,٠٠٠',
  delta: 15.5,
  formattedDelta: '١٥.٥٪',
  deltaSuffix: '%',
  prefix: 'ر.س',
  rtl: isRTL.value
}))

function toggleRTL() {
  isRTL.value = !isRTL.value
  if (isRTL.value) {
    document.documentElement.dir = 'rtl'
    document.documentElement.lang = 'ar'
  } else {
    document.documentElement.dir = 'ltr'
    document.documentElement.lang = 'en'
  }
}

onMounted(() => {
  documentDir.value = document.documentElement.dir || 'not set'
  documentLang.value = document.documentElement.lang || 'not set'
  navigatorLang.value = navigator.language || 'not set'
  
  // Initialize RTL based on current document settings
  isRTL.value = document.documentElement.dir === 'rtl' || 
                document.documentElement.lang === 'ar' ||
                navigator.language.startsWith('ar')
})
</script>
