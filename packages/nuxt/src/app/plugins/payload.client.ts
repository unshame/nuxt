import { parseURL } from 'ufo'
import { defineNuxtPlugin } from '#app/nuxt'
import { loadPayload } from '#app/composables/payload'
import { useRouter } from '#app/composables/router'

export default defineNuxtPlugin({
  name: 'nuxt:payload',
  setup (nuxtApp) {
    // TODO: Support dev
    // TODO: in hybrid mode, don't fetch payloads for routes which are not prerendered

    // Load payload into cache
    nuxtApp.hooks.hook('link:prefetch', async (url) => {
      if (!parseURL(url).protocol) {
        await loadPayload(url)
      }
    })

    // Load payload after middleware & once final route is resolved
    useRouter().beforeResolve(async (to, from) => {
      if (to.path === from.path) { return }
      const payload = await loadPayload(to.path)
      if (!payload) { return }
      Object.assign(nuxtApp.static.data, payload.data)
    })
  }
})
