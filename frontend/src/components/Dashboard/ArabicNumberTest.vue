<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Arabic Number Formatting Test</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Test 1: Basic Numbers -->
      <div class="border p-4 rounded">
        <h3 class="font-semibold mb-2">Basic Numbers</h3>
        <div class="space-y-2">
          <div>English: 123 → Arabic: {{ toArabicNumbers(123) }}</div>
          <div>English: 456 → Arabic: {{ toArabicNumbers(456) }}</div>
          <div>English: 789 → Arabic: {{ toArabicNumbers(789) }}</div>
        </div>
      </div>
      
      <!-- Test 2: Currency -->
      <div class="border p-4 rounded">
        <h3 class="font-semibold mb-2">Currency</h3>
        <div class="space-y-2">
          <div>English: $1000.50 → Arabic: {{ formatArabicCurrency(1000.50) }}</div>
          <div>English: $2500.75 → Arabic: {{ formatArabicCurrency(2500.75) }}</div>
          <div>English: $0.00 → Arabic: {{ formatArabicCurrency(0) }}</div>
        </div>
      </div>
      
      <!-- Test 3: Numbers with Suffix -->
      <div class="border p-4 rounded">
        <h3 class="font-semibold mb-2">Numbers with Suffix</h3>
        <div class="space-y-2">
          <div>English: 30 days → Arabic: {{ formatArabicNumberWithSuffix(30, 'أيام') }}</div>
          <div>English: 15 days → Arabic: {{ formatArabicNumberWithSuffix(15, 'أيام') }}</div>
          <div>English: 0 days → Arabic: {{ formatArabicNumberWithSuffix(0, 'أيام') }}</div>
        </div>
      </div>
      
      <!-- Test 4: Dashboard Cards -->
      <div class="border p-4 rounded">
        <h3 class="font-semibold mb-2">Dashboard Cards</h3>
        <div class="space-y-4">
          <ArabicNumberChart :config="testConfig1" />
          <ArabicNumberChart :config="testConfig2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { toArabicNumbers, formatArabicCurrency, formatArabicNumberWithSuffix } from '@/utils/arabicNumbers'
import ArabicNumberChart from './ArabicNumberChart.vue'

const testConfig1 = ref({
  title: 'إجمالي العملاء المحتملين',
  value: 1234,
  formattedValue: toArabicNumbers(1234),
  delta: 15.5,
  formattedDelta: toArabicNumbers(15.5) + '%',
  deltaSuffix: '%',
  rtl: true
})

const testConfig2 = ref({
  title: 'متوسط قيمة الصفقات المربحة',
  value: 2500.75,
  formattedValue: formatArabicCurrency(2500.75),
  delta: -125.50,
  formattedDelta: formatArabicCurrency(125.50),
  prefix: 'ر.س',
  rtl: true
})
</script>
