export type Moment = {
  id: string
  title: string
  /** The line under the title in the home list. */
  summary: string
  /** Seconds into the episode. */
  start: number
  end: number
  /** What's said between `start` and `end`, cleaned up from the auto-generated transcript. */
  transcript: Array<{ speaker: "Samuel" | "Stephen"; text: string }>
}

/** "7:57" → 477, so times can be typed the way a player shows them. */
function at(time: string) {
  const [minutes, seconds] = time.split(":").map(Number)
  return minutes * 60 + seconds
}

export const EPISODE = {
  show: "Code & Canvas",
  title: "Should Designers Learn Code? Should Dev Learn Design?",
  number: 1,
  publishedAt: "2026-02-23",
  duration: 1271,
  // The show's own feed URL, so listens still count for the show.
  audio:
    "https://anchor.fm/s/10cd00270/podcast/play/115935549/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2026-1-23%2F418677159-44100-2-dd161f80b02f2.m4a",
  cover: "/said-out-loud/code-and-canvas-e1.jpg",
  summary:
    "I was the first guest on Code & Canvas, talking about whether designers should code, whether developers should design, and why I think it comes down to taste.",
  links: [
    { label: "Spotify", href: "https://open.spotify.com/episode/2emuhqtHgHHkTUO3S3LrHE" },
    {
      label: "Apple Podcasts",
      href: "https://podcasts.apple.com/us/podcast/should-designers-learn-code-should-dev-learn-design/id1879750147?i=1000751174576",
    },
  ],
}

export const MOMENTS: Moment[] = [
  {
    id: "why-34px-isnt-36px",
    title: "Why 34px isn't 36px",
    summary: "What I do when a 36px button turns up at 34px on one screen.",
    start: at("7:57"),
    end: at("9:35"),
    transcript: [
      {
        speaker: "Stephen",
        text: "I've been in this position quite a few number of times, and one of the most frequent occurring scenarios is when a designer modifies a variant of a component on a frame that they are designing. For example, if they create a button component and give it a different size variant of, let's say, large, medium, and small, right, and then you have your medium-sized button, which is of height, 36 pixels, and then that same variant they are using is on a particular screen, but then you notice that the height isn't 36 pixels, it is actually 34 or 38 pixels. And then you realize that the designer did it that way, primarily because they wanted to fit what they were trying to achieve on that screen, right?",
      },
      {
        speaker: "Stephen",
        text: "So in that scenario, what I'll do is to point it out to the designer and also explain to the designer why this would be a problem moving forward for me because of consistency issues. And I would do that by explaining how I am building out the components on the front-end side so that the designer can have a clearer understanding of where I'm coming from. So by doing that, the designer is able to either create a new variant of that component, or they use an actual variant, the right variant, of the component that was created.",
      },
    ],
  },
  {
    id: "design-the-empty-state",
    title: "Design the empty state",
    summary: "The one development concept I'd want every product designer to understand.",
    start: at("10:02"),
    end: at("10:56"),
    transcript: [
      {
        speaker: "Stephen",
        text: "I think one core concept product designers should understand is how the front-end interfaces react, or rather, interact with back-end API services. That's one major thing that product designers would need to understand. And this can help in different scenarios. For example, designing loading states when API requests are currently in progress, or also having the intent to design empty states when an API request returns an empty array of a collection to be displayed on the front end.",
      },
      {
        speaker: "Samuel",
        text: "Okay, so basically, designers should be more conscious of different use cases and make provisions for them in their designs.",
      },
      { speaker: "Stephen", text: "Exactly, yeah." },
    ],
  },
  {
    id: "it-comes-down-to-taste",
    title: "It comes down to taste",
    summary: "Why I think design engineering is about taste, not who codes more.",
    start: at("13:05"),
    end: at("13:50"),
    transcript: [
      {
        speaker: "Stephen",
        text: "I don't think it's a matter of designers not coding enough, or developers not designing enough. I think it basically has to do with taste, right? And yes, I feel like design engineering is the future for both developers and also designers. And when I talk about this, I talk about the ability to craft beautiful interfaces and animations that look good and resonates with a particular product. So yes, that's most likely the reason why companies nowadays look out for design engineers when hiring.",
      },
    ],
  },
]
