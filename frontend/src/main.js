import './index.css'
import './assets/rtl-charts.css'

import { createApp } from 'vue'

// Polyfill for Array.includes for older browsers
if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement, fromIndex) {
    if (this == null) {
      throw new TypeError('Array.prototype.includes called on null or undefined');
    }
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(fromIndex) || 0;
    var k = n >= 0 ? n : Math.max(len + n, 0);
    while (k < len) {
      if (O[k] === searchElement) {
        return true;
      }
      k++;
    }
    return false;
  };
}

// IMMEDIATE BLOCKING: Prevent ERPNext Odoo Theme from interfering with CRM
// This must run before any other scripts to ensure it takes effect
(function() {
  // Block immediately on CRM/HRMS paths
  if (window.location.pathname.includes('/crm') || window.location.pathname.includes('/hrms')) {
    // Create a global blocking flag
    window.CRM_BLOCK_ODOO_THEME = true
    
    // Override jQuery append/prepend methods to filter out module grid elements
    if (typeof $ !== 'undefined') {
      const originalAppend = $.fn.append
      const originalPrepend = $.fn.prepend
      const originalHtml = $.fn.html
      
      $.fn.append = function(content) {
        if (typeof content === 'string' && (content.includes('module-grid') || content.includes('odoo-module-grid'))) {
          console.log('Blocked module grid append on CRM')
          return this
        }
        return originalAppend.call(this, content)
      }
      
      $.fn.prepend = function(content) {
        if (typeof content === 'string' && (content.includes('module-grid') || content.includes('odoo-module-grid'))) {
          console.log('Blocked module grid prepend on CRM')
          return this
        }
        return originalPrepend.call(this, content)
      }
      
      $.fn.html = function(content) {
        if (typeof content === 'string' && (content.includes('module-grid') || content.includes('odoo-module-grid'))) {
          console.log('Blocked module grid html on CRM')
          return this
        }
        return originalHtml.call(this, content)
      }
    }
    
    // Block DOM manipulation methods
    const originalInsertAdjacentHTML = Element.prototype.insertAdjacentHTML
    Element.prototype.insertAdjacentHTML = function(position, text) {
      if (text && typeof text === 'string' && (text.includes('module-grid') || text.includes('odoo-module-grid'))) {
        console.log('Blocked module grid insertAdjacentHTML on CRM')
        return
      }
      return originalInsertAdjacentHTML.call(this, position, text)
    }
    
    const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML')
    Object.defineProperty(Element.prototype, 'innerHTML', {
      set: function(value) {
        if (value && typeof value === 'string' && (value.includes('module-grid') || value.includes('odoo-module-grid'))) {
          console.log('Blocked module grid innerHTML on CRM')
          return
        }
        return originalInnerHTML.set.call(this, value)
      },
      get: originalInnerHTML.get
    })
  }
})()

// Set RTL direction for Arabic
const isRTL = document.documentElement.lang === 'ar' || 
              document.documentElement.dir === 'rtl' || 
              navigator.language.startsWith('ar')
if (isRTL) {
  document.documentElement.dir = 'rtl'
  document.documentElement.lang = 'ar'
}
import { createPinia } from 'pinia'
import { createDialog } from './utils/dialogs'
import { initSocket } from './socket'
import router from './router'
import translationPlugin from './translation'
import { posthogPlugin } from './telemetry'
import App from './App.vue'

import {
  FrappeUI,
  Button,
  Input,
  TextInput,
  FormControl,
  ErrorMessage,
  Dialog,
  Alert,
  Badge,
  setConfig,
  frappeRequest,
  FeatherIcon,
} from 'frappe-ui'

let globalComponents = {
  Button,
  TextInput,
  Input,
  FormControl,
  ErrorMessage,
  Dialog,
  Alert,
  Badge,
  FeatherIcon,
}

// create a pinia instance
let pinia = createPinia()

let app = createApp(App)

setConfig('resourceFetcher', frappeRequest)
app.use(FrappeUI)
app.use(pinia)
app.use(router)
app.use(translationPlugin)
app.use(posthogPlugin)

