async function main() {
  try {
    const res = await fetch('https://abidhearing.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await res.text();
    console.log('Homepage length:', html.length);
    const fs = await import('fs');
    fs.writeFileSync('homepage.html', html);
    
    // Check sitemap
    try {
      const smRes = await fetch('https://abidhearing.com/wp-sitemap.xml');
      console.log('wp-sitemap status:', smRes.status);
      if (smRes.ok) {
        const smText = await smRes.text();
        fs.writeFileSync('sitemap.xml', smText);
      }
    } catch (e) {
      console.log('wp-sitemap error:', e.message);
    }

    try {
      const smRes2 = await fetch('https://abidhearing.com/sitemap_index.xml');
      console.log('sitemap_index status:', smRes2.status);
      if (smRes2.ok) {
        const smText2 = await smRes2.text();
        fs.writeFileSync('sitemap_index.xml', smText2);
      }
    } catch (e) {
      console.log('sitemap_index error:', e.message);
    }

    // Check WordPress REST API
    try {
      const wpPages = await fetch('https://abidhearing.com/wp-json/wp/v2/pages?per_page=50');
      console.log('wp/v2/pages status:', wpPages.status);
      if (wpPages.ok) {
        const pagesJson = await wpPages.json();
        fs.writeFileSync('wp_pages.json', JSON.stringify(pagesJson, null, 2));
        console.log('Found pages count:', pagesJson.length);
        pagesJson.forEach(p => console.log('Page:', p.id, p.slug, p.title?.rendered));
      }
    } catch(e) {
      console.log('wp api error:', e.message);
    }

    // Check WordPress REST API for posts
    try {
      const wpPosts = await fetch('https://abidhearing.com/wp-json/wp/v2/posts?per_page=50');
      console.log('wp/v2/posts status:', wpPosts.status);
      if (wpPosts.ok) {
        const postsJson = await wpPosts.json();
        fs.writeFileSync('wp_posts.json', JSON.stringify(postsJson, null, 2));
        console.log('Found posts count:', postsJson.length);
        postsJson.forEach(p => console.log('Post:', p.id, p.slug, p.title?.rendered));
      }
    } catch(e) {
      console.log('wp posts error:', e.message);
    }

  } catch (err) {
    console.error('Error:', err);
  }
}

main();
