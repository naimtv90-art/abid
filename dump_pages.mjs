import fs from 'fs';

const pages = JSON.parse(fs.readFileSync('all_pages.json', 'utf8'));
for (const p of pages) {
  fs.writeFileSync(`extracted_${p.slug}.html`, p.content || '');
}
console.log('Saved all page contents to extracted_<slug>.html');
