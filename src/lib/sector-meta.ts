export type SectorMeta = {
  title: string;
  description: string;
  intro: string;
  faq: { q: string; a: string }[];
  related: { label: string; slug: string }[];
};

export const SECTOR_META: Record<string, SectorMeta> = {
  "ai": {
    title: "AI & Machine Learning Webinars in India",
    description:
      "Discover free AI, machine learning, and GenAI webinars in India. Live online events on LLMs, deep learning, data science, and more — updated daily on WebinX.",
    intro:
      "India's AI ecosystem is growing faster than anywhere else in the world. Whether you are a student exploring machine learning for the first time, a developer building with LLMs, or a product leader evaluating AI strategy, these webinars connect you with practitioners who are solving real problems. Every event listed here is free and online.",
    faq: [
      {
        q: "Are these AI webinars free to attend?",
        a: "Yes. Every webinar listed on WebinX is free to attend. Click 'Register' on any event to reserve your spot directly with the organiser.",
      },
      {
        q: "What AI topics do these webinars cover?",
        a: "Topics include machine learning fundamentals, generative AI, large language models (LLMs), computer vision, NLP, MLOps, and AI product strategy.",
      },
      {
        q: "How often are new AI webinars added?",
        a: "WebinX ingests new events daily from platforms like Eventbrite, Meetup, KonfHub, and community sources. The list is always current.",
      },
    ],
    related: [
      { label: "Technology", slug: "technology" },
      { label: "Data Science", slug: "data" },
      { label: "Startups", slug: "startup" },
      { label: "Finance", slug: "finance" },
    ],
  },

  "finance": {
    title: "Finance & Fintech Webinars in India",
    description:
      "Find free finance, investing, and fintech webinars in India. Online events on stock markets, personal finance, trading, and financial planning — updated daily.",
    intro:
      "Finance literacy is one of the most in-demand skills in India right now. From retail investors learning about the stock market to fintech founders navigating regulation, these webinars bring expert knowledge directly to your screen. All events are free, online, and curated for relevance.",
    faq: [
      {
        q: "Do I need a finance background to attend?",
        a: "No. These webinars range from beginner-level personal finance sessions to advanced topics like derivatives and venture funding. Filter by title to find the right level.",
      },
      {
        q: "Are these webinars SEBI or NISM certified?",
        a: "WebinX lists events from various organisers. Certification details are provided by each organiser on their own registration page.",
      },
      {
        q: "Can I attend finance webinars on a mobile device?",
        a: "Yes. Most organisers use Zoom, Google Meet, or similar platforms that work on any device.",
      },
    ],
    related: [
      { label: "Business", slug: "business" },
      { label: "Startups", slug: "startup" },
      { label: "Marketing", slug: "marketing" },
      { label: "AI & Data", slug: "ai" },
    ],
  },

  "marketing": {
    title: "Marketing & Growth Webinars in India",
    description:
      "Free marketing, SEO, and growth webinars in India. Online events on digital marketing, social media, content strategy, and performance marketing — updated daily.",
    intro:
      "Digital marketing is one of the fastest-moving fields in India. These webinars cover everything from SEO and paid ads to brand strategy and content creation. Whether you are a solo founder, a marketer at a startup, or building a career in growth, there is a session here for you. All events are free and accessible from anywhere.",
    faq: [
      {
        q: "What marketing topics are covered?",
        a: "Topics include SEO, Google Ads, Meta advertising, email marketing, content strategy, influencer marketing, product-led growth, and marketing analytics.",
      },
      {
        q: "Are these webinars live or recorded?",
        a: "Most events listed are live. Some organisers share recordings after the event — check the registration page for details.",
      },
      {
        q: "Can agencies and freelancers attend?",
        a: "Absolutely. These events are open to anyone. Many sessions are specifically designed for freelancers and small agency teams.",
      },
    ],
    related: [
      { label: "Business", slug: "business" },
      { label: "Technology", slug: "technology" },
      { label: "Startups", slug: "startup" },
      { label: "HR & People", slug: "hr" },
    ],
  },

  "startup": {
    title: "Startup & Entrepreneurship Webinars in India",
    description:
      "Free startup and entrepreneurship webinars in India. Online events on fundraising, product, growth, and founder skills — updated daily on WebinX.",
    intro:
      "India now has one of the largest startup ecosystems in the world. These webinars are built for founders at every stage — from ideation to Series B. Topics range from investor pitching and product-market fit to legal structure and team building. Every event is free and hosted online so you can learn from anywhere in the country.",
    faq: [
      {
        q: "Are there webinars specifically for first-time founders?",
        a: "Yes. Many sessions on WebinX are targeted at early-stage founders and cover topics like validating ideas, building an MVP, and finding your first customers.",
      },
      {
        q: "Can I find webinars by investors or VCs?",
        a: "Yes. WebinX aggregates events from across the ecosystem including sessions hosted by VCs, accelerators, and angel networks.",
      },
      {
        q: "Are these events only for tech startups?",
        a: "No. WebinX covers startups across sectors including D2C, SaaS, fintech, healthtech, edtech, and more.",
      },
    ],
    related: [
      { label: "Finance", slug: "finance" },
      { label: "Marketing", slug: "marketing" },
      { label: "Technology", slug: "technology" },
      { label: "Business", slug: "business" },
    ],
  },

  "healthcare": {
    title: "Healthcare & MedTech Webinars in India",
    description:
      "Free healthcare, medical, and healthtech webinars in India. Online events for doctors, health professionals, and medtech founders — updated daily on WebinX.",
    intro:
      "Healthcare in India is being transformed by technology, policy changes, and a new generation of health-focused founders. These webinars cover clinical topics, digital health, telemedicine, medical devices, and health policy. Whether you are a practitioner, a researcher, or building a healthtech startup, these free online events keep you ahead of the curve.",
    faq: [
      {
        q: "Are these webinars only for medical professionals?",
        a: "No. While many sessions are designed for doctors and nurses, there are also events for healthtech entrepreneurs, investors, and health-conscious individuals.",
      },
      {
        q: "Do these webinars offer CME credits?",
        a: "Some organisers provide CME or CPD credits. This is noted on the event's registration page — WebinX does not issue credits directly.",
      },
      {
        q: "What healthtech topics are covered?",
        a: "Topics include telemedicine, AI diagnostics, hospital operations, health data, regulatory compliance, and medical device innovation.",
      },
    ],
    related: [
      { label: "Technology", slug: "technology" },
      { label: "AI & Data", slug: "ai" },
      { label: "Startups", slug: "startup" },
      { label: "Business", slug: "business" },
    ],
  },
};
