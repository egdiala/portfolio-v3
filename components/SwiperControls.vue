<script setup lang="ts">
const swiper = useSwiper()
</script>

<template>
  <div class="flex items-center justify-center gap-4 mt-1">
    <button type="button" aria-label="slide-left" class="p-2 rounded-full transition hover:bg-zinc-50 dark:hover:bg-zinc-600" @click="swiper.slidePrev()" v-umami="'View-Previous-Testimonial'">
      <Icon name="heroicons:chevron-left-solid" class="w-6 h-6 text-zinc-400 transition dark:hover:text-zinc-50"/>
    </button>
    <button type="button" aria-label="slide-right" class="p-2 rounded-full transition hover:bg-zinc-50 dark:hover:bg-zinc-600" @click="swiper.slideNext()" v-umami="'View-Next-Testimonial'">
      <Icon name="heroicons:chevron-right-solid" class="w-6 h-6 text-zinc-400 transition dark:hover:text-zinc-50"/>
    </button>
  </div>
</template>
