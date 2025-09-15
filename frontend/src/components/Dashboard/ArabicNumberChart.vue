<template>
  <div
    class="group relative h-full w-full overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1"
    :class="[
      getCardBackground(),
      { 'rtl': isRTL }
    ]"
  >
    <!-- Animated Background Gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    
    <!-- Decorative Corner Element -->
    <div class="absolute top-0 right-0 w-20 h-20 opacity-10 transition-all duration-300 group-hover:opacity-20">
      <div class="w-full h-full rounded-bl-full bg-gradient-to-br from-purple-400 to-blue-500" />
    </div>
    
    <!-- Main Content Container -->
    <div class="relative z-10 flex flex-col h-full p-6">
      
      <!-- Header Section with Icon and Title -->
      <div class="flex items-center justify-between mb-4" :class="{ 'flex-row-reverse': isRTL }">
        <div class="flex items-center" :class="{ 'flex-row-reverse': isRTL }">
          <!-- Dynamic Icon Based on Value Trend -->
          <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 transition-all duration-300 group-hover:scale-110 group-hover:from-purple-500/30 group-hover:to-blue-500/30">
            <FeatherIcon 
              :name="getCardIcon()" 
              class="w-5 h-5 text-purple-300 transition-colors duration-300 group-hover:text-purple-200"
            />
          </div>
          
          <!-- Title with Enhanced Typography -->
          <div class="flex flex-col" :class="{ 'mr-3 items-end': isRTL, 'ml-3 items-start': !isRTL }">
            <h3 class="text-sm font-semibold text-gray-300 transition-colors duration-300 group-hover:text-gray-200" :class="{ 'text-right': isRTL }">
              {{ config.title }}
            </h3>
            <p v-if="config.subtitle" class="text-xs text-gray-500 mt-0.5 transition-colors duration-300 group-hover:text-gray-400" :class="{ 'text-right': isRTL }">
              {{ config.subtitle }}
            </p>
          </div>
        </div>
        
        <!-- Status Indicator Dot -->
        <div class="flex items-center space-x-1" :class="{ 'space-x-reverse': isRTL }">
          <div 
            class="w-2 h-2 rounded-full transition-all duration-300"
            :class="getStatusColor()"
          />
          <Tooltip :text="getStatusText()" placement="top">
            <FeatherIcon name="info" class="w-3 h-3 text-gray-500 hover:text-gray-400 transition-colors duration-200 cursor-help" />
          </Tooltip>
        </div>
      </div>
      
      <!-- Main Value Display -->
      <div class="flex-1 flex items-center justify-center py-4">
        <div class="text-center" :class="{ 'text-right': isRTL }">
          <!-- Primary Value with Animated Counter -->
          <div class="relative">
            <div 
              class="text-4xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent transition-all duration-500 group-hover:from-purple-200 group-hover:to-blue-200"
              :class="{ 'text-right': isRTL }"
            >
              <span v-if="config.prefix && !isRTL" class="text-2xl opacity-75">{{ config.prefix }}</span>
              
              <!-- Animated Value Counter -->
              <AnimatedCounter 
                v-if="!isRTL"
                :value="config.value" 
                :duration="1000"
                :formatter="formatValue"
                class="inline-block"
              />
              <span v-else-if="isRTL && config.formattedValue" class="whitespace-nowrap">{{ config.formattedValue }}</span>
              
              <span v-if="config.suffix && !isRTL" class="text-2xl opacity-75 ml-1">{{ config.suffix }}</span>
            </div>
            
            <!-- Subtle Glow Effect -->
            <div class="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-30 -z-10" />
          </div>
          
          <!-- Secondary Information -->
          <div v-if="config.description" class="mt-2 text-xs text-gray-400 transition-colors duration-300 group-hover:text-gray-300" :class="{ 'text-right': isRTL }">
            {{ config.description }}
          </div>
        </div>
      </div>
      
      <!-- Enhanced Delta Section -->
      <div v-if="config.delta !== undefined" class="mt-4">
        <div class="flex items-center justify-between p-3 rounded-xl bg-black/20 backdrop-blur-sm border border-white/5 transition-all duration-300 hover:bg-black/30 hover:border-white/10" :class="{ 'flex-row-reverse': isRTL }">
          
          <!-- Delta Value with Enhanced Styling -->
          <div class="flex items-center" :class="{ 'flex-row-reverse': isRTL }">
            <!-- Animated Icon -->
            <div 
              class="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 group-hover:scale-110"
              :class="getDeltaIconBackground()"
            >
              <FeatherIcon 
                :name="getDeltaIcon()" 
                class="w-4 h-4 transition-all duration-300"
                :class="getDeltaIconColor()"
              />
            </div>
            
            <!-- Delta Text -->
            <div class="flex flex-col" :class="{ 'mr-3': isRTL, 'ml-3': !isRTL }">
              <span 
                class="text-sm font-semibold transition-colors duration-300"
                :class="getDeltaTextColor()"
              >
                {{ getDeltaDisplayValue() }}
              </span>
              <span class="text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
                {{ getDeltaPeriod() }}
              </span>
            </div>
          </div>
          
          <!-- Progress Bar for Visual Representation -->
          <div class="flex items-center" :class="{ 'mr-4': isRTL, 'ml-4': !isRTL }">
            <div class="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div 
                class="h-full rounded-full transition-all duration-1000 ease-out"
                :class="getDeltaBarColor()"
                :style="{ width: `${Math.min(Math.abs(config.delta), 100)}%` }"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer Actions (Optional) -->
      <div v-if="config.showActions" class="mt-4 flex items-center justify-between" :class="{ 'flex-row-reverse': isRTL }">
        <Button 
          variant="ghost" 
          size="sm"
          class="text-gray-400 hover:text-white transition-colors duration-200"
        >
          <template #prefix>
            <FeatherIcon name="eye" class="w-3 h-3" />
          </template>
          {{ isRTL ? 'عرض التفاصيل' : 'View Details' }}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          class="text-gray-400 hover:text-white transition-colors duration-200"
        >
          <FeatherIcon name="more-horizontal" class="w-4 h-4" />
        </Button>
      </div>
    </div>
    
    <!-- Animated Border Effect -->
    <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-transparent to-blue-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" style="padding: 1px;">
      <div class="w-full h-full rounded-2xl bg-gray-900" />
    </div>
  </div>
