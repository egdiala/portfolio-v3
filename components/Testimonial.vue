<script setup>
const slides = ref([
    {
        quote: 'I had the pleasure of mentoring Egwu during his internship at a company I worked at. Egwu was a great guy to work with as he possesses a very sharp mind and is always willing to contribute his quota to the success of a project. Egwu is the right guy for the job when you are looking to "get it done by yesterday"!',
        name: 'Ikemefuna Nwankwo',
        role: 'Software Engineer at Turing',
        avatar: 'v1693016248/portfolio-v3/images/ikemefuna_nwankwo_b1da9b.jpg'
    },
    {
        quote: "Simply put, he's the best Frontend Developer I know. Makes awesome UI Designs too, I confidently recommend him.",
        name: 'Tochukwu Ojinaka',
        role: 'Back End Developer at Herlabytes',
        avatar: 'v1693016248/portfolio-v3/images/tochukwu_ojinaka_kjuyvi.jpg'
    },
    {
        quote: "I highly recommend Stephen as an outstanding team member to collaborate with. His willingness to listen, attention to detail, and meticulous implementation of designs make him a valuable asset in any project. Working with him has been a pleasure, and I believe he would be a great addition to any team.",
        name: 'Cynthia Ilojeme',
        role: 'Senior Frontend Engineer at Enyata',
        avatar: 'v1702848389/portfolio-v3/images/1687521429617_xs9uwu.jpg'
    },
    {
        quote: "I and Diala studied together at the FUTO and over the years, I've watched Diala grow as an excellent Front End Developer, Designer, and Crypto Enthusiast. He has shown how diversified he can be with his craft and problem-solving. He is a true gem and can contribute greatly to the vision of any organization.",
        name: 'Victor Onwuzuruike',
        role: 'Ex Snr. Product Designer at PATRICIA',
        avatar: 'v1693016248/portfolio-v3/images/victor_onwuzuruike_ph61nc.jpg'
    },
    {
        quote: "Stephen is a superb Frontend Engineer. He pays a lot of attention to little details, which is one of the hallmarks of software development. Much more, he is highly reliable, efficient, and takes ownership of his tasks. Every software development team needs a Stephen.",
        name: 'Elizabeth Ajao',
        role: 'Product Manager',
        avatar: 'v1702848377/portfolio-v3/images/elizabeth_ajao_hojkej.jpg'
    },
    {
        quote: 'Egwuchukwu is an amazing soul that understands what it means to deliver quality products. Asides being an amazing front end developer, he also can manage design teams to make sure everything is ready to go. He is also an amazing designer.',
        name: 'Chinaza Icheke',
        role: 'Ex UI/UX Designer at Footium',
        avatar: 'v1693016248/portfolio-v3/images/chinaza_icheke_fzaloy.jpg'
    },
    {
        quote: 'Egwuchukwu Diala is a fantastic front end developer who is detail-oriented, creative, and never stops learning.',
        name: 'Samuel Ayinla',
        role: 'Product Designer',
        avatar: 'v1693016248/portfolio-v3/images/samuel_ayinla_ncbwyl.jpg'
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
                <div class="grid gap-4 md:gap-8 w-full md:max-w-screen-sm h-fit">
                    <h3 class="text-center font-medium text-lg lg:text-xl text-gray-900 dark:text-gray-200 before:content-['“'] after:content-['”']">{{ slide.quote }}</h3>
                    <div class="grid gap-2 md:gap-4 justify-items-center">
                        <div class="grid content-center justify-items-center h-14 w-14 rounded-full shadow-md shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                            <NuxtImg provider="cloudinary" :src="slide.avatar" :alt="slide.name" loading="lazy" class="w-12 h-12 rounded-full" />
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