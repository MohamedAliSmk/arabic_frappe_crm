<template>
  <div dir="rtl" class="rtl-ui font-sans bg-gray-50 text-gray-900">
  <!-- Your ListView component -->
  <ListView
    :class="$attrs.class"
    :columns="columns"
    :rows="rows"
    :options="{
      getRowRoute: (row) => ({
        name: 'Deal',
        params: { dealId: row.name },
        query: { view: route.query.view, viewType: route.params.viewType },
      }),
      selectable: options.selectable,
      showTooltip: options.showTooltip,
      resizeColumn: options.resizeColumn,
    }"
    row-key="name"
    @update:selections="(selections) => emit('selectionsChanged', selections)"
  >
    <ListHeader
      class="sm:mx-5 mx-3"
      @columnWidthUpdated="emit('columnWidthUpdated')"
    >
      <ListHeaderItem
        v-for="column in columns"
        :key="column.key"
        :item="column"
        @columnWidthUpdated="emit('columnWidthUpdated', column)"
          class="uppercase text-xs tracking-wide text-gray-500 font-semibold bg-gray-100 py-2 px-3"
      >
        <Button
          v-if="column.key == '_liked_by'"
          variant="ghosted"
          class="!h-4"
          :class="isLikeFilterApplied ? 'fill-red-500' : 'fill-white'"
          @click="() => emit('applyLikeFilter')"
        >
          <HeartIcon class="h-4 w-4" />
        </Button>
      </ListHeaderItem>
    </ListHeader>
    <ListRows
      :rows="rows"
      v-slot="{ idx, column, item, row }"
      doctype="CRM Deal"
    >
      <div v-if="column.key === '_assign'" class="flex items-center">
        <MultipleAvatar
          :avatars="item"
          size="sm"
          @click="
            (event) =>
              emit('applyFilter', {
                event,
                idx,
                column,
                item,
                firstColumn: columns[0],
              })
          "
        />
      </div>
      <ListRowItem v-else :item="item" :align="column.align"
       class="hover:bg-gray-100 transition rounded-lg px-3 py-2 cursor-pointer border-b last:border-0">
        <template #prefix>
          <div v-if="column.key === 'status'">
            <IndicatorIcon :class="item.color" />
          </div>
          <div v-else-if="column.key === 'organization'">
            <Avatar
              v-if="item.label"
              class="flex items-center"
              :image="item.logo"
              :label="item.label"
              size="sm"
            />
          </div>
          <div v-else-if="column.key === 'deal_owner'">
            <Avatar
              v-if="item.full_name"
              class="flex items-center"
              :image="item.user_image"
              :label="item.full_name"
              size="sm"
            />
          </div>
          <div v-else-if="column.key === 'mobile_no'">
            <PhoneIcon class="h-4 w-4" />
          </div>
          <div v-else-if="column.key === '_liked_by'">
            <Button
  variant="ghosted"
  class="rounded-full !h-6 !w-6 flex items-center justify-center hover:bg-red-50 transition"
  :class="isLiked(item) ? 'text-red-500' : 'text-gray-400'"
>
  <HeartIcon class="h-4 w-4" />
</Button>
          </div>
        </template>
        <template #default="{ label }">
          <div
            v-if="
              [
                'modified',
                'creation',
                'first_response_time',
                'first_responded_on',
                'response_by',
              ].includes(column.key)
            "
            class="truncate text-base"
            @click="
              (event) =>
                emit('applyFilter', {
                  event,
                  idx,
                  column,
                  item,
                  firstColumn: columns[0],
                })
            "
          >
            <Tooltip :text="item.label">
              <div>{{ item.timeAgo }}</div>
            </Tooltip>
          </div>
          <div
            v-else-if="column.key === 'sla_status'"
            class="truncate text-base"
          >
            <Badge
              v-if="item.value"
              :variant="'subtle'"
              :theme="item.color"
              size="md"
              :label="item.value"
              @click="
                (event) =>
                  emit('applyFilter', {
                    event,
                    idx,
                    column,
                    item,
                    firstColumn: columns[0],
                  })
              "
            />
          </div>
          <div v-else-if="column.type === 'Check'">
            <FormControl
              type="checkbox"
              :modelValue="item"
              :disabled="true"
              class="text-ink-gray-9"
            />
          </div>
          <div
            v-else
            class="truncate text-base"
            @click="
              (event) =>
                emit('applyFilter', {
                  event,
                  idx,
                  column,
                  item,
                  firstColumn: columns[0],
                })
            "
          >
            {{ label }}
          </div>
        </template>
      </ListRowItem>
    </ListRows>
    <ListSelectBanner>
      <template #actions="{ selections, unselectAll }">
        <Dropdown
          :options="listBulkActionsRef.bulkActions(selections, unselectAll)"
        >
          <Button icon="more-horizontal" variant="ghost" />
        </Dropdown>
      </template>
    </ListSelectBanner>
  </ListView>
  <ListFooter
  v-if="pageLengthCount"
  class="border-t bg-white sm:px-5 px-3 py-2 flex justify-between items-center text-sm text-gray-600"
  v-model="pageLengthCount"
  :options="{
    rowCount: options.rowCount,
    totalCount: options.totalCount,
  }"
>
  <template #default="{ loadMore }">
    <Button
      variant="outline"
      class="rounded-lg px-4 py-1 text-sm hover:bg-gray-100"
      @click="loadMore"
    >
      تحميل المزيد
    </Button>
  </template>
</ListFooter>
  <ListBulkActions ref="listBulkActionsRef" v-model="list" doctype="CRM Deal" />
</div>

</template>

<script setup>
import HeartIcon from '@/components/Icons/HeartIcon.vue'
import MultipleAvatar from '@/components/MultipleAvatar.vue'
import IndicatorIcon from '@/components/Icons/IndicatorIcon.vue'
import PhoneIcon from '@/components/Icons/PhoneIcon.vue'
import ListBulkActions from '@/components/ListBulkActions.vue'
import ListRows from '@/components/ListViews/ListRows.vue'
import {
  Avatar,
  ListView,
  ListHeader,
  ListHeaderItem,
  ListRowItem,
  ListSelectBanner,
  ListFooter,
  Dropdown,
  Tooltip,
} from 'frappe-ui'
import { sessionStore } from '@/stores/session'
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  rows: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  options: {
    type: Object,
    default: () => ({
      selectable: true,
      showTooltip: true,
      resizeColumn: false,
      totalCount: 0,
      rowCount: 0,
    }),
  },
})

const emit = defineEmits([
  'loadMore',
  'updatePageCount',
  'columnWidthUpdated',
  'applyFilter',
  'applyLikeFilter',
  'likeDoc',
  'selectionsChanged',
])

const route = useRoute()

const pageLengthCount = defineModel()
const list = defineModel('list')

const isLikeFilterApplied = computed(() => {
  return list.value.params?.filters?._liked_by ? true : false
})

const { user } = sessionStore()

function isLiked(item) {
  if (item) {
    let likedByMe = JSON.parse(item)
    return likedByMe.includes(user)
  }
}

watch(pageLengthCount, (val, old_value) => {
  if (val === old_value) return
  emit('updatePageCount', val)
})

const listBulkActionsRef = ref(null)

defineExpose({
  customListActions: computed(
    () => listBulkActionsRef.value?.customListActions,
  ),
})
</script>
