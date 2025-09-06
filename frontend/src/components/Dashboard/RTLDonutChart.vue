<template>
  <div class="rtl-donut-chart" :class="{ 'rtl': isRTL }">
    <DonutChart v-if="config" :config="enhancedConfig" />
  </div>
</template>

<script setup>
import { DonutChart } from 'frappe-ui'
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
    
    // Add RTL-specific options
    if (!config.options) {
      config.options = {}
    }
    
    config.options = {
      ...config.options,
      textAlign: 'right',
      direction: 'rtl'
    }
    
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
    
    // Ensure chart configuration includes RTL support
    if (!config.axisOptions) {
      config.axisOptions = {}
    }
    
    config.axisOptions = {
      ...config.axisOptions,
      textAlign: 'right',
      shortenYAxisNumbers: 1
    }
  }
  
  return config
})
</script>

<style scoped>
.rtl-donut-chart {
  width: 100%;
  height: 100%;
}

.rtl-donut-chart.rtl {
  direction: rtl;
  text-align: right;
}

.rtl-donut-chart.rtl :deep(.chart-container) {
  direction: rtl;
}

.rtl-donut-chart.rtl :deep(.chart-title) {
  text-align: right;
  direction: rtl;
}

.rtl-donut-chart.rtl :deep(.chart-subtitle) {
  text-align: right;
  direction: rtl;
}

.rtl-donut-chart.rtl :deep(.legend) {
  text-align: right;
  direction: rtl;
}

.rtl-donut-chart.rtl :deep(.legend-item) {
  text-align: right;
  direction: rtl;
}

.rtl-donut-chart.rtl :deep(.slice-label) {
  text-align: right;
  direction: rtl;
}

/* Ensure chart text elements are RTL-aware */
.rtl-donut-chart.rtl :deep(*) {
  unicode-bidi: embed;
}

/* Specific styling for Arabic text in donut charts */
.rtl-donut-chart.rtl :deep(.chart-text) {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  direction: rtl;
  text-align: right;
}

/* Ensure legend items are properly aligned for RTL */
.rtl-donut-chart.rtl :deep(.legend-item) {
  flex-direction: row-reverse;
  justify-content: flex-start;
}

.rtl-donut-chart.rtl :deep(.legend-color) {
  margin-left: 8px;
  margin-right: 0;
}
</style>
