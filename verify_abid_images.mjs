async function verify() {
  const routes = ['/', '/products', '/hearing-aids-style', '/product/naida-v90-up'];
  const allImages = new Set();
  
  for (const r of routes) {
    const res = await fetch('http://localhost:3000' + r);
    const html = await res.text();
    const matches = html.match(/\/images\/[a-zA-Z0-9_\-\.]+/g) || [];
    for (const m of matches) allImages.add(m);
    console.log(r, 'Status:', res.status, 'Total unique imgs found so far:', allImages.size);
  }

  console.log('\nChecking if all images start with /images/abid-:');
  let nonAbidCount = 0;
  for (const img of allImages) {
    if (!img.startsWith('/images/abid-')) {
      console.log('  WARNING non-abid image:', img);
      nonAbidCount++;
    }
  }
  if (nonAbidCount === 0) {
    console.log('SUCCESS: 100% of discovered images start with "/images/abid-"!');
  }

  console.log('\nTesting HTTP 200 on all unique images:');
  for (const img of allImages) {
    const res = await fetch('http://localhost:3000' + img);
    console.log(' ', res.status === 200 ? '✅ 200' : '❌ ' + res.status, img, '(' + res.headers.get('content-type') + ')');
  }
}
verify();