// Enhanced ERPNext Odoo Theme blocking with immediate and delayed protection
function blockERPNextOdooTheme() {
  // Check if we should block (CRM/HRMS paths or global flag set)
  const shouldBlock = window.CRM_BLOCK_ODOO_THEME || 
                     window.location.pathname.includes('/crm') || 
                     window.location.pathname.includes('/hrms')
  
  if (!shouldBlock) return
  
  // Block the theme object if it exists
  if (window.erpnext_odoo_theme) {
    // Completely disable the theme object
    window.erpnext_odoo_theme = {
      desk: {
        init: function() {
          console.log('ERPNext Odoo Theme initialization completely blocked on CRM/HRMS')
          return false
        },
        create_module_tiles: function() {
          console.log('ERPNext Odoo Theme module tiles creation blocked on CRM/HRMS')
          return false
        },
        create_module_grid: function() {
          console.log('ERPNext Odoo Theme module grid creation blocked on CRM/HRMS')
          return $('<div></div>')
        }
      }
    }
    
    // Override any existing functions
    if (window.erpnext_odoo_theme.desk) {
      const originalDesk = window.erpnext_odoo_theme.desk
      Object.keys(originalDesk).forEach(key => {
        if (typeof originalDesk[key] === 'function') {
          originalDesk[key] = function(...args) {
            console.log(`ERPNext Odoo Theme ${key} function blocked on CRM/HRMS`)
            return false
          }
        }
      })
    }
  }
  
  // Block any global functions that might create module grids
  if (typeof window.createModuleGrid === 'function') {
    window.createModuleGrid = function() {
      console.log('Global createModuleGrid function blocked on CRM/HRMS')
      return false
    }
  }
  
  if (typeof window.createModuleTiles === 'function') {
    window.createModuleTiles = function() {
      console.log('Global createModuleTiles function blocked on CRM/HRMS')
      return false
    }
  }
}

// Run blocking immediately
blockERPNextOdooTheme()

// Also run when DOM is ready in case theme loads later
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', blockERPNextOdooTheme)
} else {
  blockERPNextOdooTheme()
}

// Run periodically to catch any late-loading theme scripts
setInterval(blockERPNextOdooTheme, 1000)

// Aggressive DOM observer to remove any module grid elements that might still appear
if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Remove any module grid elements
          const moduleGrids = node.querySelectorAll ? 
            node.querySelectorAll('.module-grid, .odoo-module-grid, [class*="module-grid"], [class*="odoo-module"], .module-grid-header, .module-tiles-container') : []
          
          moduleGrids.forEach((element) => {
            element.remove()
            console.log('Removed module grid element from DOM')
          })
          
          // Also check if the node itself is a module grid
          if (node.classList && (
            node.classList.contains('module-grid') || 
            node.classList.contains('odoo-module-grid') ||
            node.classList.contains('module-grid-header') ||
            node.classList.contains('module-tiles-container') ||
            Array.from(node.classList).some(cls => cls.includes('module-grid') || cls.includes('odoo-module'))
          )) {
            node.remove()
            console.log('Removed module grid node from DOM')
          }
          
          // Check for text content that matches module grid patterns
          if (node.textContent && (
            node.textContent.includes('Applications') ||
            node.textContent.includes('Access your ERP modules and tools')
          )) {
            // Check if this text is within a module grid context
            let parent = node.parentElement
            while (parent && parent !== document.body) {
              if (parent.classList && (
                parent.classList.contains('module-grid') ||
                parent.classList.contains('odoo-module-grid') ||
                parent.classList.contains('module-grid-header') ||
                Array.from(parent.classList).some(cls => cls.includes('module-grid') || cls.includes('odoo-module'))
              )) {
                parent.remove()
                console.log('Removed module grid parent containing blocked text')
                break
              }
              parent = parent.parentElement
            }
          }
        }
      })
    })
  })
  
  // Start observing when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true })
    })
  } else {
    observer.observe(document.body, { childList: true, subtree: true })
  }
  
  // Also run a periodic cleanup to catch any elements that might slip through
  setInterval(() => {
    const moduleGrids = document.querySelectorAll('.module-grid, .odoo-module-grid, [class*="module-grid"], [class*="odoo-module"], .module-grid-header, .module-tiles-container')
    moduleGrids.forEach((element) => {
      element.remove()
      console.log('Periodic cleanup: Removed module grid element')
    })
  }, 2000)
}

for (let key in globalComponents) {
  app.component(key, globalComponents[key])
}

app.config.globalProperties.$dialog = createDialog

let socket
if (import.meta.env.DEV) {
  frappeRequest({ url: '/api/method/crm.www.crm.get_context_for_dev' }).then(
    (values) => {
      for (let key in values) {
        window[key] = values[key]
      }
      socket = initSocket()
      app.config.globalProperties.$socket = socket
      app.mount('#app')
    },
  )
} else {
  socket = initSocket()
  app.config.globalProperties.$socket = socket
  app.mount('#app')
}

if (import.meta.env.DEV) {
  window.$dialog = createDialog
}

