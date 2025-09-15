<template>
  <div
    class="relative flex h-full flex-col justify-between transition-all duration-300 ease-in-out bg-white border-l border-gray-200 shadow-sm"
    :class="[
      isSidebarCollapsed ? 'w-16' : 'w-64',
      isRTL ? 'border-l-0 border-r' : ''
    ]"
    dir="rtl"
  >
    <!-- Header Section -->
    <div class="flex-shrink-0">
      <!-- Logo & User Section -->
      
      <!-- User Profile Dropdown -->
      <UserDropdown 
        class="px-3 py-2 border-b border-gray-100" 
        :isCollapsed="isSidebarCollapsed" 
      />

      <!-- Notifications -->
      <div class="px-3 py-2 border-b border-gray-100">
        <SidebarLink
          id="notifications-btn"
          :label="'الإشعارات'"
          :icon="NotificationsIcon"
          :isCollapsed="isSidebarCollapsed"
          @click="toggleNotificationPanel"
          class="relative group"
          variant="ghost"
        >
          <template #right>
            <Badge
              v-if="!isSidebarCollapsed && unreadNotificationsCount"
              :label="unreadNotificationsCount"
              class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
            />
            <div
              v-else-if="unreadNotificationsCount"
              class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"
            />
          </template>
        </SidebarLink>
      </div>
    </div>

    <!-- Main Navigation -->
    <div class="flex-1 overflow-y-auto py-4">
      <nav class="space-y-1">
        <div v-for="(view, index) in allViews" :key="`view-${index}`">
          <!-- Section Divider for collapsed state -->
          <div
            v-if="!view.hideLabel && isSidebarCollapsed && view.views?.length && index > 0"
            class="mx-4 my-3 border-t border-gray-200"
          />
          
          <!-- Section Header -->
          <div
            v-if="!view.hideLabel && !isSidebarCollapsed"
            class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition-colors duration-200 flex items-center justify-between group"
            @click="view.opened = !view.opened"
          >
            <span>{{ view.name }}</span>
            <FeatherIcon
              name="chevron-down"
              class="w-4 h-4 transition-transform duration-200 group-hover:text-gray-700"
              :class="{ 'rotate-180': !view.opened }"
            />
          </div>

          <!-- Navigation Links -->
          <div 
            v-show="view.opened || isSidebarCollapsed"
            class="space-y-1 px-3"
            :class="{ 'transition-all duration-300 ease-in-out': !isSidebarCollapsed }"
          >
            <SidebarLink
              v-for="(link, linkIndex) in view.views"
              :key="`link-${index}-${linkIndex}`"
              :icon="link.icon"
              :label="getArabicLabel(link.label)"
              :to="link.to"
              :isCollapsed="isSidebarCollapsed"
              class="group relative"
              :class="{
                'mb-1': !isSidebarCollapsed,
                'mx-1 my-1': isSidebarCollapsed
              }"
            />
          </div>
        </div>
      </nav>
    </div>

    <!-- Footer Section -->
    <div class="flex-shrink-0 border-t border-gray-100 p-3 space-y-2">
      <!-- Banners -->
      <div class="space-y-2">
        <SignupBanner
          v-if="isDemoSite"
          :isSidebarCollapsed="isSidebarCollapsed"
          :afterSignup="() => capture('signup_from_demo_site')"
          class="rounded-lg"
        />
        <TrialBanner
          v-if="isFCSite"
          :isSidebarCollapsed="isSidebarCollapsed"
          :afterUpgrade="() => capture('upgrade_plan_from_trial_banner')"
          class="rounded-lg"
        />
        <GettingStartedBanner
          v-if="!isOnboardingStepsCompleted"
          :isSidebarCollapsed="isSidebarCollapsed"
          class="rounded-lg"
        />
      </div>

      <!-- Footer Links -->
      <div class="space-y-1">
        <SidebarLink
          v-if="isOnboardingStepsCompleted"
          :label="'المساعدة والدعم'"
          :isCollapsed="isSidebarCollapsed"
          @click="toggleHelpModal"
          variant="ghost"
          class="group"
        >
          <template #icon>
            <HelpIcon class="w-4 h-4" />
          </template>
        </SidebarLink>
        
        <!-- Quick Actions -->
        
      </div>

      <!-- Version Info -->
      
    </div>

    <!-- Modals -->
    <Notifications />
    <Settings />
    <HelpModal
      v-if="showHelpModal"
      v-model="showHelpModal"
      v-model:articles="articles"
      :logo="CRMLogo"
      :afterSkip="(step) => capture('onboarding_step_skipped_' + step)"
      :afterSkipAll="() => capture('onboarding_steps_skipped')"
      :afterReset="(step) => capture('onboarding_step_reset_' + step)"
      :afterResetAll="() => capture('onboarding_steps_reset')"
      docsLink="https://docs.frappe.io/crm"
    />
    <IntermediateStepModal
      v-model="showIntermediateModal"
      :currentStep="currentStep"
    />
  </div>
</template>

