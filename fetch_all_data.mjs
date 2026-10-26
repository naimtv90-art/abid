import fs from 'fs';

async function fetchAll() {
  console.log('Fetching all products...');
  let products = [];
  try {
    const res = await fetch('https://abidhearing.com/wp-json/wc/store/v1/products?per_page=100');
    if (res.ok) {
      products = await res.json();
      console.log('Fetched products:', products.length);
      fs.writeFileSync('all_products.json', JSON.stringify(products, null, 2));
    }
  } catch(e) {
    console.error('Products error:', e);
  }

  console.log('Fetching all pages...');
  let pages = [];
  try {
    const res = await fetch('https://abidhearing.com/wp-json/wp/v2/pages?per_page=100');
    if (res.ok) {
      pages = await res.json();
      console.log('Fetched pages:', pages.length);
      fs.writeFileSync('all_pages.json', JSON.stringify(pages.map(p => ({
        id: p.id,
        slug: p.slug,
        title: p.title?.rendered,
        link: p.link,
        excerpt: p.excerpt?.rendered,
        content: p.content?.rendered
      })), null, 2));
    }
  } catch(e) {
    console.error('Pages error:', e);
  }

  // Also read homepage html to extract header, footer, menu, logos, phone numbers, social links
  if (fs.existsSync('homepage.html')) {
    const html = fs.readFileSync('homepage.html', 'utf8');
    // Extract phone numbers
    const phones = [...html.matchAll(/(?:\+?88)?01[3-9]\d{8}/g)].map(m => m[0]);
    console.log('Phones found:', [...new Set(phones)]);
    // Extract emails
    const emails = [...html.matchAll(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)].map(m => m[0]);
    console.log('Emails found:', [...new Set(emails)]);
  }
}

fetchAll();
