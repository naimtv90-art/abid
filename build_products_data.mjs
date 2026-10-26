import fs from 'fs';
import path from 'path';

const rawProducts = JSON.parse(fs.readFileSync('all_products.json', 'utf8'));

// SEO & GEO Image Mapping
function resolveSeoGeoImage(prod) {
  const name = prod.name.toLowerCase();

  if (name.includes('remote control')) return '/images/abid-phonak-hearing-aid-wireless-remote-control-bangladesh.jpg';
  if (name.includes('vitus +') || name.includes('vitus')) return '/images/abid-phonak-vitus-digital-bte-hearing-aid-dhaka-bangladesh.png';
  if (name.includes('virto')) return '/images/abid-phonak-virto-custom-in-the-ear-hearing-aid-dhaka-bangladesh.jpg';
  if (name.includes('sky')) return '/images/abid-phonak-sky-marvel-pediatric-hearing-aid-dhaka.webp';
  if (name.includes('roger table')) return '/images/abid-phonak-roger-table-mic-ii-wireless-system-bangladesh.jpg';
  if (name.includes('roger on') || name.includes('roger select') || name.includes('roger neckloop')) return '/images/abid-phonak-roger-table-mic-ii-wireless-system-bangladesh.jpg';
  if (name.includes('partnermic')) return '/images/abid-phonak-hearing-aid-wireless-remote-control-bangladesh.jpg';
  if (name.includes('lyric')) return '/images/abid-completely-in-canal-cic-invisible-hearing-aid-bangladesh.jpg';
  if (name.includes('titanium')) return '/images/abid-phonak-virto-marvel-titanium-hearing-aid-dhaka.jpg';
  if (name.includes('paradise')) return '/images/abid-phonak-naida-lumity-super-power-hearing-aid-dhaka.webp';
  if (name.includes('marvel') || name.includes('audéo') || name.includes('bolero')) return '/images/abid-phonak-audeo-marvel-hearing-aid-price-bangladesh.jpg';
  if (name.includes('battery')) return '/images/abid-rexton-hearing-aid-battery-price-uttara-dhaka-bangladesh.webp';
  if (name.includes('cleaning') || name.includes('repair')) return '/images/abid-hearing-aid-repair-and-servicing-lab-dhaka-bangladesh.jpg';
  if (name.includes('pediatric')) return '/images/abid-phonak-pediatric-child-hearing-care-kit-bangladesh.png';
  if (name.includes('rexton')) return '/images/abid-rexton-arena-hp3-super-power-bte-hearing-aid-dhaka.webp';
  if (name.includes('unitron')) return '/images/abid-unitron-max-digital-bte-hearing-aid-uttara-dhaka.webp';
  if (name.includes('cros')) return '/images/abid-phonak-audeo-marvel-hearing-aid-price-bangladesh.jpg';
  if (name.includes('infinio')) return '/images/abid-phonak-infinio-digital-hearing-aid-dhaka.jpeg';
  if (name.includes('cic')) return '/images/abid-phonak-cic-invisible-hearing-aid-dhaka-bangladesh.jpeg';
  if (name.includes('q 50') || name.includes('q 70')) return '/images/abid-phonak-naida-q70-digital-hearing-aid-dhaka.jpg';
  if (name.includes('l 30') || name.includes('l30')) return '/images/abid-phonak-naida-l30-rechargeable-hearing-aid-uttara-dhaka.webp';

  return '/images/abid-phonak-naida-ultra-power-bte-hearing-aid-uttara-dhaka.png';
}

function resolveBrand(name) {
  const n = name.toLowerCase();
  if (n.includes('rexton')) return 'Rexton';
  if (n.includes('unitron')) return 'Unitron';
  if (n.includes('signia')) return 'Signia';
  if (n.includes('phonak') || n.includes('naida') || n.includes('virto') || n.includes('sky') || n.includes('terra') || n.includes('infinio') || n.includes('vitus') || n.includes('roger') || n.includes('lyric') || n.includes('audéo') || n.includes('bolero')) return 'Phonak';
  return 'Phonak / General';
}

function resolveCategory(prod) {
  if (prod.categories && prod.categories.length > 0) {
    const cats = prod.categories.map(c => c.name);
    if (cats.some(c => c.toLowerCase().includes('battery'))) return 'Batteries';
    if (cats.some(c => c.toLowerCase().includes('accessories'))) return 'Accessories';
    if (cats.some(c => c.toLowerCase().includes('mold') || c.toLowerCase().includes('fitting'))) return 'Custom Fittings';
  }
  return 'Hearing Aids';
}

function cleanHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#8211;/g, '-').replace(/&#8217;/g, "'").replace(/&#x2122;/g, '™').replace(/\s+/g, ' ').trim();
}

const cleaned = rawProducts.map(p => {
  const img = resolveSeoGeoImage(p);
  const brand = resolveBrand(p.name);
  const category = resolveCategory(p);
  const cleanName = p.name.replace(/&#x2122;/g, '™').replace(/&amp;/g, '&').replace(/&#8211;/g, '-');
  
  // SEO & GEO Alt Text
  const altText = `${cleanName} - Digital Hearing Aid Price in Uttara, Dhaka, Bangladesh | Abid Hearing Care Centre`;

  return {
    id: p.id,
    name: cleanName,
    slug: p.slug,
    brand,
    category,
    image: img,
    altText,
    priceText: 'Call for Best Price: 01771-237740',
    shortDescription: cleanHtml(p.short_description) || 'Premium digital hearing solution tested and fitted with clinical precision at Abid Hearing Care Centre, Sector-7, Uttara, Dhaka.',
    description: p.description || p.short_description || '<p>High-quality digital hearing instrument fitted with computerized accuracy in Dhaka, Bangladesh.</p>',
    plainDescription: cleanHtml(p.description).slice(0, 300) + '...',
    inStock: true
  };
});

fs.mkdirSync('data', { recursive: true });
fs.writeFileSync('data/products.js', `export const products = ${JSON.stringify(cleaned, null, 2)};\n`);
console.log('Saved data/products.js with', cleaned.length, 'SEO & GEO enriched products.');
