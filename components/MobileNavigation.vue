<script setup lang="ts">

</script>

<template>
    <HeadlessPopover v-bind="$attrs">
      <HeadlessPopoverButton class="group flex items-center rounded-full bg-white/90 backdrop-filter px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 dark:hover:ring-white/20 focus:outline-none" v-umami="'Open-Mobile-Menu'">
        Menu
        <Icon name="heroicons:chevron-down-solid" class="ml-3 h-auto text-sm stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400" />
      </HeadlessPopoverButton>
      <HeadlessTransitionRoot>
        <HeadlessTransitionChild
          as="template"
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <HeadlessPopoverOverlay class="fixed min-h-screen top-0 bottom-0 left-0 right-0 inset-0 z-50 bg-zinc-800/40 backdrop-blur-sm dark:bg-black/80" />
        </HeadlessTransitionChild>
        <HeadlessTransitionChild
          as="template"
          enter="duration-300 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-200 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <HeadlessPopoverPanel
            focus v-slot="{ close }"
            class="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-white p-8 ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-zinc-800"
          >
            <div class="flex flex-row-reverse items-center justify-between">
              <HeadlessPopoverButton aria-label="Close menu" class="-m-1 p-1 focus:outline-none" v-umami="'Close-Mobile-Menu'">
                <Icon name="heroicons:x-mark-solid" class="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
              </HeadlessPopoverButton>
              <h2 class="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Explore<sup>✨</sup>
              </h2>
            </div>
            <nav class="mt-6">
              <ul class="-my-2 divide-y divide-zinc-100 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300">
                <MobileNavItem href="/about" @click="close()" v-umami="'View-About-Page'"><span class="text-xs">🧘🏾‍♂️</span> About</MobileNavItem>
                <MobileNavItem href="/work" @click="close()" v-umami="'View-Work-Page'"><span class="text-xs">💼</span> Work</MobileNavItem>
                <MobileNavItem href="/projects" @click="close()" v-umami="'View-Projects-Page'"><span class="text-xs">👨🏽‍💻</span> Projects</MobileNavItem>
                <MobileNavItem href="https://blog.egdiala.dev" target="_blank" @click="close()" v-umami="'View-Blog-Page'"><span class="text-xs">✍🏾</span> Blog</MobileNavItem>
              </ul>
            </nav>
          </HeadlessPopoverPanel>
        </HeadlessTransitionChild>
      </HeadlessTransitionRoot>
    </HeadlessPopover>
</template>

<style scoped>

</style>