<script setup>
import LucideLayoutDashboard from '~icons/lucide/layout-dashboard'
import CRMLogo from '@/components/Icons/CRMLogo.vue'
import InviteIcon from '@/components/Icons/InviteIcon.vue'
import ConvertIcon from '@/components/Icons/ConvertIcon.vue'
import CommentIcon from '@/components/Icons/CommentIcon.vue'
import EmailIcon from '@/components/Icons/EmailIcon.vue'
import StepsIcon from '@/components/Icons/StepsIcon.vue'
import PinIcon from '@/components/Icons/PinIcon.vue'
import UserDropdown from '@/components/UserDropdown.vue'
import SquareAsterisk from '@/components/Icons/SquareAsterisk.vue'
import LeadsIcon from '@/components/Icons/LeadsIcon.vue'
import DealsIcon from '@/components/Icons/DealsIcon.vue'
import ContactsIcon from '@/components/Icons/ContactsIcon.vue'
import OrganizationsIcon from '@/components/Icons/OrganizationsIcon.vue'
import NoteIcon from '@/components/Icons/NoteIcon.vue'
import TaskIcon from '@/components/Icons/TaskIcon.vue'
import PhoneIcon from '@/components/Icons/PhoneIcon.vue'
import CollapseSidebar from '@/components/Icons/CollapseSidebar.vue'
import NotificationsIcon from '@/components/Icons/NotificationsIcon.vue'
import HelpIcon from '@/components/Icons/HelpIcon.vue'
import SidebarLink from '@/components/SidebarLink.vue'
import Notifications from '@/components/Notifications.vue'
import Settings from '@/components/Settings/Settings.vue'
import { viewsStore } from '@/stores/views'
import {
  unreadNotificationsCount,
  notificationsStore,
} from '@/stores/notifications'
import { usersStore } from '@/stores/users'
import { sessionStore } from '@/stores/session'
import { showSettings, activeSettingsPage } from '@/composables/settings'
import { showChangePasswordModal } from '@/composables/modals'
import { FeatherIcon, call } from 'frappe-ui'
import {
  SignupBanner,
  TrialBanner,
  HelpModal,
  GettingStartedBanner,
  useOnboarding,
  showHelpModal,
  minimize,
  IntermediateStepModal,
} from 'frappe-ui/frappe'
import { capture } from '@/telemetry'
import router from '@/router'
import { useStorage } from '@vueuse/core'
import { ref, reactive, computed, h, markRaw, onMounted } from 'vue'

// Store instances
const { getPinnedViews, getPublicViews } = viewsStore()
const { toggle: toggleNotificationPanel } = notificationsStore()

// Reactive state
const isSidebarCollapsed = useStorage('isSidebarCollapsed', false)
const isRTL = ref(true) // Enable RTL by default
const isFCSite = ref(window.is_fc_site)
const isDemoSite = ref(window.is_demo_site)

// Arabic translations mapping
const arabicLabels = {
  'Dashboard': 'لوحة القيادة',
  'Leads': 'العملاء المحتملون',
  'Deals': 'الصفقات',
  'Contacts': 'جهات الاتصال',
  'Organizations': 'المؤسسات',
  'Notes': 'الملاحظات',
  'Tasks': 'المهام',
  'Call Logs': 'سجلات المكالمات',
  'All Views': 'جميع العروض',
  'Public views': 'العروض العامة',
  'Pinned views': 'العروض المثبتة',
  'Help': 'المساعدة',
  'Expand': 'توسيع',
  'Collapse': 'طي'
}

// Helper function to get Arabic labels
const getArabicLabel = (englishLabel) => {
  return arabicLabels[englishLabel] || englishLabel
}

// Toggle help modal
const toggleHelpModal = () => {
  showHelpModal.value = minimize.value ? true : !showHelpModal.value
  minimize.value = !showHelpModal.value
}

// Computed views with Arabic labels
const allViews = computed(() => {
  const links = [
    {
      label: 'Dashboard',
      icon: LucideLayoutDashboard,
      to: 'Dashboard',
      condition: () => isManager(),
    },
    {
      label: 'Leads',
      icon: LeadsIcon,
      to: 'Leads',
    },
    {
      label: 'Deals',
      icon: DealsIcon,
      to: 'Deals',
    },
    {
      label: 'Contacts',
      icon: ContactsIcon,
      to: 'Contacts',
    },
    {
      label: 'Organizations',
      icon: OrganizationsIcon,
      to: 'Organizations',
    },
    {
      label: 'Notes',
      icon: NoteIcon,
      to: 'Notes',
    },
    {
      label: 'Tasks',
      icon: TaskIcon,
      to: 'Tasks',
    },
    {
      label: 'Call Logs',
      icon: PhoneIcon,
      to: 'Call Logs',
    },
  ]

  let _views = [
    {
      name: getArabicLabel('All Views'),
      hideLabel: true,
      opened: true,
      views: links.filter((link) => {
        if (link.condition) {
          return link.condition()
        }
        return true
      }),
    },
  ]
  
  if (getPublicViews().length) {
    _views.push({
      name: getArabicLabel('Public views'),
      opened: true,
      views: parseView(getPublicViews()),
    })
  }

  if (getPinnedViews().length) {
    _views.push({
      name: getArabicLabel('Pinned views'),
      opened: true,
      views: parseView(getPinnedViews()),
    })
  }
  
  return _views
})

