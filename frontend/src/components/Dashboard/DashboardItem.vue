<template>
  <div class="h-full w-full" :dir="isRTL ? 'rtl' : undefined">
    <div
      v-if="item.type == 'number_chart'"
      class="flex h-full w-full rounded shadow overflow-hidden cursor-pointer"
    >
      <Tooltip :text="__(item.data.tooltip)">
        <ArabicNumberChart
          v-if="item.data"
          :key="index"
          :config="item.data"
        />
      </Tooltip>
    </div>
    <div
      v-else-if="item.type == 'spacer'"
      class="rounded bg-surface-white h-full overflow-hidden text-ink-gray-5 flex items-center justify-center"
      :class="editing ? 'border border-dashed border-outline-gray-2' : ''"
    >
      {{ editing ? __('Spacer') : '' }}
    </div>
    <div
      v-else-if="item.type == 'axis_chart'"
      class="h-full w-full rounded-md bg-surface-white shadow"
    >
      <RTLAxisChart v-if="item.data" :config="item.data" />
    </div>
    <div
      v-else-if="item.type == 'donut_chart'"
      class="h-full w-full rounded-md bg-surface-white shadow overflow-hidden"
    >
      <RTLDonutChart v-if="item.data" :config="item.data" />
    </div>
  </div>
</template>
<script setup>
import { Tooltip } from 'frappe-ui'
import ArabicNumberChart from './ArabicNumberChart.vue'
import RTLAxisChart from './RTLAxisChart.vue'
import RTLDonutChart from './RTLDonutChart.vue'
import { computed } from 'vue'

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
  item: {
    type: Object,
    required: true,
  },
  editing: {
    type: Boolean,
    default: false,
  },
})

const isRTL = computed(() => {
  if (typeof window === 'undefined') return false
  const doc = document.documentElement
  return doc?.dir === 'rtl' || doc?.lang === 'ar' || navigator.language?.startsWith('ar')
})
</script>
