<script setup lang="ts">
const mouse = ref<HTMLDivElement | null>()

onMounted(() => {
  window.addEventListener('mousemove', cursor)
  const images = document.querySelectorAll('img')

  images.forEach((image) => {
    image.addEventListener('mouseover', () => {
      mouse.value?.classList.add('blur-me')
    })
    image.addEventListener('mouseleave', () => {
      mouse.value?.classList.remove('blur-me')
    })
  })
});

function cursor(e: MouseEvent) {
  if (mouse.value?.style != undefined) {
    mouse.value!.style.top = `${e.pageY}px`
    mouse.value!.style.left = `${e.pageX}px`
  }
}
</script>

<template>
  <Body class="flex h-full flex-col bg-zinc-50 dark:bg-black">
    <div ref="mouse" class="absolute w-[2rem] h-[2rem] z-[99] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full border-2 dark:border-white border-gray-600"/>
    <div class="fixed inset-0 flex justify-center sm:px-8">
      <div class="flex w-full max-w-7xl lg:px-8">
        <div class="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
      </div>
    </div>
    <div class="relative">
      <Header />
      <main>
        <NuxtPage />
      </main>
      <Footer />
    </div>
  </Body>
</template>

<style>
* {
  @apply cursor-none !important;
}

.blur-me {
  @apply bg-white/10 backdrop-grayscale backdrop-blur-[1px] backdrop-filter scale-150 transition-transform duration-300 ease-out;
}
</style>