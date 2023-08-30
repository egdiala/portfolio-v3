<script setup lang="ts">
const target = ref<HTMLElement>()

const leave = ref({
    opacity: 0,
    y: -70,
    transition: {
        type: 'spring',
        delay: 200,
        stiffness: 100,
        damping: 15,
        mass: 1,
    }
})

const motionInstance = useMotion(target, {
    initial: {
        opacity: 0,
        y: 70,
    },
    enter: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            delay: 200,
            stiffness: 96,
            damping: 6,
            mass: 1,
        }
    }
})

onMounted(async () => {
    setTimeout(() => {
        motionInstance.apply(leave.value)
    }, 3000);
});
</script>

<template>
    <div class="h-screen">
        <div v-motion-slide-visible-once-bottom class="title grid h-full justify-items-center content-center">
            <h1 ref="target" class="font-semibold text-3xl dark:text-white text-zinc-800 overflow-hidden">
                Hello!
            </h1>
        </div>
    </div>
</template>

<style scoped>

</style>