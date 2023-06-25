<script setup lang="ts">
interface ContainerProps {
  innerClass?: string
  outerClass?: string
}
defineProps<ContainerProps>()

const outer = ref()
const inner = ref()
</script>

<template>
    <div ref="outer" :class="`sm:px-8 ${outerClass ?? ''}`">
      <div class="mx-auto max-w-7xl lg:px-8">
        <!--inner container-->
        <div ref="inner" :class="`relative px-4 sm:px-8 lg:px-12 ${innerClass ?? ''}`">
            <div class="mx-auto max-w-2xl lg:max-w-5xl">
                <slot />
            </div>
        </div>
      </div>
    </div>
</template>

<style scoped>

</style>