
import { createClient } from '@supabase/supabase-js';

// Env vars will be passed via command line


const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY; // Using anon key for now

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const portfolioItems = [
  {
    title: "Sophia Laurent",
    category: "photographer",
    media_type: "image",
    media_url: "/images/portfolio/portfolio-photographer.jpg",
    status: "published",
    thumbnail_url: "/images/portfolio/portfolio-photographer.jpg"
  },
  {
    title: "Nexus AI",
    category: "business",
    media_type: "image",
    media_url: "/images/portfolio/portfolio-startup.jpg",
    status: "published",
    thumbnail_url: "/images/portfolio/portfolio-startup.jpg"
  },
  {
    title: "Eternal Moments",
    category: "personal", // approximating wedding to personal or creating a new category if allowed, but schema restricts. 
    // Wait, AdminPortfolio.tsx has categories: photographer, business, personal, agency.
    // Wedding Studio -> maybe Personal or Photographer? 'photographer' seems best fit or 'personal'. 
    // Let's us 'personal' for now or 'photographer'. The UI said "Wedding Studio". 
    // Let's stick to valid categories: 'photographer', 'business', 'personal', 'agency'.
    // "Wedding Studio" sounds like a business or photographer. I'll use 'business' for now.
    media_type: "image",
    media_url: "/images/portfolio/portfolio-wedding.jpg",
    status: "published",
    thumbnail_url: "/images/portfolio/portfolio-wedding.jpg"
  },
  {
    title: "Marcus Chen",
    category: "personal",
    media_type: "image",
    media_url: "/images/portfolio/portfolio-personal.jpg",
    status: "published",
    thumbnail_url: "/images/portfolio/portfolio-personal.jpg"
  },
  {
    title: "Iron Peak Fitness",
    category: "business",
    media_type: "image",
    media_url: "/images/portfolio/portfolio-gym.jpg",
    status: "published",
    thumbnail_url: "/images/portfolio/portfolio-gym.jpg"
  },
  {
    title: "Stellar Creative",
    category: "agency",
    media_type: "image",
    media_url: "/images/portfolio/portfolio-agency.jpg",
    status: "published",
    thumbnail_url: "/images/portfolio/portfolio-agency.jpg"
  },
];

async function seed() {
  console.log('Seeding portfolio items...');

  for (const item of portfolioItems) {
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert(item)
      .select();

    if (error) {
      console.error(`Error inserting ${item.title}:`, error.message);
    } else {
      console.log(`Inserted: ${item.title}`);
    }
  }

  console.log('Seeding complete.');
}

seed();
