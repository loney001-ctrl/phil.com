const PRIMARY = '#1E3BC8'
const ACCENT = '#B8FF00'

export default function HomePage() {
  return (
    <div className="home-page min-h-screen bg-[#F5F5F7] text-[#0A0A0A]">
      {/* NAV */}
      <header className="px-5 pt-6 md:px-10 md:pt-8 lg:px-20">
        <nav
          aria-label="Primary"
          className="flex items-center justify-between gap-4 rounded-full border-[1.5px] border-[#0A0A0A] bg-[#F5F5F7] py-2.5 pl-5 pr-2.5 md:pl-7"
        >
          <a
            href="#top"
            className="a shrink-0 text-base font-black tracking-[-0.01em] no-underline md:text-lg"
          >
            PHIL LONEY
          </a>
          <div className="flex items-center gap-4 md:gap-9">
            <div className="hidden items-center gap-4 md:flex md:gap-9">
              <a href="#work" className="r text-base no-underline md:text-lg">
                Case files
              </a>
              <a href="#method" className="r text-base no-underline md:text-lg">
                Method
              </a>
              <a href="#systems" className="r text-base no-underline md:text-lg">
                Systems
              </a>
            </div>
            <a
              href="#contact"
              className="a shrink-0 rounded-full px-4 py-3 text-xs font-extrabold tracking-[0.06em] text-[#F5F5F7] no-underline md:px-5 md:text-sm"
              style={{background: PRIMARY}}
            >
              SUBSCRIBE
            </a>
          </div>
        </nav>
      </header>

      {/* 1. HERO */}
      <section
        id="top"
        className="relative grid grid-cols-1 gap-10 px-5 pb-16 pt-16 md:px-10 lg:grid-cols-12 lg:gap-6 lg:px-20 lg:pb-32 lg:pt-28"
      >
        <p className="r col-span-1 text-sm text-[#6B6B72] lg:col-span-12 lg:text-base">
          Melbourne · Marketing strategist · Systems thinker · AI-native operator
        </p>
        <h1
          className="a col-span-1 font-black tracking-[-0.05em] lg:col-span-12"
          style={{fontSize: 'clamp(2.75rem, 8.5vw, 10rem)', lineHeight: 0.88}}
        >
          FIND THE
          <br />
          MECHANISM.
          <br />
          <span style={{color: PRIMARY}}>NOT THE TACTIC.</span>
        </h1>
        <p className="r col-span-1 text-xl leading-relaxed lg:col-span-6 lg:text-[26px]">
          I find the commercial signal other marketers miss, turn it into a system you can test,
          then build the AI infrastructure to run that system at scale.
        </p>
        <div className="col-span-1 flex flex-col lg:col-span-4 lg:col-start-9">
          <p className="r mb-3 text-sm text-[#6B6B72]">Signals I look for first</p>
          <div className="flex items-baseline justify-between border-t-[1.5px] border-[#0A0A0A] py-3.5">
            <span className="a text-base font-extrabold md:text-xl">REFERRAL DENSITY</span>
            <span className="r text-sm text-[#6B6B72]">01</span>
          </div>
          <div className="flex items-baseline justify-between border-t-[1.5px] border-[#0A0A0A] py-3.5">
            <span className="a text-base font-extrabold md:text-xl">CUSTOMER CONCENTRATION</span>
            <span className="r text-sm text-[#6B6B72]">02</span>
          </div>
          <div className="flex items-baseline justify-between border-b-[1.5px] border-t-[1.5px] border-[#0A0A0A] py-3.5">
            <span className="a text-base font-extrabold md:text-xl">GROUP-BOOKING BEHAVIOUR</span>
            <span className="r text-sm text-[#6B6B72]">03</span>
          </div>
        </div>
        <div
          className="a absolute right-6 top-16 hidden h-[140px] w-[140px] rotate-[-14deg] items-center justify-center rounded-full text-center text-sm font-black leading-tight tracking-[0.02em] lg:right-16 lg:flex lg:h-[172px] lg:w-[172px] lg:text-[17px]"
          style={{background: ACCENT}}
        >
          TESTED,
          <br />
          NOT
          <br />
          ASSERTED.
        </div>
      </section>

      {/* 2. BANNER: SIGNAL */}
      <section className="relative flex items-end overflow-hidden bg-[#0A0A0A] px-6 pb-6 pt-12 text-[#F5F5F7] md:pl-14 md:pt-16">
        <p className="r absolute right-5 top-6 text-sm text-[#9A9AA2] md:right-20 md:top-12 md:text-base">
          §01 — It&rsquo;s usually already in the data, priced as noise.
        </p>
        <h2
          className="a mt-16 font-black tracking-[-0.06em] md:mt-24"
          style={{
            fontSize: 'clamp(4.5rem, 26vw, 23.75rem)',
            lineHeight: 0.8,
            marginBottom: '-0.06em',
          }}
        >
          SIGNAL
          <span style={{color: ACCENT}}>.</span>
        </h2>
      </section>

      {/* 3. PHILOSOPHY */}
      <section className="grid grid-cols-1 gap-10 px-5 py-20 md:px-10 lg:grid-cols-12 lg:gap-6 lg:px-20 lg:py-44">
        <div className="col-span-1 flex flex-col gap-8 lg:col-span-7">
          <span
            className="a self-start rounded-full px-4 py-1.5 text-xs font-extrabold tracking-[0.08em] text-[#0A0A0A]"
            style={{background: ACCENT}}
          >
            PRINCIPLE
          </span>
          <blockquote
            className="a m-0 font-extrabold tracking-[-0.03em]"
            style={{fontSize: 'clamp(1.75rem, 4.5vw, 3.75rem)', lineHeight: 1}}
          >
            Don&rsquo;t start with the tactic. Find the mechanism, test the hypothesis, understand
            the system, then extract the principle.
          </blockquote>
        </div>
        <div className="col-span-1 flex flex-col gap-6 lg:col-span-4 lg:col-start-9 lg:pt-16">
          <p className="r text-lg leading-relaxed lg:text-xl">
            Most marketing starts at the output — a channel, a format, a keyword list — and works
            backwards to a justification. That order is why so much of it fails quietly.
          </p>
          <p className="r text-lg leading-relaxed lg:text-xl">
            I start with the operating data: who refers whom, which customers carry the revenue,
            what a single booking actually represents. Once the mechanism has a name, it becomes a
            hypothesis you can test, a system you can instrument, and a principle that transfers to
            the next business.
          </p>
          <p className="r text-sm text-[#6B6B72]">Method → Mechanism → Principle</p>
        </div>
      </section>

      {/* 4. CASE FILES */}
      <section id="work" className="px-3 pb-6 pt-14 md:px-6">
        <div className="flex flex-col items-start justify-between gap-4 px-3 md:flex-row md:items-end md:gap-6 md:px-8">
          <h2
            className="a font-black tracking-[-0.045em]"
            style={{fontSize: 'clamp(2.25rem, 7vw, 6rem)', lineHeight: 0.9}}
          >
            CASE FILES
          </h2>
          <p className="r max-w-[420px] text-base leading-relaxed text-[#6B6B72] md:text-lg">
            Three mechanisms. Each one was sitting in data the client already had.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <article
            className="flex min-h-[520px] flex-col gap-5 rounded-[40px] p-8 text-[#F5F5F7]"
            style={{background: PRIMARY}}
          >
            <div className="flex items-center justify-between">
              <span
                className="a rounded-full px-3.5 py-1.5 text-xs font-extrabold tracking-[0.08em] text-[#0A0A0A]"
                style={{background: ACCENT}}
              >
                REFERRAL DENSITY
              </span>
              <span className="r text-sm text-[#DCE1FA]">SMSF advisory</span>
            </div>
            <h3 className="a text-3xl font-black leading-[0.95] tracking-[-0.03em] md:text-[46px]">
              $25K MONTH ON A $1K RETAINER
            </h3>
            <p className="r text-lg leading-relaxed text-[#E8EBFB]">
              Growth wasn&rsquo;t coming from search. It traced back to referral density inside a
              small cluster of existing clients. The engagement was rebuilt around that signal
              instead of buying more top-of-funnel traffic.
            </p>
            <div className="grow" />
            <div className="flex items-end justify-between border-t-[1.5px] border-[#F5F5F7] pt-5">
              <span className="a text-6xl font-black leading-[0.85] tracking-[-0.05em] md:text-[104px]">
                25×
              </span>
              <span className="r text-right text-sm text-[#DCE1FA]">
                monthly revenue
                <br />
                to retainer
              </span>
            </div>
          </article>

          <article className="flex min-h-[520px] flex-col gap-5 rounded-[40px] bg-[#0A0A0A] p-8 text-[#F5F5F7]">
            <div className="flex items-center justify-between">
              <span
                className="a rounded-full px-3.5 py-1.5 text-xs font-extrabold tracking-[0.08em] text-[#0A0A0A]"
                style={{background: ACCENT}}
              >
                GROUP-BOOKING SIGNAL
              </span>
              <span className="r text-sm text-[#9A9AA2]">Fire warden training</span>
            </div>
            <h3 className="a text-3xl font-black leading-[0.95] tracking-[-0.03em] md:text-[46px]">
              ONE BOOKING. A WHOLE FLOOR.
            </h3>
            <p className="r text-lg leading-relaxed text-[#D6D6DB]">
              Fire warden training isn&rsquo;t bought by individuals. One safety officer books for a
              floor, a site, a building. The funnel was built for solo buyers; rebuilding it around
              the group booker changed what a single conversion was worth.
            </p>
            <div className="grow" />
            <div className="flex items-end justify-between border-t-[1.5px] border-[#F5F5F7] pt-5">
              <span
                className="a text-4xl font-black leading-[0.9] tracking-[-0.04em] md:text-[56px]"
                style={{color: ACCENT}}
              >
                [RESULT]
              </span>
              <span className="r text-right text-sm text-[#9A9AA2]">
                [Add figure:
                <br />
                value per booking]
              </span>
            </div>
          </article>

          <article className="flex min-h-[520px] flex-col gap-5 rounded-[40px] border-[1.5px] border-[#0A0A0A] bg-white p-8">
            <div className="flex items-center justify-between">
              <span
                className="a rounded-full px-3.5 py-1.5 text-xs font-extrabold tracking-[0.08em] text-[#0A0A0A]"
                style={{background: ACCENT}}
              >
                DENSITY MODEL
              </span>
              <span className="r text-sm text-[#6B6B72]">Childcare first aid</span>
            </div>
            <h3 className="a text-3xl font-black leading-[0.95] tracking-[-0.03em] md:text-[46px]">
              RANK SUBURBS BY DEMAND, NOT VOLUME.
            </h3>
            <p className="r text-lg leading-relaxed text-[#3A3A40]">
              Childcare first aid demand clusters where centres, educators and young families
              concentrate. Suburbs were scored on that density and rolled out in tiers: full pages
              where demand is real, hub pages where it isn&rsquo;t.
            </p>
            <div className="grow" />
            <div className="flex items-end justify-between border-t-[1.5px] border-[#0A0A0A] pt-5">
              <span
                className="a text-4xl font-black leading-[0.9] tracking-[-0.04em] md:text-[56px]"
                style={{color: PRIMARY}}
              >
                [RESULT]
              </span>
              <span className="r text-right text-sm text-[#6B6B72]">
                [Add figure:
                <br />
                leads or bookings per tier]
              </span>
            </div>
          </article>
        </div>
      </section>

      {/* 4b. EMPHASIS */}
      <section className="px-5 py-10 md:px-16 lg:px-40 lg:py-24">
        <div className="relative rounded-[40px] border-[1.5px] border-[#0A0A0A] px-6 py-14 md:rounded-[64px] md:px-16 md:py-24">
          <span
            className="a absolute -top-3.5 right-6 rounded-full px-4 py-2 text-xs font-extrabold tracking-[0.08em] text-[#0A0A0A] md:right-20"
            style={{background: ACCENT}}
          >
            PRINCIPLE EXTRACTED
          </span>
          <p className="r mb-6 text-sm text-[#6B6B72] md:text-base">
            What all three cases have in common
          </p>
          <h3
            className="a font-black tracking-[-0.04em]"
            style={{fontSize: 'clamp(1.75rem, 6vw, 5.5rem)', lineHeight: 0.92}}
          >
            SEARCH DEMAND IS <span style={{color: PRIMARY}}>NOT ALWAYS</span> THE BEST PROXY FOR
            OPPORTUNITY.
          </h3>
        </div>
      </section>

      {/* 5. BANNER: SYSTEMS AT SCALE */}
      <section className="flex flex-col overflow-hidden bg-[#0A0A0A] px-5 pb-12 pt-16 text-[#F5F5F7] md:px-10 lg:px-16 lg:pt-28">
        <h2
          className="a font-black tracking-[-0.06em]"
          style={{fontSize: 'clamp(2.75rem, 16vw, 15.625rem)', lineHeight: 0.84}}
        >
          SYSTEMS
        </h2>
        <h2
          className="a text-right font-black tracking-[-0.06em]"
          style={{fontSize: 'clamp(2.75rem, 16vw, 15.625rem)', lineHeight: 0.84, color: ACCENT}}
        >
          AT SCALE.
        </h2>
        <p className="r mt-10 text-sm text-[#9A9AA2] md:text-base">
          §02 — A principle is only useful once it runs without you.
        </p>
      </section>

      {/* 6. METHODOLOGY */}
      <section id="method" className="px-5 py-16 md:px-10 lg:px-20 lg:py-28">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <h2
            className="a font-black tracking-[-0.045em] lg:col-span-7"
            style={{fontSize: 'clamp(2rem, 6.5vw, 6.5rem)', lineHeight: 0.9}}
          >
            NINE STEPS. IN THIS ORDER.
          </h2>
          <p className="r text-lg leading-relaxed lg:col-span-4 lg:col-start-9 lg:self-end lg:text-xl">
            The sequence matters more than any single step. Jump to testing before you&rsquo;ve
            found the opportunity and you&rsquo;re optimising noise.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
          <StepCard
            span="lg:col-span-5"
            minH="min-h-[280px]"
            dark
            number="01"
            numberSize="text-7xl md:text-8xl lg:text-[160px]"
            title="UNDERSTAND"
            body="The business, the buyer, the unit economics. Before anything else."
          />
          <StepCard
            span="lg:col-span-4 lg:self-end"
            minH="min-h-[220px]"
            number="02"
            numberSize="text-5xl md:text-6xl"
            title="IDENTIFY OBJECTIVE"
            body="One commercial outcome, stated so it can be measured."
          />
          <StepCard
            span="lg:col-span-3"
            minH="min-h-[280px]"
            fill={PRIMARY}
            number="03"
            numberSize="text-5xl md:text-6xl"
            title="FIND OPPORTUNITY"
            body="Look where others don't: referral patterns, concentration, booking behaviour."
            bodyColor="text-[#E8EBFB]"
          />
          <StepCard
            span="lg:col-span-3 lg:self-start"
            minH="min-h-[200px]"
            number="04"
            numberSize="text-5xl md:text-6xl"
            title="HYPOTHESIS"
            body="If the mechanism is real, this metric moves. Write it down first."
          />
          <StepCard
            span="lg:col-span-4"
            minH="min-h-[240px]"
            number="05"
            numberSize="text-6xl md:text-7xl"
            title="UNDERSTAND COMPONENTS"
            body="Break the system into parts you can instrument and change one at a time."
          />
          <div className="flex min-h-[240px] flex-col justify-between gap-6 rounded-[32px] bg-[#0A0A0A] p-6 text-[#F5F5F7] lg:col-span-5 lg:min-h-[280px] lg:p-8">
            <div className="flex items-start justify-between">
              <span
                className="a text-6xl font-black leading-[0.8] tracking-[-0.06em] md:text-8xl lg:text-[128px]"
                style={{color: ACCENT}}
              >
                06
              </span>
              <span
                className="a rounded-full px-3.5 py-1.5 text-xs font-extrabold tracking-[0.08em] text-[#0A0A0A]"
                style={{background: ACCENT}}
              >
                WHERE MOST START
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              <h3 className="a text-2xl font-extrabold leading-none md:text-[34px]">TEST</h3>
              <p className="r text-lg leading-normal text-[#D6D6DB]">
                The smallest test that could prove you wrong.
              </p>
            </div>
          </div>
          <StepCard
            span="lg:col-span-4 lg:self-start"
            minH="min-h-[200px]"
            number="07"
            numberSize="text-5xl md:text-6xl"
            title="DIAGNOSE"
            body="Read what the result is telling you, not what you hoped."
          />
          <StepCard
            span="lg:col-span-3 lg:self-end"
            minH="min-h-[200px]"
            fill="#FFFFFF"
            border
            number="08"
            numberSize="text-5xl md:text-6xl"
            title="OPTIMISE"
            body="Improve the mechanism, not the surface tactic."
          />
          <StepCard
            span="lg:col-span-5"
            minH="min-h-[280px]"
            fill={PRIMARY}
            number="09"
            numberSize="text-7xl md:text-8xl lg:text-[160px]"
            title="EXTRACT PRINCIPLE"
            body="Name the transferable rule, so the next business starts at step three."
            bodyColor="text-[#E8EBFB]"
          />
        </div>
      </section>

      {/* 7. AI SYSTEMS */}
      <section id="systems" className="px-3 pb-16 pt-6 md:px-6 lg:pb-36">
        <div className="flex flex-col items-start justify-between gap-4 px-3 md:flex-row md:items-end md:gap-6 md:px-8">
          <h2
            className="a font-black tracking-[-0.045em]"
            style={{fontSize: 'clamp(2rem, 6vw, 5.5rem)', lineHeight: 0.92}}
          >
            AI-NATIVE ISN&rsquo;T A CLAIM.
            <br />
            IT&rsquo;S INFRASTRUCTURE.
          </h2>
          <p className="r max-w-[360px] text-base leading-relaxed text-[#6B6B72] md:text-lg">
            Systems I&rsquo;ve built and run. Each one executes the method above without me in the
            loop.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <article className="flex min-h-[560px] flex-col gap-6 rounded-[40px] bg-[#0A0A0A] p-8 text-[#F5F5F7] lg:col-span-7 lg:rounded-[48px] lg:p-12">
            <div className="flex items-center justify-between">
              <span
                className="a rounded-full px-3.5 py-1.5 text-xs font-extrabold tracking-[0.08em] text-[#0A0A0A]"
                style={{background: ACCENT}}
              >
                CORPUS
              </span>
              <span className="r text-sm text-[#9A9AA2]">Built on Supabase</span>
            </div>
            <h3 className="a text-3xl font-extrabold leading-none tracking-[-0.02em] md:text-[44px]">
              STARTUP INTELLIGENCE DATABASE
            </h3>
            <div className="grow" />
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div className="flex flex-col gap-3 border-t-[1.5px] border-[#F5F5F7] pt-5">
                <span
                  className="a text-5xl font-black leading-[0.82] tracking-[-0.06em] md:text-8xl lg:text-[168px]"
                  style={{color: ACCENT}}
                >
                  400+
                </span>
                <span className="r text-base text-[#D6D6DB] md:text-lg">case studies</span>
              </div>
              <div className="flex flex-col gap-3 border-t-[1.5px] border-[#F5F5F7] pt-5">
                <span className="a text-5xl font-black leading-[0.82] tracking-[-0.06em] md:text-8xl lg:text-[168px]">
                  200+
                </span>
                <span className="r text-base text-[#D6D6DB] md:text-lg">founder interviews</span>
              </div>
            </div>
            <p className="r max-w-[620px] text-lg leading-relaxed text-[#D6D6DB] md:text-xl">
              A structured record of how companies actually found growth, queryable by mechanism
              rather than by headline. It&rsquo;s the evidence base every other system draws on.
            </p>
          </article>

          <div className="flex flex-col gap-4 lg:col-span-5">
            <article
              className="flex grow flex-col gap-5 rounded-[40px] p-8 text-[#F5F5F7] lg:rounded-[48px] lg:p-10"
              style={{background: PRIMARY}}
            >
              <span
                className="a self-start rounded-full px-3.5 py-1.5 text-xs font-extrabold tracking-[0.08em] text-[#0A0A0A]"
                style={{background: ACCENT}}
              >
                SYSTEM
              </span>
              <h3 className="a text-2xl font-extrabold leading-none tracking-[-0.02em] md:text-[34px]">
                CONTENT PRODUCTION PIPELINE
              </h3>
              <p className="r text-lg leading-relaxed text-[#E8EBFB]">
                Brief to approved draft in one sequenced job. Every stage is a gate: a draft that
                fails one doesn&rsquo;t move to the next.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  '1 INTENT BRIEF',
                  '2 GAP ANALYSIS',
                  '3 DRAFT',
                  '4 SCORE GATE',
                  '5 HELPFUL-CONTENT',
                  '6 READABILITY',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="a rounded-full border-[1.5px] border-[#F5F5F7] px-3 py-1.5 text-xs font-bold tracking-[0.04em]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
            <article className="flex flex-col gap-5 rounded-[40px] border-[1.5px] border-[#0A0A0A] bg-white p-8 lg:rounded-[48px] lg:p-10">
              <div className="flex items-center justify-between">
                <span
                  className="a rounded-full px-3.5 py-1.5 text-xs font-extrabold tracking-[0.08em] text-[#0A0A0A]"
                  style={{background: ACCENT}}
                >
                  PRODUCT
                </span>
                <span className="r text-sm text-[#6B6B72]">Phil AI</span>
              </div>
              <h3 className="a text-2xl font-extrabold leading-none tracking-[-0.02em] md:text-[34px]">
                GTM REPORT GENERATOR
              </h3>
              <p className="r text-lg leading-relaxed text-[#3A3A40]">
                Go-to-market reports for bootstrapped B2B SaaS founders, grounded in what worked for
                comparable companies in the corpus.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <section
        id="contact"
        className="flex flex-col gap-10 bg-[#0A0A0A] px-5 py-20 text-[#F5F5F7] md:px-10 lg:px-20 lg:py-36"
      >
        <p className="r text-sm text-[#9A9AA2] md:text-base">§03 — Work with me</p>
        <h2
          className="a font-black tracking-[-0.05em]"
          style={{fontSize: 'clamp(2.5rem, 8vw, 7.25rem)', lineHeight: 0.88}}
        >
          BRING THE DATA.
          <br />
          <span style={{color: ACCENT}}>I&rsquo;LL FIND THE SIGNAL.</span>
        </h2>
        <div className="flex flex-wrap items-center gap-6 md:gap-8">
          <a
            href="#contact"
            className="a rounded-lg px-8 py-5 text-base font-black tracking-[0.06em] text-[#0A0A0A] no-underline md:text-lg"
            style={{background: ACCENT}}
          >
            WORK WITH ME
          </a>
          <p className="r text-base text-[#B5B5BC] md:text-lg">
            or email{' '}
            <a href="mailto:[YOUR EMAIL]" className="text-[#F5F5F7]">
              [YOUR EMAIL]
            </a>
          </p>
        </div>
        <p className="r max-w-[640px] text-lg leading-relaxed text-[#D6D6DB] md:text-xl">
          Strategy engagements for operators who&rsquo;d rather test a mechanism than buy another
          tactic. Based in Melbourne.
        </p>
      </section>

      {/* 9. FOOTER */}
      <footer className="grid grid-cols-1 gap-6 bg-[#F5F5F7] px-5 py-10 md:grid-cols-2 md:items-center md:px-10 lg:px-20">
        <div className="flex flex-col gap-1.5">
          <p className="r text-base md:text-lg">
            Phil Loney — marketing strategist and systems thinker, Melbourne.
          </p>
          <p className="r text-sm text-[#6B6B72]">© 2026</p>
        </div>
        <div className="flex flex-wrap gap-6 md:gap-8 md:justify-self-end">
          <a href="#top" className="r text-base md:text-lg">
            Breakdowns
          </a>
          <a href="#top" className="r text-base md:text-lg">
            Jarvis SEO Brief
          </a>
          <a href="#top" className="r text-base md:text-lg">
            phil-loney.com
          </a>
        </div>
      </footer>
    </div>
  )
}

