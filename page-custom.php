<?php
/**
 * Template Name: Stitch Custom Page
 */
get_header(); ?>

<link rel="stylesheet" href="<?php echo get_stylesheet_directory_uri(); ?>/dist/output.css">

<div id="stitch-page">

  <!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Growth Operator | Execution-Led Systems</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@700;800&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "on-secondary-fixed": "#002108",
              "on-background": "#e5e2e1",
              "surface-tint": "#b3c5ff",
              "primary-fixed-dim": "#b3c5ff",
              "outline-variant": "#424656",
              "primary-fixed": "#dae1ff",
              "secondary": "#40e56c",
              "on-primary-container": "#f8f7ff",
              "on-secondary": "#003912",
              "outline": "#8c90a1",
              "tertiary": "#ffb59d",
              "background": "#131313",
              "inverse-on-surface": "#313030",
              "on-secondary-container": "#004d1b",
              "on-secondary-fixed-variant": "#00531e",
              "on-tertiary": "#5d1900",
              "inverse-surface": "#e5e2e1",
              "on-tertiary-fixed-variant": "#832600",
              "on-error-container": "#ffdad6",
              "on-primary": "#002b75",
              "error-container": "#93000a",
              "on-error": "#690005",
              "tertiary-container": "#cc4204",
              "error": "#ffb4ab",
              "on-primary-fixed-variant": "#003fa4",
              "primary-container": "#0066ff",
              "surface-variant": "#353534",
              "tertiary-fixed-dim": "#ffb59d",
              "on-primary-fixed": "#001849",
              "surface-container-lowest": "#0e0e0e",
              "on-tertiary-container": "#fff6f4",
              "surface": "#131313",
              "inverse-primary": "#0054d6",
              "surface-container-high": "#2a2a2a",
              "secondary-fixed-dim": "#3ce36a",
              "secondary-fixed": "#69ff87",
              "on-surface-variant": "#c2c6d8",
              "surface-bright": "#3a3939",
              "tertiary-fixed": "#ffdbd0",
              "surface-container-low": "#1c1b1b",
              "surface-container-highest": "#353534",
              "on-surface": "#e5e2e1",
              "secondary-container": "#02c953",
              "primary": "#b3c5ff",
              "surface-container": "#201f1f",
              "surface-dim": "#131313",
              "on-tertiary-fixed": "#390c00"
            },
            fontFamily: {
              "headline": ["Manrope"],
              "body": ["Inter"],
              "label": ["Inter"]
            },
            borderRadius: {"DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem"},
          },
        },
      }
    </script>
