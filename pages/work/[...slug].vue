<script setup lang="ts">
const route = useRoute()

const { data } = await useAsyncData(
    route.path,
    () => queryContent().where({ _path: route.path }).findOne()
);
</script>

<template>
    <Container outer-class="mt-24 md:mt-28">
        <div class="dark:text-white text-black mx-auto max-w-7xl px-4 sm:px-6 lg:px-0 h-full">
            <div class="flex items-center justify-between">
                <NuxtLink to="/work" class="group flex items-center gap-2">
                    <Icon name="heroicons:arrow-left-solid" class="h-4 w-4 text-zinc-400 transition-all duration-300 ease-out dark:group-hover:text-zinc-50" />
                    <span class="text-base font-medium text-zinc-400 transition-all duration-300 ease-out dark:group-hover:text-zinc-50">back</span>
                </NuxtLink>
                <div>{{ data?.title }}</div>
                <div>{{ data?.author }}</div>
            </div>
        </div>
        <div class="content-doc mx-auto max-w-7xl px-4 sm:px-6 lg:px-0 h-full">
            <ContentRenderer :value="data" />
        </div>
    </Container>
</template>

<style scoped>
.content-doc :deep(p) {
    @apply text-green-600;
}
</style>