<script setup lang="ts">
const slides = ref([
    {
        quote: 'I had the pleasure of mentoring Egwu during his internship at a company I worked at. Egwu was a great guy to work with as he possesses a very sharp mind and is always willing to contribute his quota to the success of a project. Egwu is the right guy for the job when you are looking to "get it done by yesterday"!',
        name: 'Ikemefuna Nwankwo',
        role: 'Software Engineer at Turing',
        avatar: 'https://media.licdn.com/dms/image/C4D03AQFK18ORlbT7vA/profile-displayphoto-shrink_400_400/0/1662359185555?e=1693440000&v=beta&t=X7dWSnvlxw1Gsowq6xKxPjGdt6AQFEp5tXV2mArRJCU'
    },
    {
        quote: "Simply put, he's the best Frontend Developer I know. Makes awesome UI Designs too, I confidently recommend him.",
        name: 'Tochukwu Ojinaka',
        role: 'Back End Developer at Herlabytes',
        avatar: 'https://media.licdn.com/dms/image/D4D03AQEIPN1Fi51H-g/profile-displayphoto-shrink_100_100/0/1667545366333?e=1693440000&v=beta&t=j3oevS0MFsbH3SC9bpivWl8--GTsDnx30CT2g2x0D2s'
    },
    {
        quote: "I and Diala studied together at the FUTO and over the years, I've watched Diala grow as an excellent Front End Developer, Designer, and Crypto Enthusiast. He has shown how diversified he can be with his craft and problem-solving. He is a true gem and can contribute greatly to the vision of any organization.",
        name: 'Victor Onwuzuruike',
        role: 'Ex Snr. Product Designer at PATRICIA',
        avatar: 'https://media.licdn.com/dms/image/C5603AQHUNpae3OChBA/profile-displayphoto-shrink_100_100/0/1598659483943?e=1693440000&v=beta&t=KRD3akyC-yHN-GACiFTRbhjALt4mu1ieeYlrenuulWA'
    },
    {
        quote: 'Egwuchukwu is an amazing soul that understands what it means to deliver quality products. Asides being an amazing front end developer, he also can manage design teams to make sure everything is ready to go. He is also an amazing designer.',
        name: 'Chinaza Icheke',
        role: 'Ex UI/UX Designer at Footium',
        avatar: 'https://media.licdn.com/dms/image/C4D03AQHUZKnmJfLuCA/profile-displayphoto-shrink_100_100/0/1617046019314?e=1693440000&v=beta&t=evulmYh-fhCueMntPO7d9GeThFA7QnfCoHmyvpoli9U'
    },
    {
        quote: 'Egwuchukwu Diala is a fantastic front end developer who is detail-oriented, creative, and never stops learning.',
        name: 'Samuel Ayinla',
        role: 'Product Designer',
        avatar: 'https://media.licdn.com/dms/image/C4D03AQFt4fvAYgEiIg/profile-displayphoto-shrink_100_100/0/1634807547139?e=1693440000&v=beta&t=FxXDmvAXgK_D4jD1Dq-xe3-Yg8mlt1D3tSZxCY2apzI'
    },
])
</script>

<template>
    <div class="flex items-center gap-4 bg-white dark:bg-zinc-900 rounded-xl">
        <!-- <button class="p-2" @click="swiper.slideNext()">
            <Icon name="heroicons:chevron-left-solid" class="w-6 h-6 text-zinc-400 transition group-active:text-zinc-600 dark:group-hover:text-zinc-50 dark:group-active:text-zinc-50"/>
        </button> -->
        <Swiper
        :modules="[SwiperAutoplay, SwiperPagination, SwiperEffectCreative]"
        :slides-per-view="1"
        :loop="true"
        :effect="'creative'"
        :autoplay="{
            delay: 8000,
            disableOnInteraction: true
        }"
        :creative-effect="{
            prev: {
            shadow: false,
            translate: ['-20%', 0, -1]
            },
            next: {
            translate: ['100%', 0, 0]
            }
        }"
        >
            <SwiperSlide
                v-for="(slide, idx) in slides"
                :key="idx"
            >
                <div class="grid gap-8">
                    <h5 class="text-center font-medium text-lg lg:text-xl text-gray-900 dark:text-gray-200 before:content-['“'] after:content-['”']">{{ slide.quote }}</h5>
                    <div class="grid gap-4 justify-items-center">
                        <NuxtImg :src="slide.avatar" class="w-14 h-14 rounded-full" />
                        <div class="grid gap-1 justify-items-center">
                            <p class="font-medium text-base dark:text-slate-100 text-slate-900">{{ slide.name }}</p>
                            <span class="text-sm text-gray-600 dark:text-gray-200">{{ slide.role }}</span>
                        </div>
                    </div>
                </div>
            </SwiperSlide>
        </Swiper>
        <!-- <button typ="button" class="p-2" @click="swiper.slidePrev()">
            <Icon name="heroicons:chevron-right-solid" class="w-6 h-6 text-zinc-400 transition group-active:text-zinc-600 dark:group-hover:text-zinc-50 dark:group-active:text-zinc-50"/>
        </button> -->
    </div>
</template>

<style>
.swiper-slide {
    @apply flex items-center justify-center h-full bg-white dark:bg-zinc-900 !important;
}
.swiper-wrapper {
  min-width: 100vh;
  width: 100vh;
  @apply h-96 lg:h-80;
}
.swiper-cards {
  width: 240px;
  height: 240px;
}
.swiper-cards .swiper-slide {
  border-radius: 6px;
  border: 1px solid black;
}
</style>