<style>
      .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      }
      body {
        background-color: #131313;
        color: #e5e2e1;
        font-family: 'Inter', sans-serif;
      }
      .glass-nav {
        background: rgba(14, 14, 14, 0.7);
        backdrop-filter: blur(20px);
      }
      .gradient-button {
        background: linear-gradient(135deg, #b3c5ff 0%, #0066ff 100%);
      }
      .ghost-border {
        border: 1px solid rgba(140, 144, 161, 0.15);
      }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="selection:bg-primary-container selection:text-white">
<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-neutral-950/70 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-blue-500/10">
<nav class="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-blue-600 dark:text-blue-500" data-icon="insights">insights</span>
<span class="text-xl font-black tracking-tighter text-white dark:text-neutral-50 font-['Manrope'] uppercase">Growth Operator</span>
</div>
<div class="hidden md:flex gap-8 items-center">
<a class="text-blue-500 font-bold font-['Inter'] text-sm tracking-wide" href="#">Blog</a>
<a class="text-neutral-400 hover:text-white transition-colors font-['Inter'] text-sm tracking-wide" href="#">About</a>
<a class="text-neutral-400 hover:text-white transition-colors font-['Inter'] text-sm tracking-wide" href="#">Contact</a>
<button class="bg-primary-container text-on-primary-container px-5 py-2 rounded-lg font-bold text-sm hover:translate-y-[-1px] transition-transform active:scale-95">Work With Me</button>
</div>
<button class="md:hidden text-white active:scale-95 transition-transform">
<span class="material-symbols-outlined" data-icon="menu">menu</span>
</button>
</nav>
</header>
<main class="pt-24">
<!-- Hero Section -->
<section class="relative px-6 py-20 md:py-32 overflow-hidden max-w-7xl mx-auto">
<div class="relative z-10 flex flex-col items-start gap-8 max-w-3xl">
<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/20">
<span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
<span class="text-xs font-medium tracking-widest uppercase text-on-surface-variant">Available for Q4 Partnerships</span>
</div>
<h1 class="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.9] text-white">
                    I Turn Marketing Into <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">Revenue Systems</span>
</h1>
<p class="font-body text-xl md:text-2xl text-on-surface-variant leading-relaxed">
                    SEO, Paid Media &amp; Conversion Systems. Execution-led growth. No fluff.
                </p>
<div class="flex flex-wrap gap-4 pt-4">
<button class="gradient-button text-on-primary-container px-8 py-4 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
                        View Insights
                    </button>
<button class="ghost-border bg-transparent text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-surface-container-high transition-all active:scale-95">
                        Work With Me
                    </button>
</div>
</div>
<!-- Abstract Graphic Placeholder -->
<div class="absolute top-1/2 right-0 -translate-y-1/2 w-1/2 h-full opacity-20 pointer-events-none hidden lg:block">
<div class="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-container/40 via-transparent to-transparent"></div>
<div class="absolute inset-0 flex items-center justify-center">
<div class="grid grid-cols-6 gap-2 w-full h-64 opacity-50">
<div class="h-32 bg-primary-container/20 rounded-sm self-end"></div>
<div class="h-48 bg-primary-container/30 rounded-sm self-end"></div>
<div class="h-24 bg-primary-container/10 rounded-sm self-end"></div>
<div class="h-56 bg-primary-container/40 rounded-sm self-end"></div>
<div class="h-40 bg-primary-container/25 rounded-sm self-end"></div>
<div class="h-64 bg-primary-container/50 rounded-sm self-end"></div>
</div>
</div>
</div>
</section>
<!-- Proof Section -->
<section class="bg-surface-container-lowest py-16 px-6">
<div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
<div class="flex flex-col gap-2">
<span class="font-headline text-4xl md:text-6xl font-black text-secondary">+140%</span>
<span class="font-label text-sm uppercase tracking-widest text-outline">Organic Traffic Growth</span>
</div>
<div class="flex flex-col gap-2">
<span class="font-headline text-4xl md:text-6xl font-black text-secondary">3.4x</span>
<span class="font-label text-sm uppercase tracking-widest text-outline">Revenue Scaling (YoY)</span>
</div>
<div class="flex flex-col gap-2">
<span class="font-headline text-4xl md:text-6xl font-black text-secondary">-45%</span>
<span class="font-label text-sm uppercase tracking-widest text-outline">Customer Acquisition Cost</span>
</div>
<div class="flex flex-col gap-2">
<span class="font-headline text-4xl md:text-6xl font-black text-secondary">12+</span>
<span class="font-label text-sm uppercase tracking-widest text-outline">Successful Scale-ups</span>
</div>
</div>
</section>
<!-- Positioning (Pillars) -->
<section class="py-24 px-6 max-w-7xl mx-auto">
<div class="mb-16">
<h2 class="font-headline text-3xl md:text-5xl font-extrabold tracking-tight mb-4 uppercase">Execution-Led Growth</h2>
<div class="w-24 h-1 bg-primary"></div>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-0.5 bg-outline-variant/10 rounded-xl overflow-hidden">
<div class="bg-surface-container-low p-10 flex flex-col gap-6 hover:bg-surface-container transition-colors">
<span class="material-symbols-outlined text-primary text-4xl" data-icon="search_insights">search_insights</span>
<h3 class="font-headline text-2xl font-bold">SEO Systems</h3>
<p class="text-on-surface-variant leading-relaxed">Moving beyond keywords to build content engines that capture high-intent demand and build long-term equity.</p>
</div>
<div class="bg-surface-container-low p-10 flex flex-col gap-6 hover:bg-surface-container transition-colors">
<span class="material-symbols-outlined text-primary text-4xl" data-icon="ads_click">ads_click</span>
<h3 class="font-headline text-2xl font-bold">Paid Media</h3>
<p class="text-on-surface-variant leading-relaxed">Scientific performance marketing focused on unit economics, creative iteration, and scalable attribution models.</p>
</div>
<div class="bg-surface-container-low p-10 flex flex-col gap-6 hover:bg-surface-container transition-colors">
<span class="material-symbols-outlined text-primary text-4xl" data-icon="query_stats">query_stats</span>
<h3 class="font-headline text-2xl font-bold">Conversion Optimisation</h3>
<p class="text-on-surface-variant leading-relaxed">Turning existing traffic into revenue through data-backed UX improvements and psychological trigger testing.</p>
</div>
</div>
</section>
<!-- Featured Insights (Bento-ish Grid) -->
<section class="py-24 px-6 bg-surface-container-low/50">
<div class="max-w-7xl mx-auto">
<div class="flex justify-between items-end mb-16">
<div>
<h2 class="font-headline text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Featured Insights</h2>
<p class="text-on-surface-variant max-w-md">No general advice. Just systems, data, and hard-won lessons from the field.</p>
</div>
<a class="hidden md:block text-primary font-bold hover:underline underline-offset-8" href="#">Browse all posts →</a>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
<!-- Post 1 -->
<article class="group bg-surface-container rounded-xl overflow-hidden ghost-border flex flex-col h-full">
<div class="aspect-video relative overflow-hidden">
<img alt="Insights image" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100" data-alt="Modern high-contrast data dashboard showing rising revenue charts on a dark interface with glowing blue lines" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbPg5y3JuopKqL7tg2h8VoHyA3TjHYyOrFVQzdkjWbMmvcxezdTeN2-GkkiLXLCtqqrbG666pAPv4M_hKmer1ABBz51vYAbHUIm4wSwcqPaBZeZXBR1j__oSYHIObnL-eDaq8_DXHltODWj2-mI0kpwEP4jHZQub0NILxaoZsA99O3QTYKXr6rgI4Em_JddfBqff0ZZuoC5EpYS4r4FAW08fByk3xuEcKEAQL0hJTz4FjUNRy1o6x6YTqfnH4yU50Hnn3ZPyHz6lqx"/>
<span class="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary-container text-[10px] font-bold uppercase tracking-widest">Growth</span>
</div>
<div class="p-8 flex flex-col gap-4 flex-grow">
<h3 class="font-headline text-xl font-bold group-hover:text-primary transition-colors">The 72-Hour Growth Audit: Finding Hidden Levers</h3>
<p class="text-on-surface-variant text-sm line-clamp-3">How I analyze startup marketing stacks to find the one 5% change that yields a 50% revenue lift.</p>
<div class="mt-auto pt-4 flex items-center gap-2 text-xs font-medium text-outline">
<span>8 min read</span>
<span>•</span>
<span>Oct 12, 2023</span>
</div>
</div>
</article>
<!-- Post 2 -->
<article class="group bg-surface-container rounded-xl overflow-hidden ghost-border flex flex-col h-full">
<div class="aspect-video relative overflow-hidden">
<img alt="Insights image" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100" data-alt="Detailed spreadsheet and analytical graphs on a dark laptop screen in a moody tech office environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnvReCgmEHEZnni5cKRlRlYOklWMpewPh1dPRRKh_Xsd6bYS1ehDGySNWpSImXWUa4-guiHP40cZY0YYvELvlFlBDb599_cBWDDxZNDiqUmgWHCNzlkbCT2QMp8XNVh9r4BApgHHq3awPGnRji-Fo_kgkjVpKdLKywITYRku04iOGox_aNv6SnnuhC65oFXwFbJn7g4n-Pl3QNQkedTBlWbNvXgQlJzuTMnOJQNmCtvKSqB_l3xf0x4PFek_Wu56HK_V3L5n18avRE"/>
<span class="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary-container text-[10px] font-bold uppercase tracking-widest">SEO</span>
</div>
<div class="p-8 flex flex-col gap-4 flex-grow">
<h3 class="font-headline text-xl font-bold group-hover:text-primary transition-colors">Why Your Content Engine is Burning Cash</h3>
<p class="text-on-surface-variant text-sm line-clamp-3">Stopping the 'publish for the sake of publishing' cycle and moving towards semantic clusters that convert.</p>
<div class="mt-auto pt-4 flex items-center gap-2 text-xs font-medium text-outline">
<span>12 min read</span>
<span>•</span>
<span>Sep 28, 2023</span>
</div>
</div>
</article>
<!-- Post 3 -->
<article class="group bg-surface-container rounded-xl overflow-hidden ghost-border flex flex-col h-full">
<div class="aspect-video relative overflow-hidden">
<img alt="Insights image" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100" data-alt="Creative whiteboard session with flowcharts and sticky notes representing a complex customer journey map" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGPReuDwAM8HlSKvHcrnQF_9cIzZXXD70nA5EVLd6s7IAL0B9NTJxrRIGa-3osl2C7JERXrUHC7jZa2XtLMYN9hkiKhKDic1r9weXbZN2k8mHrwXe3oh5p2QpnZnH-ZIXoJDFmXIlzc-8RC_K2oVaYHk0aMJ08HTnqMDnpx3MLLlW53DavQLOyRgw1RPV9e9tFihVfuHhDlwUeW_vcOj26hbUYUyftrXMZCyIht58tDKXxMMFoqmUFAqGomNW2UKRq3EWRliKgu1LT"/>
<span class="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary-container text-[10px] font-bold uppercase tracking-widest">Paid Media</span>
</div>
<div class="p-8 flex flex-col gap-4 flex-grow">
<h3 class="font-headline text-xl font-bold group-hover:text-primary transition-colors">The Death of Third-Party Cookies: A Growth Playbook</h3>
<p class="text-on-surface-variant text-sm line-clamp-3">Retooling your tracking and attribution systems for a privacy-first world without losing ROI.</p>
<div class="mt-auto pt-4 flex items-center gap-2 text-xs font-medium text-outline">
<span>15 min read</span>
<span>•</span>
<span>Sep 15, 2023</span>
</div>
</div>
</article>
</div>
<div class="mt-12 text-center md:hidden">
<a class="text-primary font-bold" href="#">Browse all posts →</a>
</div>
</div>
</section>
<!-- Content Philosophy -->
<section class="py-24 px-6 max-w-7xl mx-auto">
<div class="bg-surface-container-high rounded-2xl p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center">
<div class="md:w-1/2">
<h2 class="font-headline text-3xl md:text-5xl font-extrabold tracking-tight mb-6">What I Write About</h2>
<div class="flex flex-wrap gap-3">
<span class="px-4 py-2 bg-surface-container-highest rounded-full text-sm font-medium border border-outline-variant/30">Unit Economics</span>
<span class="px-4 py-2 bg-surface-container-highest rounded-full text-sm font-medium border border-outline-variant/30">Programmatic SEO</span>
<span class="px-4 py-2 bg-surface-container-highest rounded-full text-sm font-medium border border-outline-variant/30">Lead Scoring</span>
<span class="px-4 py-2 bg-surface-container-highest rounded-full text-sm font-medium border border-outline-variant/30">Churn Prevention</span>
<span class="px-4 py-2 bg-surface-container-highest rounded-full text-sm font-medium border border-outline-variant/30">Market Expansion</span>
<span class="px-4 py-2 bg-surface-container-highest rounded-full text-sm font-medium border border-outline-variant/30">Growth Hiring</span>
</div>
</div>
<div class="md:w-1/2 flex flex-col gap-6 border-l-2 border-secondary pl-8">
<p class="text-lg md:text-xl italic text-on-surface leading-relaxed">
                        "The goal isn't to build a 'marketing team'. It's to build a growth engine where every $1 in results in $4 out. I document the mechanics of that engine."
                    </p>
<span class="font-bold text-primary tracking-wide">— THE OPERATOR</span>
</div>
</div>
</section>
<!-- About Section -->
<section class="py-24 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-20 items-center">
<div class="w-full md:w-5/12 aspect-square relative">
<div class="absolute inset-4 border-2 border-primary translate-x-4 translate-y-4 rounded-xl -z-10"></div>
<img alt="Growth Operator Profile" class="w-full h-full object-cover rounded-xl" data-alt="Professional headshot of a confident man in his late 30s with a thoughtful expression in a clean modern architectural setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5tq47rjaDods-5l8j-FjgU9TcFVpu37e66fpxrTR5iZ7t0FNen2HPc-SjslvUWvvbovWr_i1DLr3W7loP0rakD3MKHbSVJowumy3fbceQOY8gzuUiVW8HpKU3NafYciNSXg7OECyDJa32-bw5PGHA70do-Bmx-EDAo-khGmXmeZpvMEK_gfnssAavRKL19GDJFMNmNQ1poCbanZOl9n6y1YBv86d2wMMncmQnXmbmB_rqkdNJEVruT-wmp8BKITbrtRmYUNKLK8j5"/>
</div>
<div class="w-full md:w-7/12 flex flex-col gap-6">
<h2 class="font-headline text-3xl md:text-5xl font-extrabold tracking-tight">The Person Behind the Systems</h2>
<div class="space-y-4 text-on-surface-variant leading-relaxed text-lg">
<p>I've spent the last decade inside the growth engines of some of the fastest-scaling B2B and D2C brands. I don't believe in vanity metrics or creative awards.</p>
<p>My approach is rooted in systems thinking. I look for bottlenecks in your funnel, inefficiencies in your spend, and opportunities for compounding returns. Whether you're a Seed-stage founder or a Series C scale-up, the physics of growth remain the same.</p>
</div>
<div class="pt-4 flex gap-4">
<button class="bg-primary text-on-primary px-6 py-3 rounded-lg font-bold hover:brightness-110 transition-all">My Philosophy</button>
<button class="ghost-border px-6 py-3 rounded-lg font-bold hover:bg-surface-container transition-all">LinkedIn Profile</button>
</div>
</div>
</section>
<!-- Email Capture -->
<section class="py-24 px-6">
<div class="max-w-4xl mx-auto bg-gradient-to-br from-surface-container to-surface-container-low rounded-3xl p-8 md:p-20 text-center border border-white/5 relative overflow-hidden">
<div class="absolute top-0 right-0 p-8 opacity-10">
<span class="material-symbols-outlined text-9xl" data-icon="mail">mail</span>
</div>
<h2 class="font-headline text-3xl md:text-4xl font-extrabold mb-4">Get Practical Growth Insights</h2>
<p class="text-on-surface-variant mb-10 max-w-lg mx-auto">No spam. Only deep-dives into the growth systems I'm currently building for clients. Join 2,500+ operators.</p>
<form class="flex flex-col md:flex-row gap-4 max-w-lg mx-auto" onsubmit="return false;">
<input class="flex-grow bg-surface-container-highest border-none rounded-lg px-6 py-4 focus:ring-2 focus:ring-primary text-white font-body" placeholder="Enter your work email" type="email"/>
<button class="gradient-button text-on-primary-container px-8 py-4 rounded-lg font-bold hover:shadow-lg transition-all active:scale-95 whitespace-nowrap">
                        Join The Archive
                    </button>
</form>
</div>
</section>
</main>
<!-- Footer -->
<footer class="bg-neutral-950 w-full py-12 px-8">
<div class="bg-gradient-to-r from-transparent via-neutral-800 to-transparent h-[1px] mb-8"></div>
<div class="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
<div class="flex flex-col items-center md:items-start gap-2">
<span class="text-lg font-bold text-white font-['Manrope'] tracking-tight">Growth Operator</span>
<p class="font-['Inter'] text-sm tracking-wide text-neutral-500">© 2024 The Kinetic Archive. Built for scale.</p>
</div>
<div class="flex gap-8">
<a class="text-neutral-500 hover:text-blue-400 font-['Inter'] text-sm tracking-wide transition-colors" href="#">Blog</a>
<a class="text-neutral-500 hover:text-blue-400 font-['Inter'] text-sm tracking-wide transition-colors" href="#">About</a>
<a class="text-neutral-500 hover:text-blue-400 font-['Inter'] text-sm tracking-wide transition-colors" href="#">Contact</a>
<a class="text-neutral-500 hover:text-blue-400 font-['Inter'] text-sm tracking-wide transition-colors" href="#">LinkedIn</a>
</div>
</div>
</footer>
</body></html>

</div>

<?php get_footer(); ?>