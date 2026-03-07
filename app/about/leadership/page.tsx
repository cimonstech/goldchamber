"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ContactBanner } from "@/components/sections/ContactBanner";

const GoldDust = dynamic(() => import("@/components/GoldDust"), { ssr: false });

function useFadeUp(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

const EXPERIENCE_ITEMS = [
  "Office of the Receiver, Central Bank of Ghana — Associate Business Consultant (current)",
  "CDH Financial Holdings — Group Head, Business Development",
  "Canal Group; Bank of Africa (Ghana) — business development, retail banking, risk management",
  "Amalgamated Bank (Ghana); Cocoa Processing Company; GCB Bank",
  "Consultant and trainer: strategic management, public communication, credit analysis, business negotiation, value creation, financial analysis, innovation management, CRM, sales and product development",
];

const QUALIFICATIONS_ITEMS = [
  "EMBA in Project Management (in progress) — Middlesex University, Dubai",
  "Bachelor of Science, specialising in Insurance",
  "Certificate in Cost Management Accounting — Chartered Institute of Management Accountants (CIMA)",
];

export default function LeadershipPage() {
  const [heroTitleVisible, setHeroTitleVisible] = useState(false);
  const [heroSubtitleVisible, setHeroSubtitleVisible] = useState(false);
  const profile1 = useFadeUp(0.15);
  const profile2 = useFadeUp(0.15);
  const profile3 = useFadeUp(0.15);

  useEffect(() => {
    const t1 = setTimeout(() => setHeroTitleVisible(true), 50);
    const t2 = setTimeout(() => setHeroSubtitleVisible(true), 250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: "smooth" });
        }, 100);
      }
    }
  }, []);

  return (
    <>
      {/* SECTION 1 — PAGE HERO */}
      <section
        className="relative min-h-[50vh] bg-[#050505] overflow-hidden flex items-center justify-center"
        style={{ position: "relative" }}
      >
        <GoldDust particleCount={60} opacity={0.12} />
        <div className="relative z-10 text-center px-4">
          <p
            className="mb-5 font-sans text-[9px] uppercase tracking-[3px]"
            style={{
              color: "rgba(201,168,76,0.6)",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            HOME · ABOUT · LEADERSHIP
          </p>
          <h1
            className="font-display font-light text-[#FAF6EE] mb-6"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: "clamp(56px, 8vw, 96px)",
              fontWeight: 300,
              opacity: heroTitleVisible ? 1 : 0,
              transform: heroTitleVisible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 900ms ease, transform 900ms ease",
            }}
          >
            Our Leadership
          </h1>
          <div className="w-[60px] h-px bg-[#C9A84C] mx-auto my-6" />
          <p
            className="font-display italic mx-auto max-w-[600px]"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              fontSize: "clamp(16px, 1.8vw, 22px)",
              color: "rgba(201,168,76,0.8)",
              opacity: heroSubtitleVisible ? 1 : 0,
              transform: heroSubtitleVisible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 900ms ease 200ms, transform 900ms ease 200ms",
            }}
          >
            The visionaries and stewards behind Ghana&apos;s premier chamber for licensed gold buyers.
          </p>
        </div>
      </section>

      {/* SECTION 2 — LEADERSHIP PROFILES */}
      <section className="bg-[#050505] py-20">
        {/* PROFILE 1 — Job Osei Tutu */}
        <div
          id="job-osei-tutu"
          ref={profile1.ref}
          className="max-w-[1200px] mx-auto px-[60px] py-[100px] grid grid-cols-1 md:grid-cols-2 gap-20 items-start border-b border-[rgba(201,168,76,0.1)] bg-[#050505] transition-all duration-700 ease-out"
          style={{
            opacity: profile1.visible ? 1 : 0,
            transform: profile1.visible ? "translateY(0)" : "translateY(40px)",
          }}
        >
          <div className="relative order-2 md:order-1">
            <div className="relative w-full aspect-[3/4] overflow-hidden">
              <Image
                src="/founder.webp"
                alt="Job Osei Tutu"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div
                className="absolute inset-0 border border-[rgba(201,168,76,0.2)] pointer-events-none z-[2]"
                aria-hidden
              />
            </div>
            <div
              className="absolute top-4 -left-4 -right-4 -bottom-4 border border-[rgba(201,168,76,0.1)] z-0"
              aria-hidden
            />
            <div
              className="absolute top-6 left-0 z-[3] px-5 py-2 font-sans text-[9px] uppercase tracking-[3px] font-bold text-[#050505]"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #8B6914)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              Founder
            </div>
          </div>
          <div className="order-1 md:order-2">
            <p
              className="font-sans text-[10px] uppercase tracking-[4px] text-[#C9A84C] mb-3"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              FOUNDER · CLGB
            </p>
            <h2
              className="font-display font-light text-[#FAF6EE] mb-2"
              style={{
                fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                fontSize: "clamp(40px, 5vw, 64px)",
                fontWeight: 300,
              }}
            >
              Job Osei Tutu
            </h2>
            <div className="w-full h-px bg-[rgba(201,168,76,0.2)] my-6" />
            <div className="relative mb-8">
              <span
                className="absolute -top-2 -left-2 text-[64px] opacity-30"
                style={{ color: "#C9A84C" }}
                aria-hidden
              >
                &ldquo;
              </span>
              <blockquote
                className="font-display italic pl-12"
                style={{
                  fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                  fontSize: "clamp(18px, 2vw, 26px)",
                  color: "rgba(201,168,76,0.9)",
                  lineHeight: 1.5,
                }}
              >
                Buy into the future with hope.
              </blockquote>
            </div>
            <div className="space-y-5 font-sans text-[14px] font-light leading-[1.9]" style={{ color: "rgba(250,246,238,0.65)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
              <p>
                In the bustling heart of Kumasi, where the rhythm of commerce pulses like a living
                heartbeat, Job Osei Tutu&apos;s journey began. A man whose name would one day echo through
                Ghana&apos;s markets as a beacon of hope, integrity, and innovation.
              </p>
              <p>
                Long before gold entered his story, Job carved his legacy in the telecommunication
                industry. With a mind sharpened by ambition and hands steadied by diligence, he rose to
                become Samsung&apos;s premium distributor in Ghana. His stores—sprawling emporiums in Kumasi
                and satellite branches across strategic cities—were temples of technology, where
                smartphones and screens found their way into countless homes. Year after year, he reigned
                as Samsung&apos;s top seller, a testament to his relentless work ethic. Yet, beneath the
                accolades, a quiet restlessness stirred.
              </p>
              <p>
                Enter Daniel Boateng Sarpong, a titan in Ghana&apos;s gold industry. Over cups of bitter cocoa
                tea, Job shared his vision. Daniel listened, his seasoned eyes narrowing in thought.
                &ldquo;You&apos;re asking to reshape an entire sector,&rdquo; he said. &ldquo;But if anyone can do it, Job,
                it&apos;s you.&rdquo; Their handshake sealed a partnership rooted in trust. Together, they
                drafted the blueprint for the Chamber of Licensed Gold Buyers (CLGB)—a sanctuary where
                transparency and solidarity would reign.
              </p>
              <p>
                Launching CLGB was no small feat. Skeptics doubted. Competitors bristled. Yet Job&apos;s
                unwavering faith and Daniel&apos;s industry clout turned tides. They lobbied policymakers,
                highlighting how structured trade could curb illegal mining and empower communities.
                Workshops sprouted, training youth in ethical practices; cooperatives formed, ensuring
                fair prices for small-scale miners. The government took notice, weaving CLGB&apos;s insights
                into national policy.
              </p>
              <p>
                Job&apos;s success was never just about wealth. It was about people. He dreamed of industries
                where Ghana&apos;s youth could thrive, where opportunity wasn&apos;t a privilege but a promise. One
                evening, as the sun dipped below the horizon, he retreated to his favorite spot—a modest
                chapel on the outskirts of Kumasi. There, in the silence of prayer, clarity struck like
                lightning. &ldquo;Bring them together,&rdquo; a voice within whispered. &ldquo;Unite the gold buyers. Lift
                them as one.&rdquo; Gold trading, a lifeline for many Ghanaians, was fragmented. Licensed
                buyers operated in isolation, vulnerable to shifting policies and exploitation. Job
                envisioned a chamber—a collective voice to advocate for fair practices, training, and
                youth employment.
              </p>
              <p>
                Today, CLGB stands as a testament to Job&apos;s creed. His stores may have sold smartphones,
                but his true currency was always connection—between people, principles, and progress.
                Colleagues speak of his calm demeanor in storms, his laughter in adversity, and the Bible
                perpetually on his desk. &ldquo;Deal with Job,&rdquo; they say, &ldquo;and you deal with honesty
                incarnate.&rdquo; As Ghana&apos;s gold industry flourishes under CLGB&apos;s wing, Job&apos;s dream lives on: a
                nation where youth no longer chase opportunity but shape it, where integrity glimmers
                brighter than gold. And in his quiet chapel, he still kneels—not to ask, but to give
                thanks. For the vision, the struggle, and the chance to serve.
              </p>
              <p className="font-display italic" style={{ color: "rgba(250,246,238,0.9)" }}>
                Inspired by faith. Forged by diligence. A legacy for Ghana.
              </p>
            </div>
          </div>
        </div>

        {/* PROFILE 2 — Daniel Boateng Sarpong (image right, content left on desktop) */}
        <div
          id="daniel-boateng-sarpong"
          ref={profile2.ref}
          className="max-w-[1200px] mx-auto px-[60px] py-[100px] grid grid-cols-1 md:grid-cols-2 gap-20 items-start border-b border-[rgba(201,168,76,0.1)] bg-[#0a0a0a] transition-all duration-700 ease-out"
          style={{
            opacity: profile2.visible ? 1 : 0,
            transform: profile2.visible ? "translateY(0)" : "translateY(40px)",
          }}
        >
          <div className="relative order-1 md:order-2">
            <div className="relative w-full aspect-[3/4] overflow-hidden">
              <Image
                src="/co-founder-pic.webp"
                alt="Daniel Boateng Sarpong"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div
                className="absolute inset-0 border border-[rgba(201,168,76,0.2)] pointer-events-none z-[2]"
                aria-hidden
              />
            </div>
            <div
              className="absolute top-4 -left-4 -right-4 -bottom-4 border border-[rgba(201,168,76,0.1)] z-0"
              aria-hidden
            />
            <div
              className="absolute top-6 left-0 z-[3] px-5 py-2 font-sans text-[9px] uppercase tracking-[3px] font-bold text-[#050505]"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #8B6914)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              Co-Founder
            </div>
          </div>
          <div className="order-2 md:order-1">
            <p
              className="font-sans text-[10px] uppercase tracking-[4px] text-[#C9A84C] mb-3"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              CO-FOUNDER · CLGB
            </p>
            <h2
              className="font-display font-light text-[#FAF6EE] mb-2"
              style={{
                fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                fontSize: "clamp(40px, 5vw, 64px)",
                fontWeight: 300,
              }}
            >
              Daniel Boateng Sarpong
            </h2>
            <div className="w-full h-px bg-[rgba(201,168,76,0.2)] my-6" />
            <div className="relative mb-8">
              <span
                className="absolute -top-2 -left-2 text-[64px] opacity-30"
                style={{ color: "#C9A84C" }}
                aria-hidden
              >
                &ldquo;
              </span>
              <blockquote
                className="font-display italic pl-12"
                style={{
                  fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                  fontSize: "clamp(18px, 2vw, 26px)",
                  color: "rgba(201,168,76,0.9)",
                  lineHeight: 1.5,
                }}
              >
                The world&apos;s problems aren&apos;t puzzles — they&apos;re invitations. And I RSVP &apos;YES&apos; in bold.
              </blockquote>
            </div>
            <div className="space-y-5 font-sans text-[14px] font-light leading-[1.9]" style={{ color: "rgba(250,246,238,0.65)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
              <p>
                The steam from the bitter cocoa tea curled into the air like a question mark, its earthy
                aroma mingling with the weight of the moment. Across the table, Job Osei Tutu—a man whose
                ideas often crackled like lightning—leaned forward, his voice trembling with urgency.
                &ldquo;Daniel, this industry… it&apos;s chaos. Exploitation, middlemen, no standards. What if we
                could change it?&rdquo;
              </p>
              <p>
                Daniel Boateng Sarpong sipped his tea, the bitterness grounding him. Silence stretched,
                but Job knew better than to rush a man who&apos;d built empires in the gaps between words.
                Daniel&apos;s mind flickered through decades: the grit of small-scale mining pits, the clink of
                gold weighed in backroom deals, the roar of Ashanti markets where fortunes were made and
                lost before noon. He&apos;d seen it all. Survived it all.
              </p>
              <p>
                Then, the small voice—the one that had whispered to him in studio booths while recording
                his album <em>Towobo Ansa na Waware</em>, the one that had nudged him to pivot from telecom
                sales to mining during Ghana&apos;s boom. This time, it was clearer: &ldquo;This isn&apos;t just an
                idea. It&apos;s a legacy.&rdquo;
              </p>
              <p>
                Job&apos;s vision was audacious: a Chamber of Licensed Gold Buyers (CLGB)—a unified force to
                advocate for Ghana&apos;s gold traders, enforce ethics, and empower local miners. To Daniel, it
                echoed his life&apos;s rhythm: order forged from chaos. He&apos;d done it before, turning Santasi
                Roundabout into a gold hub. He&apos;d done it mentoring Solani Global, transforming a startup
                into an award-winning titan. But this? This was bigger. &ldquo;You&apos;re asking me to build a
                system,&rdquo; Daniel said finally, his voice low. &ldquo;Not just a business.&rdquo; Job nodded.
              </p>
              <p>
                Daniel was no stranger to storms. As a boy hawking goods in Kwahu Pepease, he&apos;d learned
                to read markets like tides. As a territorial salesman for Onetouch Mobile, he&apos;d
                outmaneuvered rivals with guerrilla tactics. As a miner, he&apos;d navigated red tape and rogue
                excavators. But the CLGB was different—a chance to anchor an entire industry. He leaned
                into his strengths: <strong>The Strategist</strong>—drafting frameworks to unify buyers,
                miners, and regulators. <strong>The Bridge</strong>—leveraging partnerships with giants like
                AU Resources Ltd to inject credibility. <strong>The Mentor</strong>—rallying young
                entrepreneurs, just as he&apos;d done with Gilded Gold and Purity Group. &ldquo;This chamber
                isn&apos;t about us,&rdquo; he told Job. &ldquo;It&apos;s about the miner in Manso who&apos;s hustling daily.
                The trader in Wa, Kumasi, Tarkwa, Asanko, Dunkwao who lacks fair pricing. That&apos;s the
                legacy.&rdquo;
              </p>
              <p>
                According to Merriam-Webster, an alchemist is <em>someone who transforms things for the
                better</em>. Daniel&apos;s journey had always been one of reinvention: from musician to miner—his
                album <em>Ananse DE.G</em> taught him storytelling; mining taught him resilience. From salesman
                to savant: selling phones honed his hustle; brokering gold deals sharpened his instincts.
                From entrepreneur to elder: now, he wasn&apos;t just building businesses—he was building
                systems. Yet even as the CLGB took root, his mind raced ahead. Late nights were spent
                scribbling tech blueprints—a solution to track gold from pit to port, blockchain-backed,
                transparent. &ldquo;The future,&rdquo; he mused, &ldquo;is where ethics meet innovation.&rdquo;
              </p>
              <p>
                Today, the CLGB stands as a testament to that fateful tea-stained conversation, now
                injecting integrity into Ghana&apos;s gold veins. But for Daniel, it&apos;s just the beginning.
                &ldquo;Legacies aren&apos;t built in boardrooms,&rdquo; he says, eyes glinting with the fire of a man
                halfway up a new mountain. &ldquo;They&apos;re built in the quiet moments—when you choose the
                bitter truth over sweet complacency.&rdquo; As Ghana&apos;s gold glimmers brighter on the global
                stage, Daniel Boateng Sarpong is already coding his next act: a tech venture poised to
                revolutionize ethical sourcing. Because for him, every ending is a prologue.
              </p>
              <p
                className="font-sans text-[12px] italic pt-4"
                style={{ color: "rgba(201,168,76,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Connect with Daniel: Forged in gold, focused on tomorrow. Let&apos;s build legacies.
              </p>
            </div>
          </div>
        </div>

        {/* PROFILE 3 — Kwaku Amoah */}
        <div
          id="kwaku-amoah"
          ref={profile3.ref}
          className="max-w-[1200px] mx-auto px-[60px] py-[100px] grid grid-cols-1 md:grid-cols-2 gap-20 items-start bg-[#050505] transition-all duration-700 ease-out"
          style={{
            opacity: profile3.visible ? 1 : 0,
            transform: profile3.visible ? "translateY(0)" : "translateY(40px)",
          }}
        >
          <div className="relative order-2 md:order-1">
            <div className="relative w-full aspect-[3/4] overflow-hidden">
              <Image
                src="/AG.CEO.webp"
                alt="Kwaku Amoah"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div
                className="absolute inset-0 border border-[rgba(201,168,76,0.2)] pointer-events-none z-[2]"
                aria-hidden
              />
            </div>
            <div
              className="absolute top-4 -left-4 -right-4 -bottom-4 border border-[rgba(201,168,76,0.1)] z-0"
              aria-hidden
            />
            <div
              className="absolute top-6 left-0 z-[3] px-5 py-2 font-sans text-[9px] uppercase tracking-[3px] font-bold text-[#050505]"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #8B6914)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              Acting CEO
            </div>
          </div>
          <div className="order-1 md:order-2">
            <p
              className="font-sans text-[10px] uppercase tracking-[4px] text-[#C9A84C] mb-3"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              ACTING CEO · CLGB
            </p>
            <h2
              className="font-display font-light text-[#FAF6EE] mb-2"
              style={{
                fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
                fontSize: "clamp(40px, 5vw, 64px)",
                fontWeight: 300,
              }}
            >
              Kwaku Amoah
            </h2>
            <p
              className="font-display italic text-[18px] mb-6"
              style={{ color: "rgba(201,168,76,0.7)", fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}
            >
              Communication, Strategy and Business Development Consultant
            </p>
            <div className="w-full h-px bg-[rgba(201,168,76,0.2)] mb-6" />
            <div className="space-y-5 font-sans text-[14px] font-light leading-[1.9]" style={{ color: "rgba(250,246,238,0.65)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
              <p>
                Kwaku is your consummate business development professional. He has over a decade of
                experience in the banking sector and in speaking engagements across the industry. His
                experience cuts across various areas within the financial sector.
              </p>
              <p>
                Among a number of achievements, Kwaku has delivered presentations and speeches for and on
                behalf of organizations he has consulted for. He has earned a reputation within the
                industry for delivering presentations that have won organizations high-end projects.
              </p>
              <p>
                He is currently an Associate Business Consultant with the Office of the Receiver under the
                Central Bank of Ghana. Before his current position he was the Group Head, Business
                Development at CDH Financial Holdings.
              </p>
            </div>

            <h3
              className="font-display text-[20px] text-[#FAF6EE] mt-8 mb-4"
              style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}
            >
              Experience & Roles
            </h3>
            <ul className="space-y-4">
              {EXPERIENCE_ITEMS.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-[#C9A84C] text-[8px] flex-shrink-0 mt-1" aria-hidden>◆</span>
                  <span
                    className="font-sans text-[13px] font-light leading-[1.8]"
                    style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <h3
              className="font-display text-[20px] text-[#FAF6EE] mt-8 mb-4"
              style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}
            >
              Qualifications
            </h3>
            <ul className="space-y-4">
              {QUALIFICATIONS_ITEMS.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-[#C9A84C] text-[8px] flex-shrink-0 mt-1" aria-hidden>◆</span>
                  <span
                    className="font-sans text-[13px] font-light leading-[1.8]"
                    style={{ color: "rgba(250,246,238,0.6)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 3 — CTA BANNER */}
      <ContactBanner />
    </>
  );
}
