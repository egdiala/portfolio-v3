<script setup lang="ts">
interface Resume {
    company: string
    title: string
    logo: string
    start: string
    end: any
}

const resume = ref<Resume[]>([
    {
        company: 'Enyata',
        title: 'Software Engineer',
        logo: 'https://media.licdn.com/dms/image/C4E0BAQHiTyXJWwbgfw/company-logo_100_100/0/1615975251861?e=1695859200&v=beta&t=grjfapp49IfiJ1uFJvnPhc7lgfp8RJT5q0fqLUugzVU',
        start: '2023',
        end: {
            label: 'Present',
            dateTime: new Date().getFullYear(),
        },
    },
    {
        company: 'BLK Labs',
        title: 'Frontend Engineer',
        logo: 'https://media.licdn.com/dms/image/C4E0BAQFz12TYSVSulQ/company-logo_100_100/0/1603981998464?e=1695859200&v=beta&t=u0C80MZU70iIR8KONFb6If75B29yTx97PS3EnEc1mvs',
        start: 'Apr, 2022',
        end: {
            label: 'Present',
            dateTime: new Date().getFullYear(),
        },
    },
    {
        company: 'Melli',
        title: 'Frontend Engineer',
        logo: 'https://media.licdn.com/dms/image/C4E0BAQE8rU3KsgDDTg/company-logo_100_100/0/1660209967326?e=1695859200&v=beta&t=OxNHpRWjkmpVQpde9bHojVmv1EJ_2q_kwoQBO4Q8dCc',
        start: 'May, 2022',
        end: 'Dec, 2022',
    },
    {
        company: 'Trail Group',
        title: 'Frontend Developer',
        logo: 'https://media.licdn.com/dms/image/C4E0BAQE7HQrc42_Elg/company-logo_100_100/0/1618438168679?e=1695859200&v=beta&t=ogzYHqzR_88vog5a0z62eBcCsBXgX52NNXGt6mx_bP4',
        start: 'Aug, 2021',
        end: 'Jan, 2022',
    },
])
</script>

<template>
    <div class="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <h2 class="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <Icon name="ph:briefcase-duotone" class="flex-none fill-zinc-100 text-zinc-400 dark:text-zinc-500 dark:fill-zinc-100/10 h-6 w-6" />
        <span class="ml-3">Work</span>
      </h2>
      <ol class="mt-6 space-y-4">
          <li v-for="(role, roleIndex) in resume" :key="roleIndex" class="flex gap-4">
            <div class="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
              <NuxtImg :src="role.logo" alt="" class="rounded-full h-7 w-7" />
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
      <Button variant="secondary" class="group mt-6 w-full">
        Download CV
        <Icon name="heroicons:arrow-down-20-solid" class="h-4 w-4 text-zinc-400 transition group-active:text-zinc-600 dark:group-hover:text-zinc-50 dark:group-active:text-zinc-50" />
      </Button>
    </div>
</template>

<style scoped>

</style>