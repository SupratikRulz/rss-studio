export interface DiscoverSource {
  title: string;
  url: string;
  siteUrl: string;
  description: string;
}

export interface DiscoverCategory {
  id: string;
  name: string;
  featured: string;
  sources: DiscoverSource[];
}

export interface DiscoverSection {
  title: string;
  categories: DiscoverCategory[];
}

export const DISCOVER_SECTIONS: DiscoverSection[] = [
  {
    title: "Popular Topics",
    categories: [
      {
        id: "tech",
        name: "Tech",
        featured: "The Verge",
        sources: [
          { title: "The Verge", url: "https://www.theverge.com/rss/index.xml", siteUrl: "https://www.theverge.com", description: "Technology, science, art, and culture" },
          { title: "TechCrunch", url: "https://techcrunch.com/feed/", siteUrl: "https://techcrunch.com", description: "Startup and technology news" },
          { title: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/index", siteUrl: "https://arstechnica.com", description: "Serving the technologist for over 25 years" },
          { title: "Wired", url: "https://www.wired.com/feed/rss", siteUrl: "https://www.wired.com", description: "In-depth coverage of current and future trends in technology" },
          { title: "Engadget", url: "https://www.engadget.com/rss.xml", siteUrl: "https://www.engadget.com", description: "The original home for technology news and reviews" },
          { title: "MIT Technology Review", url: "https://www.technologyreview.com/feed/", siteUrl: "https://www.technologyreview.com", description: "Making technology a greater force for good" },
        ],
      },
      {
        id: "cyber-security",
        name: "Cyber Security",
        featured: "The Hacker News",
        sources: [
          { title: "The Hacker News", url: "https://feeds.feedburner.com/TheHackersNews", siteUrl: "https://thehackernews.com", description: "Most trusted cybersecurity news platform" },
          { title: "Krebs on Security", url: "https://krebsonsecurity.com/feed/", siteUrl: "https://krebsonsecurity.com", description: "In-depth security news and investigation" },
          { title: "Schneier on Security", url: "https://www.schneier.com/feed/atom/", siteUrl: "https://www.schneier.com", description: "Security matters by Bruce Schneier" },
          { title: "Dark Reading", url: "https://www.darkreading.com/rss.xml", siteUrl: "https://www.darkreading.com", description: "Cybersecurity news and analysis" },
          { title: "Threatpost", url: "https://threatpost.com/feed/", siteUrl: "https://threatpost.com", description: "The first stop for security news" },
        ],
      },
      {
        id: "business",
        name: "Business",
        featured: "Bloomberg",
        sources: [
          { title: "Bloomberg", url: "https://feeds.bloomberg.com/markets/news.rss", siteUrl: "https://www.bloomberg.com", description: "Global business and financial news" },
          { title: "Harvard Business Review", url: "https://hbr.org/resources/pdfs/tools/rss_feeds.html", siteUrl: "https://hbr.org", description: "Ideas and advice for leaders" },
          { title: "Inc.", url: "https://www.inc.com/rss", siteUrl: "https://www.inc.com", description: "Advice and resources for entrepreneurs" },
          { title: "Fast Company", url: "https://www.fastcompany.com/latest/rss", siteUrl: "https://www.fastcompany.com", description: "Business innovation and design" },
          { title: "Entrepreneur", url: "https://www.entrepreneur.com/latest.rss", siteUrl: "https://www.entrepreneur.com", description: "News and how-to for business owners" },
        ],
      },
      {
        id: "news",
        name: "News",
        featured: "BBC News",
        sources: [
          { title: "BBC News", url: "https://feeds.bbci.co.uk/news/rss.xml", siteUrl: "https://www.bbc.com/news", description: "BBC News - World" },
          { title: "NPR News", url: "https://feeds.npr.org/1001/rss.xml", siteUrl: "https://www.npr.org", description: "NPR News headlines" },
          { title: "Reuters", url: "https://www.reutersagency.com/feed/", siteUrl: "https://www.reuters.com", description: "International news agency" },
          { title: "The Guardian", url: "https://www.theguardian.com/world/rss", siteUrl: "https://www.theguardian.com", description: "Latest world news" },
          { title: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml", siteUrl: "https://www.aljazeera.com", description: "Breaking news and features" },
        ],
      },
    ],
  },
  {
    title: "Industries",
    categories: [
      {
        id: "advertising",
        name: "Advertising",
        featured: "Adweek",
        sources: [
          { title: "Adweek", url: "https://www.adweek.com/feed/", siteUrl: "https://www.adweek.com", description: "Breaking news in advertising and media" },
          { title: "Marketing Land", url: "https://martech.org/feed/", siteUrl: "https://martech.org", description: "Marketing technology news" },
          { title: "Digiday", url: "https://digiday.com/feed/", siteUrl: "https://digiday.com", description: "Media and marketing news" },
        ],
      },
      {
        id: "automotive",
        name: "Automotive",
        featured: "Autoblog",
        sources: [
          { title: "Autoblog", url: "https://www.autoblog.com/rss.xml", siteUrl: "https://www.autoblog.com", description: "Car news and reviews" },
          { title: "Electrek", url: "https://electrek.co/feed/", siteUrl: "https://electrek.co", description: "Electric vehicle and green energy news" },
          { title: "The Drive", url: "https://www.thedrive.com/feed", siteUrl: "https://www.thedrive.com", description: "Automotive news and culture" },
        ],
      },
      {
        id: "healthcare",
        name: "Healthcare",
        featured: "STAT News",
        sources: [
          { title: "STAT News", url: "https://www.statnews.com/feed/", siteUrl: "https://www.statnews.com", description: "Health, medicine, and life sciences" },
          { title: "Fierce Healthcare", url: "https://www.fiercehealthcare.com/rss/xml", siteUrl: "https://www.fiercehealthcare.com", description: "Healthcare industry news" },
          { title: "Health Affairs", url: "https://www.healthaffairs.org/action/showFeed?type=etoc&feed=rss&jc=hlthaff", siteUrl: "https://www.healthaffairs.org", description: "Health policy journal" },
        ],
      },
      {
        id: "finance",
        name: "Financial Services",
        featured: "Calculated Risk",
        sources: [
          { title: "Calculated Risk", url: "https://www.calculatedriskblog.com/feeds/posts/default?alt=rss", siteUrl: "https://www.calculatedriskblog.com", description: "Finance and economics blog" },
          { title: "Finextra", url: "https://www.finextra.com/rss/headlines.aspx", siteUrl: "https://www.finextra.com", description: "Financial technology news" },
          { title: "The Motley Fool", url: "https://www.fool.com/feeds/index.aspx", siteUrl: "https://www.fool.com", description: "Stock market and investment advice" },
        ],
      },
      {
        id: "energy",
        name: "Energy",
        featured: "CleanTechnica",
        sources: [
          { title: "CleanTechnica", url: "https://cleantechnica.com/feed/", siteUrl: "https://cleantechnica.com", description: "Clean energy news and analysis" },
          { title: "Utility Dive", url: "https://www.utilitydive.com/feeds/news/", siteUrl: "https://www.utilitydive.com", description: "Utility industry news" },
        ],
      },
      {
        id: "real-estate",
        name: "Real Estate",
        featured: "Inman",
        sources: [
          { title: "Inman", url: "https://www.inman.com/feed/", siteUrl: "https://www.inman.com", description: "Real estate news for agents and brokers" },
          { title: "Curbed", url: "https://www.curbed.com/rss/index.xml", siteUrl: "https://www.curbed.com", description: "Real estate and architecture" },
        ],
      },
      {
        id: "retail",
        name: "Retail",
        featured: "Retail Dive",
        sources: [
          { title: "Retail Dive", url: "https://www.retaildive.com/feeds/news/", siteUrl: "https://www.retaildive.com", description: "Retail industry news and trends" },
          { title: "NRF", url: "https://nrf.com/rss.xml", siteUrl: "https://nrf.com", description: "National Retail Federation" },
        ],
      },
    ],
  },
  {
    title: "Skills",
    categories: [
      {
        id: "programming",
        name: "Programming",
        featured: "Martin Fowler",
        sources: [
          { title: "Martin Fowler", url: "https://martinfowler.com/feed.atom", siteUrl: "https://martinfowler.com", description: "Software development and architecture" },
          { title: "Hacker News", url: "https://hnrss.org/frontpage", siteUrl: "https://news.ycombinator.com", description: "Links for the intellectually curious" },
          { title: "CSS-Tricks", url: "https://css-tricks.com/feed/", siteUrl: "https://css-tricks.com", description: "Tips, tricks, and techniques on CSS" },
          { title: "Smashing Magazine", url: "https://www.smashingmagazine.com/feed", siteUrl: "https://www.smashingmagazine.com", description: "Web design and development" },
          { title: "DEV Community", url: "https://dev.to/feed", siteUrl: "https://dev.to", description: "Community of software developers" },
        ],
      },
      {
        id: "data-science",
        name: "Data Science",
        featured: "KDnuggets",
        sources: [
          { title: "KDnuggets", url: "https://www.kdnuggets.com/feed", siteUrl: "https://www.kdnuggets.com", description: "AI, analytics, data science, machine learning" },
          { title: "Towards Data Science", url: "https://towardsdatascience.com/feed", siteUrl: "https://towardsdatascience.com", description: "Sharing data science concepts and ideas" },
          { title: "Machine Learning Mastery", url: "https://machinelearningmastery.com/feed/", siteUrl: "https://machinelearningmastery.com", description: "Making ML accessible" },
        ],
      },
      {
        id: "entrepreneurship",
        name: "Entrepreneurship",
        featured: "Entrepreneur",
        sources: [
          { title: "Entrepreneur", url: "https://www.entrepreneur.com/latest.rss", siteUrl: "https://www.entrepreneur.com", description: "Business startup news" },
          { title: "Seth Godin", url: "https://seths.blog/feed/", siteUrl: "https://seths.blog", description: "Seth's thoughts on marketing and life" },
          { title: "Paul Graham Essays", url: "http://www.aaronsw.com/2002/feeds/pgessays.rss", siteUrl: "http://www.paulgraham.com", description: "Essays on startups and programming" },
        ],
      },
      {
        id: "leadership",
        name: "Leadership",
        featured: "HBR",
        sources: [
          { title: "Harvard Business Review", url: "https://hbr.org/resources/pdfs/tools/rss_feeds.html", siteUrl: "https://hbr.org", description: "Ideas and advice for leaders" },
          { title: "First Round Review", url: "https://review.firstround.com/feed.xml", siteUrl: "https://review.firstround.com", description: "Advice for startup founders" },
          { title: "McKinsey Insights", url: "https://www.mckinsey.com/insights/rss", siteUrl: "https://www.mckinsey.com", description: "Management consulting insights" },
        ],
      },
      {
        id: "seo",
        name: "SEO",
        featured: "Moz",
        sources: [
          { title: "Moz Blog", url: "https://moz.com/devblog/feed", siteUrl: "https://moz.com", description: "SEO software and education" },
          { title: "Search Engine Journal", url: "https://www.searchenginejournal.com/feed/", siteUrl: "https://www.searchenginejournal.com", description: "SEO, PPC, content, and social media news" },
          { title: "Search Engine Land", url: "https://searchengineland.com/feed", siteUrl: "https://searchengineland.com", description: "Search marketing news" },
        ],
      },
      {
        id: "design",
        name: "Design",
        featured: "Awwwards",
        sources: [
          { title: "Awwwards", url: "https://www.awwwards.com/blog/feed", siteUrl: "https://www.awwwards.com", description: "Website awards and inspiration" },
          { title: "A List Apart", url: "https://alistapart.com/main/feed/", siteUrl: "https://alistapart.com", description: "Web design and development" },
          { title: "Sidebar", url: "https://sidebar.io/feed.xml", siteUrl: "https://sidebar.io", description: "Five best design links every day" },
        ],
      },
      {
        id: "photography",
        name: "Photography",
        featured: "Digital Photography",
        sources: [
          { title: "PetaPixel", url: "https://petapixel.com/feed/", siteUrl: "https://petapixel.com", description: "Photography and camera news" },
          { title: "Digital Photography School", url: "https://digital-photography-school.com/feed/", siteUrl: "https://digital-photography-school.com", description: "Photography tips and tutorials" },
          { title: "Fstoppers", url: "https://fstoppers.com/rss.xml", siteUrl: "https://fstoppers.com", description: "Photography news and community" },
        ],
      },
      {
        id: "writing",
        name: "Writing",
        featured: "The Write Practice",
        sources: [
          { title: "The Write Practice", url: "https://thewritepractice.com/feed/", siteUrl: "https://thewritepractice.com", description: "Writing prompts and advice" },
          { title: "Copyblogger", url: "https://copyblogger.com/feed/", siteUrl: "https://copyblogger.com", description: "Content marketing and copywriting" },
        ],
      },
    ],
  },
  {
    title: "Fun",
    categories: [
      {
        id: "comics",
        name: "Comics",
        featured: "xkcd",
        sources: [
          { title: "xkcd", url: "https://xkcd.com/rss.xml", siteUrl: "https://xkcd.com", description: "A webcomic of romance, sarcasm, math, and language" },
          { title: "The Oatmeal", url: "https://theoatmeal.com/feed/rss", siteUrl: "https://theoatmeal.com", description: "Comics by Matthew Inman" },
          { title: "Dilbert", url: "https://dilbert.com/feed", siteUrl: "https://dilbert.com", description: "Office humor comic strip" },
        ],
      },
      {
        id: "gaming",
        name: "Gaming",
        featured: "Kotaku",
        sources: [
          { title: "Kotaku", url: "https://kotaku.com/rss", siteUrl: "https://kotaku.com", description: "Gaming news, reviews, and culture" },
          { title: "IGN", url: "https://feeds.feedburner.com/ign/all", siteUrl: "https://www.ign.com", description: "Video games, movies, TV, and more" },
          { title: "Polygon", url: "https://www.polygon.com/rss/index.xml", siteUrl: "https://www.polygon.com", description: "Gaming news, reviews, and opinion" },
          { title: "PC Gamer", url: "https://www.pcgamer.com/rss/", siteUrl: "https://www.pcgamer.com", description: "PC gaming news and reviews" },
        ],
      },
      {
        id: "food",
        name: "Food",
        featured: "Serious Eats",
        sources: [
          { title: "Serious Eats", url: "https://www.seriouseats.com/feeds/serious-eats", siteUrl: "https://www.seriouseats.com", description: "Recipes, techniques, and food science" },
          { title: "Smitten Kitchen", url: "https://smittenkitchen.com/feed/", siteUrl: "https://smittenkitchen.com", description: "Fearless cooking from a tiny kitchen" },
          { title: "Budget Bytes", url: "https://www.budgetbytes.com/feed/", siteUrl: "https://www.budgetbytes.com", description: "Delicious recipes designed for small budgets" },
        ],
      },
      {
        id: "travel",
        name: "Travel",
        featured: "The Points Guy",
        sources: [
          { title: "The Points Guy", url: "https://thepointsguy.com/feed/", siteUrl: "https://thepointsguy.com", description: "Travel tips and credit card rewards" },
          { title: "Nomadic Matt", url: "https://www.nomadicmatt.com/travel-blog/feed/", siteUrl: "https://www.nomadicmatt.com", description: "Budget travel tips" },
          { title: "Lonely Planet", url: "https://www.lonelyplanet.com/blog/feed/atom", siteUrl: "https://www.lonelyplanet.com", description: "Travel guides and inspiration" },
        ],
      },
      {
        id: "music",
        name: "Music",
        featured: "Stereogum",
        sources: [
          { title: "Stereogum", url: "https://www.stereogum.com/feed/", siteUrl: "https://www.stereogum.com", description: "Music news and album reviews" },
          { title: "Pitchfork", url: "https://pitchfork.com/feed/feed-news/rss", siteUrl: "https://pitchfork.com", description: "Music reviews, ratings, and news" },
          { title: "Consequence of Sound", url: "https://consequence.net/feed/", siteUrl: "https://consequence.net", description: "Music news and culture" },
        ],
      },
      {
        id: "culture",
        name: "Culture",
        featured: "Boing Boing",
        sources: [
          { title: "Boing Boing", url: "https://boingboing.net/feed", siteUrl: "https://boingboing.net", description: "A directory of mostly wonderful things" },
          { title: "Open Culture", url: "https://www.openculture.com/feed", siteUrl: "https://www.openculture.com", description: "Free cultural and educational media" },
          { title: "Brain Pickings", url: "https://feeds.feedburner.com/brainpickings/rss", siteUrl: "https://www.themarginalian.org", description: "An inventory of the meaningful life" },
        ],
      },
      {
        id: "science",
        name: "Science",
        featured: "Nature",
        sources: [
          { title: "Nature", url: "https://www.nature.com/nature.rss", siteUrl: "https://www.nature.com", description: "International weekly journal of science" },
          { title: "Scientific American", url: "https://rss.sciam.com/ScientificAmerican-Global", siteUrl: "https://www.scientificamerican.com", description: "Science news, expert analysis" },
          { title: "New Scientist", url: "https://www.newscientist.com/section/news/feed/", siteUrl: "https://www.newscientist.com", description: "Science and technology news" },
          { title: "NASA", url: "https://www.nasa.gov/rss/dyn/breaking_news.rss", siteUrl: "https://www.nasa.gov", description: "Latest news from NASA" },
        ],
      },
      {
        id: "sports",
        name: "Sports",
        featured: "ESPN",
        sources: [
          { title: "ESPN", url: "https://www.espn.com/espn/rss/news", siteUrl: "https://www.espn.com", description: "Sports news and scores" },
          { title: "Deadspin", url: "https://deadspin.com/rss", siteUrl: "https://deadspin.com", description: "Sports news without access" },
          { title: "The Athletic", url: "https://theathletic.com/feed/", siteUrl: "https://theathletic.com", description: "In-depth sports journalism" },
        ],
      },
    ],
  },
];

export function searchDiscoverSources(query: string): DiscoverCategory[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: DiscoverCategory[] = [];

  for (const section of DISCOVER_SECTIONS) {
    for (const cat of section.categories) {
      const matchingSources = cat.sources.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.siteUrl.toLowerCase().includes(q) ||
          s.url.toLowerCase().includes(q)
      );

      if (
        matchingSources.length > 0 ||
        cat.name.toLowerCase().includes(q) ||
        cat.id.toLowerCase().includes(q)
      ) {
        results.push({
          ...cat,
          sources:
            matchingSources.length > 0 ? matchingSources : cat.sources,
        });
      }
    }
  }

  return results;
}
