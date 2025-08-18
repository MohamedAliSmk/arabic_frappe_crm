<template>
  <div 
    class="h-full w-full p-4 bg-black rounded-lg shadow-sm border border-gray-700"
    :class="{ 'rtl': isRTL }"
  >
    <div class="flex flex-col h-full">
      <!-- Title -->
      <div class="text-sm font-medium text-gray-300 mb-2" :class="{ 'text-right': isRTL }">
        {{ config.title }}
      </div>
      
      <!-- Main Number -->
      <div class="flex-1 flex items-end">
        <div class="text-2xl font-bold text-white break-words overflow-hidden" :class="{ 'text-right': isRTL }">
          <span v-if="config.prefix && !isRTL">{{ config.prefix }}</span>
          <span v-if="isRTL && config.formattedValue" class="whitespace-nowrap">{{ config.formattedValue }}</span>
          <span v-else-if="!isRTL">{{ formatValue(config.value) }}</span>
          <span v-if="config.suffix && !isRTL">{{ config.suffix }}</span>
        </div>
      </div>
      
      <!-- Delta/Change -->
      <div v-if="config.delta !== undefined" class="mt-2 flex items-center" :class="{ 'justify-end': isRTL }">
        <div 
          class="flex items-center text-xs min-w-0"
          :class="{
            'text-green-400': config.delta > 0,
            'text-red-400': config.delta < 0,
            'text-gray-300': config.delta === 0,
            'flex-row-reverse': isRTL
          }"
        >
          <span v-if="config.delta > 0" class="mr-1 flex-shrink-0" :class="{ 'ml-1 mr-0': isRTL }">↗</span>
          <span v-else-if="config.delta < 0" class="mr-1 flex-shrink-0" :class="{ 'ml-1 mr-0': isRTL }">↘</span>
          <span v-else class="mr-1 flex-shrink-0" :class="{ 'ml-1 mr-0': isRTL }">→</span>
          
          <span v-if="isRTL && config.formattedDelta" class="overflow-hidden text-ellipsis whitespace-nowrap">{{ config.formattedDelta }}</span>
          <span v-else class="overflow-hidden text-ellipsis whitespace-nowrap">{{ formatDelta(config.delta) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    required: true
  }
})

const isRTL = computed(() => {
  return props.config.rtl || document.documentElement.dir === 'rtl' || 
         document.documentElement.lang === 'ar' ||
         navigator.language.startsWith('ar')
})

const formatValue = (value) => {
  if (value === null || value === undefined) return '0'
  
  // If it's a currency value
  if (props.config.prefix && props.config.prefix.includes('ر.س')) {
    return `${props.config.prefix}${value.toFixed(2)}`
  }
  
  // If it's a number with suffix
  if (props.config.suffix) {
    return `${value}${props.config.suffix}`
  }
  
  return value.toString()
}

const formatDelta = (delta) => {
  if (delta === null || delta === undefined) return '0'
  
  const absDelta = Math.abs(delta)
  
  // If it's a percentage
  if (props.config.deltaSuffix === '%') {
    return `${absDelta.toFixed(1)}%`
  }
  
  // If it's currency
  if (props.config.prefix && props.config.prefix.includes('ر.س')) {
    return `${props.config.prefix}${absDelta.toFixed(2)}`
  }
  
  // If it's days
  if (props.config.deltaSuffix && props.config.deltaSuffix.includes('days')) {
    return `${absDelta} days`
  }
  
  return absDelta.toString()
}
</script>

<style scoped>
.rtl {
  direction: rtl;
  text-align: right;
}

.rtl .flex-row-reverse {
  flex-direction: row-reverse;
}

/* Ensure text doesn't overflow */
.overflow-hidden {
  overflow: hidden;
}

.break-words {
  word-wrap: break-word;
  word-break: break-word;
}

.whitespace-nowrap {
  white-space: nowrap;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.flex-shrink-0 {
  flex-shrink: 0;
}

.text-ellipsis {
  text-overflow: ellipsis;
}

.min-w-0 {
  min-width: 0;
}

/* Ensure arrow indicators are always visible */
[class*="mr-1"], [class*="ml-1"] {
  display: inline-block;
  font-weight: bold;
}

/* Responsive text sizing for Arabic */
@media (max-width: 640px) {
  .text-2xl {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }
}

@media (max-width: 480px) {
  .text-2xl {
    font-size: 1.125rem;
    line-height: 1.5rem;
  }
}
</style>
