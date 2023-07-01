<script setup>
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
    <div class="bg-white dark:bg-zinc-900 rounded-xl">
        <Swiper
        :modules="[SwiperAutoplay, SwiperEffectCreative]"
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
                    <h3 class="text-center font-medium text-lg lg:text-xl text-gray-900 dark:text-gray-200 before:content-['“'] after:content-['”']">{{ slide.quote }}</h3>
                    <div class="grid gap-4 justify-items-center">
                        <div class="grid content-center justify-items-center h-14 w-14 rounded-full shadow-md shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                            <NuxtImg :src="slide.avatar" :alt="slide.name" class="w-10 h-10 rounded-full" />
                        </div>
                        <div class="grid gap-1 justify-items-center">
                            <p class="font-medium text-base dark:text-slate-100 text-slate-900">{{ slide.name }}</p>
                            <span class="text-sm text-gray-600 dark:text-gray-200">{{ slide.role }}</span>
                        </div>
                    </div>
                </div>
            </SwiperSlide>
            <SwiperControls />
        </Swiper>
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