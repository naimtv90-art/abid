import fs from 'fs';

const html = fs.readFileSync('homepage.html', 'utf8');

// Logo
const logoMatches = [...html.matchAll(/<img[^>]+(?:class=[\"'][^\"']*logo[^\"']*[\"']|alt=[\"'][^\"']*logo[^\"']*[\"'])[^>]*>/gi)];
console.log('--- LOGOS ---');
logoMatches.forEach(m => console.log(m[0]));

// Header info
console.log('--- HEADER SNIPPET ---');
const headerMatch = html.match(/<header[\s\S]*?<\/header>/i);
if (headerMatch) {
  // extract links inside header
  const links = [...headerMatch[0].matchAll(/<a\s+[^>]*href=[\"']([^\"']+)[\"'][^>]*>([\s\S]*?)<\/a>/gi)];
  console.log('Header links:');
  links.forEach(l => {
    const text = l[2].replace(/<[^>]+>/g, '').trim();
    if (text) console.log(`  ${text} -> ${l[1]}`);
  });
}

// Footer info
console.log('--- FOOTER SNIPPET ---');
const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/i);
if (footerMatch) {
  const fText = footerMatch[0].replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  const links = [...footerMatch[0].matchAll(/<a\s+[^>]*href=[\"']([^\"']+)[\"'][^>]*>([\s\S]*?)<\/a>/gi)];
  console.log('Footer links:');
  links.forEach(l => {
    const text = l[2].replace(/<[^>]+>/g, '').trim();
    if (text) console.log(`  ${text} -> ${l[1]}`);
  });
}

// All images
const allImgs = [...html.matchAll(/src=[\"'](https?:\/\/[^\"']+\.(?:png|jpg|jpeg|svg|webp))[\"']/gi)].map(m => m[1]);
console.log('--- UNIQUE IMAGES (' + [...new Set(allImgs)].length + ') ---');
[...new Set(allImgs)].slice(0, 20).forEach(img => console.log(img));