function StepCard({
  span,
  minH,
  fill,
  dark,
  border,
  number,
  numberSize,
  title,
  body,
  bodyColor = 'text-[#3A3A40]',
}: {
  span: string
  minH: string
  fill?: string
  dark?: boolean
  border?: boolean
  number: string
  numberSize: string
  title: string
  body: string
  bodyColor?: string
}) {
  const isDark = dark || !!fill
  const textColor = dark ? 'text-[#F5F5F7]' : fill ? 'text-[#F5F5F7]' : 'text-[#0A0A0A]'
  return (
    <div
      className={`flex ${minH} flex-col justify-between gap-6 rounded-[32px] p-6 lg:p-8 ${span} ${textColor} ${
        dark ? 'bg-[#0A0A0A]' : border || (!fill && !dark) ? 'border-[1.5px] border-[#0A0A0A]' : ''
      }`}
      style={fill ? {background: fill} : undefined}
    >
      <span className={`a ${numberSize} font-black leading-[0.8] tracking-[-0.05em]`}>
        {number}
      </span>
      <div className="flex flex-col gap-2.5">
        <h3 className="a text-xl font-extrabold leading-none md:text-2xl">{title}</h3>
        <p
          className={`r text-lg leading-normal ${isDark ? (dark ? 'text-[#D6D6DB]' : bodyColor) : 'text-[#3A3A40]'}`}
        >
          {body}
        </p>
      </div>
    </div>
  )
}
