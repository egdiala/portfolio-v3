<script setup lang="ts">
const mouse = ref<HTMLDivElement | null>()
const splash = ref(true)

useHead({
  bodyAttrs: {
    class: 'flex h-screen flex-col bg-zinc-50 dark:bg-black scrollbar-hide'
  },
  htmlAttrs: {
    lang: 'en'
  }
})

useSchemaOrg([
  definePerson({
    name: 'Egwuchukwu Stephen Diala',
    image: 'https://res.cloudinary.com/egdiala/image/upload/v1693016247/portfolio-v3/images/egdiala-mini.jpg',
    sameAs: [
      'https://github.com/egdiala', 'https://www.linkedin.com/in/egwuchukwu-diala/'
    ]
  }),
  defineWebSite({/* ... */}),
  defineWebPage(),
])

onMounted(() => {
  if (process.client) {
    window.addEventListener('mousemove', cursor)
  }
  setTimeout(() => {
    splash.value = false
  }, 4000);
});

function cursor(e: MouseEvent) {
  if (mouse.value?.style != undefined) {
    mouse.value!.style.top = `${e.pageY}px`
    mouse.value!.style.left = `${e.pageX}px`
  }
}
</script>

<template>
  <RobotMeta />
  <SeoKit/>
  <div v-if="!splash" ref="mouse" id="mouse" class="absolute w-[2rem] hidden lg:flex h-[2rem] z-[99] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full border-2 dark:border-white border-gray-600"/>
  <div v-show="!splash" v-motion-fade-visible-once class="fixed inset-0 flex justify-center sm:px-8">
    <div class="flex w-full max-w-7xl lg:px-8">
      <div class="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
    </div>
  </div>
  <Splash v-if="splash" />
  <div v-if="!splash" class="relative">
    <Header />
    <main>
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<style>
* {
  @apply lg:cursor-none !important;
   
  >body {
    @apply transition-colors duration-500;
  }
}

.blur-me {
  @apply bg-white/10 backdrop-grayscale backdrop-blur-[1px] backdrop-filter scale-150 transition-transform duration-300 ease-out;
}
</style>