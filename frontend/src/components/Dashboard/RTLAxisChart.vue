<template>
  <div class="rtl-axis-chart" :class="{ 'rtl': isRTL }">
    <AxisChart v-if="config" :config="enhancedConfig" />
  </div>
</template>

<script setup>
import { AxisChart } from 'frappe-ui'
import { computed } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    required: true
  }
})

const isRTL = computed(() => {
  if (typeof window === 'undefined') return false
  const doc = document.documentElement
  return doc?.dir === 'rtl' || doc?.lang === 'ar' || navigator.language?.startsWith('ar')
})

const enhancedConfig = computed(() => {
  if (!props.config) return props.config
  
  const config = { ...props.config }
  
  // Add RTL-specific styling and options
  if (isRTL.value) {
    // Ensure chart container has RTL direction
    config.rtl = true
    
    // Add RTL-specific axis options
    if (!config.axisOptions) {
      config.axisOptions = {}
    }
    
    // Set text alignment for RTL
    config.axisOptions.xAxisMode = 'tick'
    config.axisOptions.textAlign = 'right'
    config.axisOptions.shortenYAxisNumbers = 1
    
    // Add RTL-specific styling
    if (!config.style) {
      config.style = {}
    }
    
    config.style = {
      ...config.style,
      direction: 'rtl',
      textAlign: 'right',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }
    
    // Ensure chart options include RTL support
    if (!config.options) {
      config.options = {}
    }
    
    config.options = {
      ...config.options,
      textAlign: 'right',
      direction: 'rtl'
    }
  }
  
  return config
})
</script>

<style scoped>
.rtl-axis-chart {
  width: 100%;
  height: 100%;
}

.rtl-axis-chart.rtl {
  direction: rtl;
  text-align: right;
}

.rtl-axis-chart.rtl :deep(.chart-container) {
  direction: rtl;
}

.rtl-axis-chart.rtl :deep(.chart-title) {
  text-align: right;
  direction: rtl;
}

.rtl-axis-chart.rtl :deep(.chart-subtitle) {
  text-align: right;
  direction: rtl;
}

.rtl-axis-chart.rtl :deep(.axis-label) {
  text-align: right;
  direction: rtl;
}

.rtl-axis-chart.rtl :deep(.legend) {
  text-align: right;
  direction: rtl;
}

.rtl-axis-chart.rtl :deep(.legend-item) {
  text-align: right;
  direction: rtl;
}

/* Ensure chart text elements are RTL-aware */
.rtl-axis-chart.rtl :deep(*) {
  unicode-bidi: embed;
}

/* Specific styling for Arabic text in charts */
.rtl-axis-chart.rtl :deep(.chart-text) {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  direction: rtl;
  text-align: right;
}
</style>
