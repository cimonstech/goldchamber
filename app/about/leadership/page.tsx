import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { LeaderProfile } from "@/components/leadership/LeaderProfile";
import { IconList } from "@/components/leadership/IconList";
import {
  IconGraduation,
  IconBriefcase,
  IconAward,
  IconBuilding,
  IconChart,
  IconMicrophone,
} from "@/components/leadership/Icons";

export const metadata: Metadata = {
  title: "Leadership — Chamber of Licensed Gold Buyers",
  description:
    "Meet the leadership team: Job Osei Tutu (Founder), Daniel Boateng Sarpong (Co-Founder), Kwaku Amoah (Acting CEO).",
};

const aboutLinks = [
  { href: "/about", label: "Our Story", active: false },
  { href: "/about/leadership", label: "Leadership", active: true },
  { href: "/about/core-values", label: "Core Values", active: false },
  { href: "/about/why-choose-us", label: "Why Choose Us", active: false },
];

export default function LeadershipPage() {
  return (
    <>
      <PageHero
        title="Leadership"
        subtitle="The visionaries and stewards behind Ghana’s premier chamber for licensed gold buyers."
        label="About"
        links={aboutLinks}
      />
      <div className="bg-dark pt-4">
        {/* Job Osei Tutu — Founder */}
        <LeaderProfile
          name="Job Osei Tutu"
          role="Founder"
          image="/founder.webp"
          quote="Buy into the future with hope."
        >
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
          <p className="font-display text-cream/90 font-light italic pt-4">
            Inspired by faith. Forged by diligence. A legacy for Ghana.
          </p>
        </LeaderProfile>

        {/* Daniel Boateng Sarpong — Co-Founder */}
        <LeaderProfile
          name="Daniel Boateng Sarpong"
          role="Co-Founder"
          image="/co-founder-pic.webp"
          quote="The world's problems aren't puzzles—they're invitations. And I RSVP 'YES' in bold."
        >
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
          <p className="font-display text-cream/90 font-light pt-4">
            Connect with Daniel: Forged in gold, focused on tomorrow. Let&apos;s build legacies.
          </p>
        </LeaderProfile>

        {/* Kwaku Amoah — Acting CEO */}
        <LeaderProfile name="Kwaku Amoah" role="Acting CEO" image="/AG.CEO.webp" quote="">
          <p className="text-gold font-sans font-medium text-sm uppercase tracking-wider mb-2">
            Communication, Strategy and Business Development Consultant
          </p>
          <p>
            Kwaku is your consummate business development professional. He has over a decade of
            experience in the banking sector and in speaking engagements across the industry. His
            experience cuts across various areas within the financial sector. Among a number of
            achievements, Kwaku has delivered presentations and speeches for and on behalf of
            organizations he has consulted for. He has earned a reputation within the industry for
            delivering presentations that have won organizations high-end projects.
          </p>
          <p>
            He is currently an Associate Business Consultant with the Office of the Receiver under the
            Central Bank of Ghana. Before his current position he was the Group Head, Business
            Development at CDH Financial Holdings. Before joining the CDH Group in 2014, he gained
            gilt-edged experience working for a number of organizations.
          </p>

          <h3 className="font-display text-lg text-cream font-semibold mt-10 mb-4">
            Experience & roles
          </h3>
          <IconList
            items={[
              { icon: <IconBuilding />, text: "Office of the Receiver, Central Bank of Ghana — Associate Business Consultant (current)" },
              { icon: <IconChart />, text: "CDH Financial Holdings — Group Head, Business Development" },
              { icon: <IconBriefcase />, text: "Canal Group; Bank of Africa (Ghana) — business development, retail banking, risk management" },
              { icon: <IconBriefcase />, text: "Amalgamated Bank (Ghana); Cocoa Processing Company; GCB Bank" },
              { icon: <IconMicrophone />, text: "Consultant and trainer: strategic management, public communication, credit analysis, business negotiation, value creation, financial analysis, innovation management, CRM, sales and product development" },
            ]}
          />

          <h3 className="font-display text-lg text-cream font-semibold mt-10 mb-4">
            Qualifications
          </h3>
          <IconList
            items={[
              { icon: <IconGraduation />, text: "EMBA in Project Management (in progress) — Middlesex University, Dubai" },
              { icon: <IconGraduation />, text: "Bachelor of Science, specializing in Insurance" },
              { icon: <IconAward />, text: "Certificate in Cost Management Accounting — Chartered Institute of Management Accountants (CIMA)" },
            ]}
          />
        </LeaderProfile>
      </div>
    </>
  );
}
