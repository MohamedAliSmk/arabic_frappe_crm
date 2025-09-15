<template>
  <button
    class="group relative flex w-full items-center justify-start rounded-xl text-gray-700 transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
    :class="[
      isActive 
        ? 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 shadow-sm border border-purple-200' 
        : 'hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm active:bg-gray-100',
      isCollapsed ? 'h-10 w-10 justify-center' : 'h-10 px-3',
      variant === 'primary' && !isActive ? 'hover:bg-purple-50 hover:text-purple-600' : '',
      variant === 'ghost' ? 'hover:bg-transparent hover:text-purple-600' : ''
    ]"
    @click="handleClick"
  >
    <!-- Active indicator -->
    <div
      v-if="isActive && !isCollapsed"
      class="absolute right-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-l-full bg-purple-500 transition-all duration-200"
    />
    
    <!-- Collapsed active indicator -->
    <div
      v-if="isActive && isCollapsed"
      class="absolute -left-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-purple-500 transition-all duration-200"
    />

    <!-- Main content container -->
    <div
      class="flex w-full items-center justify-between transition-all duration-200 ease-out"
      :class="isCollapsed ? 'justify-center' : 'justify-start'"
    >
      <div class="flex items-center w-full">
        <!-- Icon container with tooltip for collapsed state -->
        <Tooltip 
          :text="label" 
          placement="left" 
          :disabled="!isCollapsed"
          class="flex items-center justify-center"
        >
          <div 
            class="flex items-center justify-center transition-all duration-200"
            :class="[
              isCollapsed ? 'w-5 h-5' : 'w-5 h-5 ml-0',
              isActive ? 'text-purple-600' : 'text-gray-500 group-hover:text-gray-700'
            ]"
          >
            <slot name="icon">
              <FeatherIcon
                v-if="typeof icon === 'string'"
                :name="icon"
                class="w-full h-full transition-colors duration-200"
              />
              <component 
                v-else 
                :is="icon" 
                class="w-full h-full transition-colors duration-200" 
              />
            </slot>
          </div>
        </Tooltip>

        <!-- Label with smooth animation -->
        <div
          class="flex items-center justify-between w-full transition-all duration-300 ease-out overflow-hidden"
          :class="[
            isCollapsed 
              ? 'ml-0 w-0 opacity-0' 
              : 'ml-3 w-auto opacity-100'
          ]"
        >
          <span
            class="text-sm font-medium whitespace-nowrap transition-colors duration-200 text-right flex-1"
            :class="[
              isActive ? 'text-purple-700' : 'text-gray-700 group-hover:text-gray-900'
            ]"
          >
            {{ label }}
          </span>
          
          <!-- Right slot content -->
          <div 
            v-if="$slots.right"
            class="flex items-center mr-1 transition-all duration-200"
            :class="isActive ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-600'"
          >
            <slot name="right" />
          </div>
        </div>
      </div>
    </div>

    <!-- Subtle shine effect on hover -->
    <div
      class="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 -translate-x-full transition-all duration-700 ease-out group-hover:translate-x-full group-hover:opacity-20"
      :class="{ 'group-hover:opacity-0': isActive }"
    />

    <!-- Loading state indicator (optional) -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center rounded-xl bg-white bg-opacity-80"
    >
      <div class="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  </button>
</template>

<script setup>
import { Tooltip, FeatherIcon } from 'frappe-ui'
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { isMobileView, mobileSidebarOpened } from '@/composables/settings'

// Router setup
const router = useRouter()
const route = useRoute()

// Component events
const emit = defineEmits(['click'])

// Component props with enhanced options
const props = defineProps({
  icon: {
    type: [Object, String, Function],
    default: null,
  },
  label: {
    type: String,
    default: '',
  },
  to: {
    type: [Object, String],
    default: '',
  },
  isCollapsed: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'default', // 'default', 'primary', 'ghost'
    validator: (value) => ['default', 'primary', 'ghost'].includes(value),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  badge: {
    type: [String, Number],
    default: null,
  },
})

// Enhanced click handler with loading state support
async function handleClick() {
  if (props.disabled || props.loading) return
  
  if (props.to) {
    try {
      if (typeof props.to === 'object') {
        await router.push(props.to)
      } else {
        await router.push({ name: props.to })
      }
      
      // Auto-close mobile sidebar
      if (isMobileView.value) {
        mobileSidebarOpened.value = false
      }
    } catch (error) {
      console.error('Navigation error:', error)
    }
  } else {
    // Emit click event for custom handlers
    emit('click')
  }
}

// Enhanced active state detection
const isActive = computed(() => {
  if (!props.to) return false
  
  if (typeof props.to === 'object') {
    // Handle object-based routes with query parameters
    if (route.query.view && props.to.query?.view) {
      return route.query.view === props.to.query.view
    }
    
    // Handle named routes
    if (props.to.name) {
      return route.name === props.to.name
    }
    
    // Handle path-based routes
    if (props.to.path) {
      return route.path === props.to.path
    }
  }
  
  // Handle string-based routes (route names)
  return route.name === props.to
})

// Computed class for dynamic styling
const buttonClasses = computed(() => {
  const baseClasses = [
    'group relative flex w-full items-center justify-start rounded-xl text-gray-700',
    'transition-all duration-200 ease-out focus:outline-none',
    'focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white'
  ]
  
  if (props.disabled) {
    baseClasses.push('opacity-50 cursor-not-allowed')
  } else if (isActive.value) {
    baseClasses.push(
      'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700',
      'shadow-sm border border-purple-200'
    )
  } else {
    baseClasses.push('hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm active:bg-gray-100')
    
    if (props.variant === 'primary') {
      baseClasses.push('hover:bg-purple-50 hover:text-purple-600')
    } else if (props.variant === 'ghost') {
      baseClasses.push('hover:bg-transparent hover:text-purple-600')
    }
  }
  
  if (props.isCollapsed) {
    baseClasses.push('h-10 w-10 justify-center')
  } else {
    baseClasses.push('h-10 px-3')
  }
  
  return baseClasses.join(' ')
})
</script>

<style scoped>
/* Custom animations */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 1.5s ease-in-out infinite;
}

/* RTL support */
[dir="rtl"] .text-right {
  text-align: right;
}

[dir="rtl"] .ml-3 {
  margin-left: 0;
  margin-right: 0.75rem;
}

[dir="rtl"] .mr-1 {
  margin-right: 0;
  margin-left: 0.25rem;
}

/* Smooth focus transitions */
.focus-visible\:ring-2:focus-visible {
  ring-width: 2px;
  ring-color: rgb(168 85 247);
  ring-offset-width: 2px;
  ring-offset-color: rgb(255 255 255);
}

/* Enhanced hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Gradient shine effect */
.shine-effect {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  transform: translateX(-100%);
  transition: transform 0.7s ease-out;
}

.group:hover .shine-effect {
  transform: translateX(100%);
}
</style>