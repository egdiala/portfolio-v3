<script setup lang="ts">
const cImplementationProps = defineProps<{ slides: string[]; }>()

const { state, next, prev } = useCycleList(cImplementationProps.slides)

const slideshow = ref<HTMLDivElement>()

const animation = {
  initial: {
    y: 24,
    opacity: 0
  },
  visibleOnce: {
    y: 0,
    opacity: 1,
    transition: {
      ease: 'easeOut',
      delay: 300,
      duration: 800,
    }
  }
}

onMounted(() => {
    const { pause, resume } = useIntervalFn(() => {
        next();
    }, 3000);

    slideshow.value?.addEventListener('mouseenter', pause)
    slideshow.value?.addEventListener('mouseleave', resume)
});
</script>

<template>
  <Container outer-class="mt-5 md:mt-10">
    <div v-motion="animation" class="mx-auto max-w-2xl lg:max-w-3xl">
        <div ref="slideshow" class="flex w-full h-64 md:h-[26rem] lg:h-[30rem] rounded-xl md:rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
            <div class="absolute z-10 group opacity-0 hover:opacity-100 transition-opacity ease-in duration-300 bg-gray-500/50 flex flex-col justify-center left-0 inset-y-0 px-6" @click="prev()">
                <Icon name="heroicons:chevron-left-solid" class="w-6 h-6 text-zinc-400 transition dark:group-hover:text-zinc-50"/>
            </div>
            <Transition
                enter-active-class="duration-700 ease-out"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="duration-700 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                    <NuxtImg provider="cloudinary" :src="state" :key="state" :alt="state.split('/').at(-1)?.split('.')[0]" loading="lazy" class="absolute w-full h-64 md:h-[26rem] lg:h-[30rem] rounded-xl md:rounded-3xl" />
            </Transition>
            <div class="absolute z-10 group opacity-0 hover:opacity-100 transition-opacity ease-in duration-300 bg-gray-500/50 flex flex-col justify-center top-0 right-0 bottom-0 px-6" @click="next()">
                <Icon name="heroicons:chevron-right-solid" class="w-6 h-6 text-zinc-400 transition dark:group-hover:text-zinc-50"/>
            </div>
        </div>
    </div>
  </Container>
</template>

<style scoped>

</style>