function parseView(views) {
  return views.map((view) => {
    return {
      label: view.label,
      icon: getIcon(view.route_name, view.icon),
      to: {
        name: view.route_name,
        params: { viewType: view.type || 'list' },
        query: { view: view.name },
      },
    }
  })
}

function getIcon(routeName, icon) {
  if (icon) return h('div', { class: 'size-auto' }, icon)

  const iconMap = {
    'Leads': LeadsIcon,
    'Deals': DealsIcon,
    'Contacts': ContactsIcon,
    'Organizations': OrganizationsIcon,
    'Notes': NoteIcon,
    'Call Logs': PhoneIcon,
    default: PinIcon
  }
  
  return iconMap[routeName] || iconMap.default
}

// User and session management
const { user } = sessionStore()
const { users, isManager } = usersStore()
const { isOnboardingStepsCompleted, setUp } = useOnboarding('frappecrm')

// Helper functions for onboarding
async function getFirstLead() {
  let firstLead = localStorage.getItem('firstLead' + user)
  if (firstLead) return firstLead
  return await call('crm.api.onboarding.get_first_lead')
}

async function getFirstDeal() {
  let firstDeal = localStorage.getItem('firstDeal' + user)
  if (firstDeal) return firstDeal
  return await call('crm.api.onboarding.get_first_deal')
}

// Onboarding setup
const showIntermediateModal = ref(false)
const currentStep = ref({})

const steps = reactive([
  {
    name: 'setup_your_password',
    title: 'إعداد كلمة المرور',
    icon: markRaw(SquareAsterisk),
    completed: false,
    onClick: () => {
      minimize.value = true
      showChangePasswordModal.value = true
    },
  },
  {
    name: 'create_first_lead',
    title: 'إنشاء أول عميل محتمل',
    icon: markRaw(LeadsIcon),
    completed: false,
    onClick: () => {
      minimize.value = true
      router.push({ name: 'Leads' })
    },
  },
  {
    name: 'invite_your_team',
    title: 'دعوة فريقك',
    icon: markRaw(InviteIcon),
    completed: false,
    onClick: () => {
      minimize.value = true
      showSettings.value = true
      activeSettingsPage.value = 'Invite User'
    },
    condition: () => isManager(),
  },
  {
    name: 'convert_lead_to_deal',
    title: 'تحويل العميل المحتمل إلى صفقة',
    icon: markRaw(ConvertIcon),
    completed: false,
    dependsOn: 'create_first_lead',
    onClick: async () => {
      minimize.value = true
      currentStep.value = {
        title: 'تحويل العميل المحتمل إلى صفقة',
        buttonLabel: 'تحويل',
        videoURL: '/assets/crm/videos/convertToDeal.mov',
        onClick: async () => {
          showIntermediateModal.value = false
          currentStep.value = {}
          let lead = await getFirstLead()
          if (lead) {
            router.push({ name: 'Lead', params: { leadId: lead } })
          } else {
            router.push({ name: 'Leads' })
          }
        },
      }
      showIntermediateModal.value = true
    },
  },
  // Add more steps with Arabic translations...
])

// Help center articles in Arabic
const articles = ref([
  {
    title: 'مقدمة',
    opened: false,
    subArticles: [
      { name: 'introduction', title: 'المقدمة' },
      { name: 'setting-up', title: 'الإعداد' },
    ],
  },
  {
    title: 'الإعدادات',
    opened: false,
    subArticles: [
      { name: 'profile', title: 'الملف الشخصي' },
      { name: 'custom-branding', title: 'العلامة التجارية المخصصة' },
      { name: 'home-actions', title: 'إجراءات الصفحة الرئيسية' },
      { name: 'invite-users', title: 'دعوة المستخدمين' },
    ],
  },
  {
    title: 'البيانات الرئيسية',
    opened: false,
    subArticles: [
      { name: 'lead', title: 'العميل المحتمل' },
      { name: 'deal', title: 'الصفقة' },
      { name: 'contact', title: 'جهة الاتصال' },
      { name: 'organization', title: 'المؤسسة' },
      { name: 'note', title: 'الملاحظة' },
      { name: 'task', title: 'المهمة' },
      { name: 'call-log', title: 'سجل المكالمة' },
      { name: 'email-template', title: 'قالب البريد الإلكتروني' },
    ],
  },
  // Add more sections...
])

onMounted(async () => {
  await users.promise
  const filteredSteps = steps.filter((step) => {
    if (step.condition) {
      return step.condition()
    }
    return true
  })
  setUp(filteredSteps)
})
</script>

<style scoped>
/* RTL-specific styles */
.space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
  margin-right: calc(0.75rem * var(--tw-space-x-reverse));
  margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse)));
}

/* Custom scrollbar for RTL */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Hover effects */
.group:hover .group-hover\:text-gray-700 {
  color: #374151;
}

.group:hover .group-hover\:bg-purple-50 {
  background-color: #faf5ff;
}
</style>