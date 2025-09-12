<script setup lang="ts">
import { useMotion } from '@vueuse/motion';

const openResume = async () => {
  await navigateTo('https://docs.google.com/document/d/15QCrsfX5L4zmlZG57Th1hKWDeSjmcpoVhwUlzOWzqWo/edit?tab=t.0', { external: true, open: {
    target: '_blank',
    windowFeatures: {
      width: 500,
      height: 500
    }
  } })
}

interface Resume {
    company: string
    title: string
    logo: string
    start: string
    end: any
    link: string
}

const downloadAnimation = () => ({
  initial: {
    opacity: 0
  },
  visibleOnce: {
    opacity: 1,
    transition: {
      type: 'tween',
      delay: 800,
      duration: 800
    }
  }
})

const resumeAnimation = (i: number) => ({
  initial: {
    opacity: 0
  },
  visibleOnce: {
    opacity: 1,
    transition: {
      type: 'tween',
      delay: 200 * i,
      duration: 800
    }
  }
})

const resume = ref<Resume[]>([
    {
        company: 'Blockless Network',
        title: 'Web3 Frontend Engineer',
        logo: 'v1757717639/portfolio-v3/work/blockless_guzgxq.png',
        start: 'Mar, 2025',
        link: 'https://bless.network/',
        end: {
            label: 'Present',
            dateTime: new Date().getFullYear(),
        },
    },
    {
        company: 'Eigen Explorer',
        title: 'Web3 Frontend Engineer',
        logo: 'v1757716304/portfolio-v3/work/default-img_lfbnvy.png',
        start: 'Mar, 2025',
        link: 'https://www.eigenexplorer.com/',
        end: {
            label: 'Present',
            dateTime: new Date().getFullYear(),
        },
    },
    {
        company: 'Enyata',
        title: 'Senior Frontend Engineer',
        logo: 'v1693016273/portfolio-v3/work/enyata_luugvs.jpg',
        start: 'Feb, 2023',
        end: 'Sep, 2024',
        link: 'https://enyata.com/',
    },
    {
        company: 'BLK Labs',
        title: 'Frontend Engineer',
        logo: 'v1693016273/portfolio-v3/work/blk_fsz6pr.jpg',
        start: 'Apr, 2022',
        end: 'Jul, 2023',
        link: 'https://blklabs.co/',
    },
    {
        company: 'Melli',
        title: 'Frontend Engineer',
        logo: 'v1693016274/portfolio-v3/work/melli_ur6fmt.jpg',
        start: 'May, 2022',
        end: 'Dec, 2022',
        link: 'https://melli.com/',
    },
    {
        company: 'Trail Group',
        title: 'Frontend Developer',
        logo: 'v1693016273/portfolio-v3/work/trail_jyediy.jpg',
        start: 'Aug, 2021',
        end: 'Jan, 2022',
        link: 'https://trail.group/',
    },
    {
        company: 'WayaPayChat',
        title: 'Frontend Developer',
        logo: 'v1714151480/portfolio-v3/work/wayapaychat_rjwxlm.jpg',
        start: 'Jan, 2020',
        end: 'Jan, 2021',
        link: '#',
    },
])

onMounted(() => {
  const resumeItems = document.querySelectorAll('.resume-item')
  const downloadDiv = document.querySelector('.download') as any

  resumeItems.forEach((resumeItem: any, i) => {
    useMotion(resumeItem, resumeAnimation(i))
  })

  useMotion(downloadDiv, downloadAnimation())
})
</script>

<template>
    <div class="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <h2 class="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <Icon name="ph:briefcase-duotone" class="flex-none fill-zinc-100 text-zinc-400 dark:text-zinc-500 dark:fill-zinc-100/10 h-6 w-6" />
        <span class="ml-3">Work</span>
      </h2>
      <ol class="mt-6 space-y-4">
          <li v-for="(role, roleIndex) in resume" :key="roleIndex" class="resume-item flex gap-4 relative">
            <a :href="role.link" :target="role.link === '#' ? '' : '_blank'" class="absolute inset-0"></a>
            <div class="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
              <NuxtImg provider="cloudinary" :src="role.logo" loading="lazy" :alt="role.company" class="rounded-full h-7 w-7" />
            </div>
            <dl class="flex flex-auto flex-wrap gap-x-2">
              <dt class="sr-only">Company</dt>
              <dd class="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {{ role.company }}
              </dd>
              <dt class="sr-only">Role</dt>
              <dd class="text-xs text-zinc-500 dark:text-zinc-400">
                {{ role.title }}
              </dd>
              <dt class="sr-only">Date</dt>
              <dd
                class="ml-auto text-xs text-zinc-400 dark:text-zinc-500"
                :aria-label="`${role.start} until ${role.end}`"
              >
                <time :dateTime="role.start">
                  {{ role.start }}
                </time>&nbsp;
                <span aria-hidden="true">—</span>&nbsp;
                <time :dateTime="`${role.end?.dateTime ?? role.end}`">
                  {{ role.end?.label ?? role.end }}
                </time>
              </dd>
            </dl>
          </li>
      </ol>
      <div class="download">
        <Button variant="secondary" class="group mt-6 w-full" @click="openResume" v-umami="'View-Resume'">
          View Resume
          <Icon name="heroicons:arrow-right-20-solid" class="h-4 w-4 text-zinc-400 transition duration-300 ease-out group-hover:-rotate-45 group-active:text-zinc-600 dark:group-hover:text-zinc-50 dark:group-active:text-zinc-50" />
        </Button>
      </div>
    </div>
</template>

<style scoped>

</style>