</template>

<script setup>
import { FeatherIcon, Tooltip, Button } from 'frappe-ui'
import { computed, ref, onMounted } from 'vue'

// Props
const props = defineProps({
  config: {
    type: Object,
    required: true,
    default: () => ({
      title: '',
      subtitle: '',
      value: 0,
      prefix: '',
      suffix: '',
      formattedValue: null,
      delta: undefined,
      formattedDelta: null,
      description: '',
      showActions: false,
      trend: 'neutral', // 'positive', 'negative', 'neutral'
      category: 'general' // 'sales', 'revenue', 'users', 'performance', 'general'
    })
  },
  isRTL: {
    type: Boolean,
    default: false
  }
})

// Animated Counter Component
const AnimatedCounter = {
  props: ['value', 'duration', 'formatter'],
  setup(props) {
    const displayValue = ref(0)
    
    onMounted(() => {
      const startValue = 0
      const endValue = props.value || 0
      const duration = props.duration || 1000
      const startTime = Date.now()
      
      const updateValue = () => {
        const now = Date.now()
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        displayValue.value = startValue + (endValue - startValue) * easeOutQuart
        
        if (progress < 1) {
          requestAnimationFrame(updateValue)
        } else {
          displayValue.value = endValue
        }
      }
      
      requestAnimationFrame(updateValue)
    })
    
    return { displayValue }
  },
  template: `<span>{{ formatter ? formatter(displayValue) : Math.round(displayValue) }}</span>`
}

// Dynamic styling functions
function getCardBackground() {
  const category = props.config.category || 'general'
  const backgrounds = {
    sales: 'bg-gradient-to-br from-gray-900 via-gray-800 to-green-900/20 border border-green-500/20',
    revenue: 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900/20 border border-purple-500/20',
    users: 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900/20 border border-blue-500/20',
    performance: 'bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900/20 border border-orange-500/20',
    general: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 border border-gray-600/30'
  }
  return backgrounds[category] || backgrounds.general
}

