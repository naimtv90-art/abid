import fs from 'fs';
import path from 'path';

export const seoGeoImageMap = {
  'logo.png': 'abid-hearing-care-centre-logo-uttara-dhaka.png',
  '1.jpg': 'abid-digital-hearing-aid-fitting-specialist-uttara-dhaka-bangladesh.jpg',
  'phonak-virto.jpg': 'abid-phonak-virto-custom-in-the-ear-hearing-aid-dhaka-bangladesh.jpg',
  'cic.jpg': 'abid-completely-in-canal-cic-invisible-hearing-aid-bangladesh.jpg',
  'Naida_V_UP-1.png': 'abid-phonak-naida-ultra-power-bte-hearing-aid-uttara-dhaka.png',
  '11-scaled.jpg': 'abid-phonak-naida-q70-digital-hearing-aid-dhaka.jpg',
  '126293-14407249-1.jpg': 'abid-digital-hearing-aid-device-center-uttara-dhaka.jpg',
  'AM-STF-XP-BG-1.webp': 'abid-rexton-behind-the-ear-hearing-aid-bangladesh.webp',
  'digital-phonak-naida-l30-pr-bte-recharable-behind-the-ear-hearing-aid-500x500-1.webp': 'abid-phonak-naida-l30-rechargeable-hearing-aid-uttara-dhaka.webp',
  'digital-phonak-naida-l30-pr-bte-recharable-behind-the-ear-hearing-aid-500x500-2.webp': 'abid-phonak-naida-rechargeable-bte-hearing-aid-dhaka-bangladesh.webp',
  'download.jpeg': 'abid-audiology-hearing-test-clinic-uttara-dhaka.jpeg',
  'hearing-aid-clining-tools.jpg': 'abid-hearing-aid-cleaning-maintenance-tools-uttara-dhaka.jpg',
  'hearing-center.webp': 'abid-hearing-care-centre-clinic-dhaka-bangladesh.webp',
  'Hearing-Repair-Service-1.jpg': 'abid-hearing-aid-repair-and-servicing-lab-dhaka-bangladesh.jpg',
  'image-2.jpg': 'abid-diagnostic-audiometry-evaluation-dhaka-bangladesh.jpg',
  'images-14.jpeg': 'abid-phonak-infinio-digital-hearing-aid-dhaka.jpeg',
  'images-31.jpeg': 'abid-rexton-arena-digital-hearing-aid-bangladesh.jpeg',
  'images-34.jpeg': 'abid-phonak-cic-invisible-hearing-aid-dhaka-bangladesh.jpeg',
  'images.jpeg': 'abid-audiologist-hearing-aid-consultation-uttara-dhaka.jpeg',
  'max-1.webp': 'abid-unitron-max-super-power-hearing-aid-dhaka-bangladesh.webp',
  'max.webp': 'abid-unitron-max-digital-bte-hearing-aid-uttara-dhaka.webp',
  'Pediatric-Care-Kit.png': 'abid-phonak-pediatric-child-hearing-care-kit-bangladesh.png',
  'phonak-.webp': 'abid-phonak-naida-l30-digital-hearing-aid-bangladesh.webp',
  'phonak-naida-90_sky_v_p_.webp': 'abid-phonak-sky-marvel-pediatric-hearing-aid-dhaka.webp',
  'phonak-naida-l-1.webp': 'abid-phonak-naida-lumity-super-power-hearing-aid-dhaka.webp',
  'phonak-new-release-family.jpg': 'abid-phonak-audeo-marvel-hearing-aid-price-bangladesh.jpg',
  'phonak-one.jpg': 'abid-phonak-digital-hearing-aid-models-uttara-dhaka.jpg',
  'Phonak-RemoteControl.jpg': 'abid-phonak-hearing-aid-wireless-remote-control-bangladesh.jpg',
  'Phonak-Virto-Marvel.jpg': 'abid-phonak-virto-marvel-titanium-hearing-aid-dhaka.jpg',
  'Phonak-Vitus-150x150-1.png': 'abid-phonak-vitus-digital-bte-hearing-aid-dhaka-bangladesh.png',
  'PhonakNaidaLUPSandBeigePair.webp': 'abid-phonak-naida-lumity-ultra-power-pair-bangladesh.webp',
  'Rexton_Arena_HP_3_-1.webp': 'abid-rexton-arena-hp3-high-power-hearing-aid-bangladesh.webp',
  'Rexton_Arena_HP_3_.webp': 'abid-rexton-arena-hp3-super-power-bte-hearing-aid-dhaka.webp',
  'Rexton_batteries-range_1600x1067.jpg': 'abid-rexton-hearing-aid-zinc-air-batteries-range-bangladesh.jpg',
  'Rexton_batteries.webp': 'abid-rexton-hearing-aid-battery-price-uttara-dhaka-bangladesh.webp',
  'Roger-Table-Mic-II.jpg': 'abid-phonak-roger-table-mic-ii-wireless-system-bangladesh.jpg',
  'woocommerce-placeholder.webp': 'abid-hearing-care-product-placeholder-dhaka.webp'
};

const imagesDir = path.join('public', 'images');

console.log('Copying images to "abid-" prefixed filenames in public/images...');
let copiedCount = 0;
for (const [oldName, newName] of Object.entries(seoGeoImageMap)) {
  const oldPath = path.join(imagesDir, oldName);
  const newPath = path.join(imagesDir, newName);
  if (fs.existsSync(oldPath)) {
    fs.copyFileSync(oldPath, newPath);
    copiedCount++;
  } else {
    // Also check if previously copied without abid prefix exists
    const strippedName = newName.replace(/^abid-/, '');
    const strippedPath = path.join(imagesDir, strippedName);
    if (fs.existsSync(strippedPath)) {
      fs.copyFileSync(strippedPath, newPath);
      copiedCount++;
    } else {
      console.warn(`File not found: ${oldPath} or ${strippedPath}`);
    }
  }
}
console.log(`Copied ${copiedCount} images with "abid-" prefix successfully.`);
