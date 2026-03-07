export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  date: string;
  month: string;
  year: string;
  category: string;
  image: string;
  featured: boolean;
}

export const articles: Article[] = [
  {
    slug: "press-release-oct-2025",
    title: "Press Release — 23rd October 2025",
    excerpt:
      "The latest official communication from the Chamber of Licensed Gold Buyers.",
    body: [
      "The Chamber of Licensed Gold Buyers (CLGB) hereby issues the following official communication to all members, regulatory partners, and stakeholders in Ghana's gold trading sector.",
      "This press release affirms the continued commitment of CLGB to upholding the highest standards of ethical gold trading, regulatory compliance, and member support across all regions of Ghana.",
      "CLGB continues to work closely with the Ghana Gold Board (GoldBod), the Ghana Minerals Commission, and the Bank of Ghana to ensure that all licensed gold buyers operate within the full framework of Ghana's gold trading legislation.",
      "Members are reminded of their obligations under the CLGB Code of Conduct and are encouraged to contact the secretariat with any regulatory queries or compliance concerns.",
      "Further communications will be issued as developments arise. The Chamber thanks all members for their continued commitment to ethical and transparent gold trading.",
    ],
    date: "23 Oct 2025",
    month: "Oct",
    year: "2025",
    category: "Press Release",
    image: "/gold-bars.jpg",
    featured: true,
  },
  {
    slug: "goldbod-receipts-enforcement",
    title: "GoldBod Begins Reinforcement of GoldBod Receipts",
    excerpt:
      "The Ghana Gold Board has begun enforcing the mandatory use of GoldBod receipts by all licensed gold buyers.",
    body: [
      "The Ghana Gold Board (GoldBod) has formally commenced the enforcement of mandatory GoldBod receipts across all licensed gold buying operations in Ghana. This enforcement applies to all CLGB members and all other licensed gold buyers operating under GoldBod's regulatory framework.",
      "GoldBod receipts serve as the official documentation of every gold transaction, providing a traceable record that links the transaction to a licensed buyer, a verified source, and a declared quantity and purity of gold.",
      "The enforcement of GoldBod receipts is a significant step forward for the transparency and accountability of Ghana's gold sector. CLGB fully supports this initiative and has been working with GoldBod to ensure all members are prepared for full compliance.",
      "Members who have not yet integrated GoldBod receipts into their operations are urged to do so immediately. The Chamber's secretariat is available to provide guidance on the integration process and to answer any compliance questions.",
      "Failure to use GoldBod receipts in transactions may result in regulatory sanctions, suspension of trading licences, or referral to the appropriate authorities. CLGB strongly advises all members to treat this requirement as a priority.",
    ],
    date: "Oct 2025",
    month: "Oct",
    year: "2025",
    category: "Regulatory",
    image: "/gold-bars2.jpg",
    featured: false,
  },
  {
    slug: "june-21-deadline",
    title: "No More Extensions After June 21 Deadline",
    excerpt:
      "GoldBod has issued a final warning to unlicensed traders following the June 21 licensing deadline.",
    body: [
      "The Ghana Gold Board (GoldBod) has issued a firm and final warning to all unlicensed gold traders operating in Ghana: the June 21 licensing deadline has passed and no further extensions will be granted.",
      "All individuals and entities engaged in gold buying, selling, processing, or brokering in Ghana are required by law to hold a valid GoldBod licence. The June 21 deadline was the final date by which unlicensed operators were required to either obtain their licence or cease operations.",
      "GoldBod has confirmed that enforcement operations are now underway across all major gold trading regions in Ghana, including Kumasi, Tarkwa, Obuasi, and Accra. Unlicensed traders found operating after this date face immediate suspension, confiscation of goods, and potential criminal prosecution.",
      "CLGB urges any members who have not yet completed their GoldBod licensing to contact the secretariat immediately. The Chamber has dedicated support staff available to assist members through the licensing process on an urgent basis.",
      "This development underscores the importance of operating within the formal, licensed framework that CLGB has always advocated for. A licensed, transparent gold sector is in the interest of every trader, miner, and buyer in Ghana.",
    ],
    date: "Jun 2025",
    month: "Jun",
    year: "2025",
    category: "Industry News",
    image: "/goldbars3.jpeg",
    featured: false,
  },
];