function getCardIcon() {
  const category = props.config.category || 'general'
  const icons = {
    sales: 'trending-up',
    revenue: 'dollar-sign',
    users: 'users',
    performance: 'activity',
    general: 'bar-chart'
  }
  return icons[category] || icons.general
}

function getStatusColor() {
  if (props.config.delta === undefined) return 'bg-gray-500'
  
  if (props.config.delta > 0) return 'bg-green-500 animate-pulse'
  if (props.config.delta < 0) return 'bg-red-500 animate-pulse'
  return 'bg-gray-500'
}

function getStatusText() {
  if (props.config.delta === undefined) return 'No change data'
  
  if (props.config.delta > 0) return 'Trending up'
  if (props.config.delta < 0) return 'Trending down'
  return 'Stable'
}

// Delta-related functions
function getDeltaIcon() {
  if (props.config.delta > 0) return 'trending-up'
  if (props.config.delta < 0) return 'trending-down'
  return 'minus'
}

function getDeltaIconBackground() {
  if (props.config.delta > 0) return 'bg-green-500/20 border border-green-500/30'
  if (props.config.delta < 0) return 'bg-red-500/20 border border-red-500/30'
  return 'bg-gray-500/20 border border-gray-500/30'
}

function getDeltaIconColor() {
  if (props.config.delta > 0) return 'text-green-400'
  if (props.config.delta < 0) return 'text-red-400'
  return 'text-gray-400'
}

function getDeltaTextColor() {
  if (props.config.delta > 0) return 'text-green-400'
  if (props.config.delta < 0) return 'text-red-400'
  return 'text-gray-400'
}

function getDeltaBarColor() {
  if (props.config.delta > 0) return 'bg-gradient-to-r from-green-500 to-emerald-400'
  if (props.config.delta < 0) return 'bg-gradient-to-r from-red-500 to-rose-400'
  return 'bg-gradient-to-r from-gray-500 to-gray-400'
}

function getDeltaDisplayValue() {
  if (props.isRTL && props.config.formattedDelta) {
    return props.config.formattedDelta
  }
  return formatDelta(props.config.delta)
}

function getDeltaPeriod() {
  return props.isRTL ? 'من الفترة السابقة' : 'vs previous period'
}

// Formatting functions
function formatValue(value) {
  if (value === null || value === undefined) return '0'
  
  const absValue = Math.abs(value)
  if (absValue >= 1000000000) {
    return (value / 1000000000).toFixed(1) + 'B'
  } else if (absValue >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M'
  } else if (absValue >= 1000) {
    return (value / 1000).toFixed(1) + 'K'
  } else {
    return value.toLocaleString()
  }
}

function formatDelta(delta) {
  if (delta === null || delta === undefined) return '0%'
  
  const sign = delta > 0 ? '+' : ''
  const absValue = Math.abs(delta)
  
  if (absValue >= 100) {
    return `${sign}${Math.round(delta)}%`
  } else {
    return `${sign}${delta.toFixed(1)}%`
  }
}

// Computed properties
const cardVariant = computed(() => {
  if (props.config.delta > 20) return 'success'
  if (props.config.delta < -20) return 'danger'
  return 'default'
})
</script>

<style scoped>
/* Custom animations for enhanced visual appeal */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-2px);
  }
}

.group:hover {
  animation: float 3s ease-in-out infinite;
}

/* Enhanced gradient text effects */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Custom glow effects */
.glow-effect {
  filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.3));
}

.group:hover .glow-effect {
  filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.5));
}

/* Smooth backdrop blur */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* RTL-specific animations */
[dir="rtl"] .animate-slideInRight {
  animation: slideInRight 0.5s ease-out;
}

[dir="ltr"] .animate-slideInLeft {
  animation: slideInLeft 0.5s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Enhanced focus states for accessibility */
.group:focus-within {
  outline: 2px solid rgba(168, 85, 247, 0.5);
  outline-offset: 2px;
}

/* Custom scrollbar for overflow content */
.overflow-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: rgba(168, 85, 247, 0.3);
  border-radius: 2px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(168, 85, 247, 0.5);
}

/* Micro-interactions */
.transition-micro {
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced shadow depths */
.shadow-depth-1 {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.shadow-depth-2 {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.hover\:shadow-depth-3:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}
</style>

<!-- <style scoped>
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
</style> -->
