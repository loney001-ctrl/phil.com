# phil.com

Phil Loney's personal site — portfolio + blog. Next.js 16 (App Router, Cache Components) with a Sanity Studio embedded at `/studio`. Content lives in Sanity project `8gulen9x` (dataset: `production`).

## Stack

- Next.js 16, Tailwind, TypeScript
- Sanity (Studio embedded, live preview via Sanity Live)
- Deployed on Vercel; domain via Namecheap

## Content model

- `post` — blog posts (author, categories, cover image, portable-text body, SEO fields)
- `author` — bylines
- `category` — post taxonomy
- `project` — portfolio case studies (from the original starter)
- `page` — flat pages
- `home` / `settings` — singletons

## Local development

```shell
cp .env.local.example .env.local   # fill in NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_READ_TOKEN
npm install
npm run dev
```

Site: http://localhost:3000 · Studio: http://localhost:3000/studio

Built from [sanity-io/template-nextjs-personal-website](https://github.com/sanity-io/template-nextjs-personal-website).
