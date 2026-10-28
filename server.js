import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cookieParser from 'cookie-parser';

import { contentStore } from './data/contentStore.js';
import adminRouter from './routes/admin.js';
import { 
  clinicInfo, 
  navItems, 
  services as rawServices, 
  leadership, 
  affiliations, 
  brands, 
  stylesList, 
  hearingQuizQuestions,
  galleryItems
} from './data/siteData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Robust base directory resolution for both local run and Vercel serverless
const basePath = fs.existsSync(path.join(process.cwd(), 'views')) ? process.cwd() : __dirname;

const app = express();
const PORT = process.env.PORT || 3000;

// Enable gzip compression for lightning-fast network response
app.use(compression({
  threshold: 1024,
  level: 6
}));

// Body & Cookie parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static assets with aggressive HTTP caching
app.use(express.static(path.join(basePath, 'public'), {
  maxAge: '7d',
  etag: true,
  lastModified: true
}));

// Route fallback for original WordPress upload paths
app.use('/wp-content/uploads', (req, res, next) => {
  const filename = path.basename(req.path);
  const localFile = path.join(basePath, 'public', 'images', filename);
  if (fs.existsSync(localFile)) {
    return res.sendFile(localFile);
  }
  const stripped = filename.replace(/-\d+x\d+(\.\w+)$/, '$1');
  const localStripped = path.join(basePath, 'public', 'images', stripped);
  if (fs.existsSync(localStripped)) {
    return res.sendFile(localStripped);
  }
  next();
});

// Set up EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(basePath, 'views'));

// Pre-normalize services with unified description accessors
const services = rawServices.map(srv => ({
  ...srv,
  desc: srv.description || srv.desc || srv.shortDesc
}));

// Global template variables for high rendering efficiency
app.locals.clinicInfo = clinicInfo;
app.locals.navItems = navItems;
app.locals.brands = brands;
app.locals.stylesList = stylesList;
app.locals.services = services;
app.locals.leadership = leadership;
app.locals.affiliations = affiliations;
app.locals.hearingQuizQuestions = hearingQuizQuestions;
app.locals.galleryItems = galleryItems;

// Dynamic request middleware ensuring newly created products & blogs immediately update SSR
app.use((req, res, next) => {
  const allProds = contentStore.getProducts();
  const allBlogs = contentStore.getBlogPosts();
  res.locals.totalProducts = allProds.length;
  res.locals.featuredProducts = allProds.slice(0, 6);
  res.locals.blogPosts = allBlogs;
  next();
});

// Mount Admin CMS Router
app.use('/admin', adminRouter);

// Ensure appointments storage directory exists (safe for serverless read-only filesystems)
const appointmentsFile = path.join(basePath, 'data', 'appointments.json');
try {
  if (!fs.existsSync(appointmentsFile)) {
    fs.writeFileSync(appointmentsFile, JSON.stringify([], null, 2));
  }
} catch (e) {
  // Ignored in read-only serverless environments
}

// -------------------------------------------------------------
// Core Page Routes
// -------------------------------------------------------------

// 1. Homepage
app.get('/', (req, res) => {
  res.render('pages/home', {
    title: 'Abid Hearing Care Centre | Leading Audiology & Hearing Aid Clinic Dhaka',
    currentPath: '/',
    metaDesc: 'Abid Hearing Care Centre in Uttara, Dhaka provides world-class diagnostic audiology, genuine digital hearing aids from Phonak, Rexton, Unitron, and life-long auditory care.'
  });
});

// 2. About Us
app.get('/about-us', (req, res) => {
  res.render('pages/about-us', {
    title: 'About Us | Abid Hearing Care Centre Dhaka',
    currentPath: '/about-us',
    metaDesc: 'Learn about Abid Hearing Care Centre (AHCC) founded in 2014 by Clinical Audiologist Mohammad Haidar Ali in Sector-7, Uttara, Dhaka.'
  });
});

// 3. Hearing Aids Main Guide
app.get('/hearing-aid', (req, res) => {
  res.render('pages/hearing-aid', {
    title: 'Modern Hearing Aid Guide & Patient Advice | Abid Hearing Care',
    currentPath: '/hearing-aid',
    metaDesc: 'Complete guide to modern digital hearing aids in Bangladesh. Learn how digital hearing aids restore speech clarity, connectivity, and cognitive health.'
  });
});

// 4. How Hearing Aids Work
app.get('/how-do-hearing-aid-work', (req, res) => {
  res.render('pages/how-do-hearing-aid-work', {
    title: 'How Do Modern Digital Hearing Aids Work? | Acoustic Science',
    currentPath: '/how-do-hearing-aid-work',
    metaDesc: 'Understand the acoustic science behind modern digital hearing aids. Learn how microphones, DSP microchips, and receivers deliver clear sound.'
  });
});

// 5. Hearing Aids for Children
app.get('/hearing-aid-for-children', (req, res) => {
  res.render('pages/hearing-aid-for-children', {
    title: 'Pediatric Hearing Aids for Children & Newborns | Dhaka',
    currentPath: '/hearing-aid-for-children',
    metaDesc: 'Specialized pediatric audiology and hearing aids for infants, toddlers, and school-age children in Dhaka. Phonak Sky Marvel, child locks, and Roger FM.'
  });
});

// 6. Hearing Aid Styles (BTE, RIC, CIC, ITE)
app.get('/hearing-aids-style', (req, res) => {
  res.render('pages/hearing-aids-style', {
    title: 'Hearing Aid Styles & Form Factors (BTE, RIC, ITE, CIC) | Dhaka',
    currentPath: '/hearing-aids-style',
    metaDesc: 'Compare hearing aid styles: Behind-the-Ear (BTE), Receiver-in-Canal (RIC), In-the-Ear (ITE), and Completely-in-Canal (CIC). Find the perfect fit.'
  });
});

// 7. Brands in Bangladesh
app.get('/hearing-aid-brand-in-bangladesh', (req, res) => {
  res.render('pages/hearing-aid-brand-in-bangladesh', {
    title: 'Top Hearing Aid Brands in Bangladesh (Phonak, Rexton, Unitron)',
    currentPath: '/hearing-aid-brand-in-bangladesh',
    metaDesc: 'Compare top hearing aid brands in Bangladesh: Phonak (Switzerland), Rexton (Germany), Unitron (Canada). Authorized dealer with warranty.'
  });
});

// 8. Products Catalog
app.get('/products', (req, res) => {
  const brandQuery = req.query.brand;
  const allProducts = contentStore.getProducts();
  let filtered = allProducts;

  if (brandQuery && brandQuery.toLowerCase() !== 'all') {
    filtered = allProducts.filter(p => p.brand.toLowerCase() === brandQuery.toLowerCase());
  }

  res.render('pages/products', {
    title: 'Digital Hearing Aids & Accessories Catalog (' + allProducts.length + ' Models)',
    currentPath: '/products',
    metaDesc: 'Browse ' + allProducts.length + '+ digital hearing aids from Phonak, Rexton, Unitron in Bangladesh with warranty and computer-assisted fitting.',
    products: filtered,
    selectedBrand: brandQuery || 'all'
  });
});

// Alias for WordPress /shop URL
app.get('/shop', (req, res) => {
  res.redirect(301, '/products');
});

// 9. Individual Product Detail Page
app.get('/product/:slug', (req, res) => {
  const slug = req.params.slug;
  const product = contentStore.getProductBySlug(slug);

  if (!product) {
    return res.status(404).render('pages/404', {
      title: 'Hearing Aid Not Found | Abid Hearing Care',
      currentPath: '/products'
    });
  }

  // Find related products in same brand or category
  const allProducts = contentStore.getProducts();
  const relatedProducts = allProducts
    .filter(p => p.slug !== slug && (p.brand === product.brand || p.category === product.category))
    .slice(0, 3);

  res.render('pages/product-detail', {
    product,
    relatedProducts,
    currentPath: '/product/' + product.slug
  });
});

// 10. Audiology & Fitting Services
app.get('/services', (req, res) => {
  res.render('pages/services', {
    title: 'Audiology & Hearing Aid Fitting Services Dhaka',
    currentPath: '/services',
    metaDesc: 'Pure tone audiometry, digital hearing aid trial, custom ear mould lab, and hearing aid servicing at Abid Hearing Care Centre in Uttara, Dhaka.'
  });
});

// Photo Gallery Route
app.get('/photo-gallery', (req, res) => {
  const category = req.query.category || 'All';
  const categories = ['All', 'Services', 'Clinics', 'Patient Care', 'Hearing Aids'];
  
  const filteredItems = category === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category.toLowerCase() === category.toLowerCase());

  res.render('pages/photo-gallery', {
    title: 'Photo Gallery | Abid Hearing Care Centre Uttara Dhaka',
    currentPath: '/photo-gallery',
    metaDesc: 'Explore our modern audiology clinic in Uttara, Sector-7 Dhaka, diagnostic hearing evaluation facilities, digital hearing aid fittings, and clinical ear care.',
    categories,
    selectedCategory: category,
    galleryItems: filteredItems
  });
});

// 11. Interactive Hearing Quiz
app.get('/hearing-test', (req, res) => {
  res.render('pages/hearing-test', {
    title: 'Free Online Hearing Test & Screening Quiz | Abid Hearing Care',
    currentPath: '/hearing-test',
    metaDesc: 'Take our free 2-minute online hearing self-assessment quiz. Identify subtle hearing challenges, speech clarity difficulties, and tinnitus indicators.'
  });
});

// 12. Management & Leadership Team
app.get('/management', (req, res) => {
  res.render('pages/management', {
    title: 'Management & Clinical Team | Abid Hearing Care Centre Dhaka',
    currentPath: '/management',
    metaDesc: 'Meet the clinical leadership and team at Abid Hearing Care Centre Uttara Dhaka led by Mohammad Haidar Ali (Clinical Audiologist).'
  });
});

// 13. NGO & Community Affiliations
app.get('/affiliation', (req, res) => {
  res.render('pages/affiliation', {
    title: 'Social Affiliations & Community Partners | Abid Hearing Care Dhaka',
    currentPath: '/affiliation',
    metaDesc: 'Abid Hearing Care Centre community partnerships and affiliations with registered NGOs across Bangladesh including SEDAD, DWDO, PKS, and UPS.'
  });
});

// 14. Contact Us
app.get('/contact-us', (req, res) => {
  res.render('pages/contact-us', {
    title: 'Contact Us | Abid Hearing Care Centre Uttara Dhaka',
    currentPath: '/contact-us',
    metaDesc: 'Contact Abid Hearing Care Centre in Sector-7, Uttara, Dhaka. Phone: 0177 123 77 40, 0171 51 90901. Clinic hours, WhatsApp booking, and Google Maps directions.'
  });
});

app.get('/contact', (req, res) => {
  res.redirect(301, '/contact-us');
});

// 15. Audiology Blog (Micro Style)
app.get('/blog', (req, res) => {
  const { category, search } = req.query;
  const allBlogs = contentStore.getBlogPosts();

  let filtered = allBlogs;
  if (category && category !== 'All') {
    filtered = filtered.filter(b => b.category && b.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(b =>
      (b.title && b.title.toLowerCase().includes(q)) ||
      (b.category && b.category.toLowerCase().includes(q)) ||
      (b.excerpt && b.excerpt.toLowerCase().includes(q)) ||
      (b.content && b.content.toLowerCase().includes(q))
    );
  }

  const categories = ['All', ...new Set(allBlogs.map(b => b.category).filter(Boolean))];

  res.render('pages/blog', {
    title: 'Audiology Blog & Ear Care Insights | Abid Hearing Care Centre',
    currentPath: '/blog',
    metaDesc: 'Practical audiology reading, digital hearing aid maintenance guides, and everyday ear care advice from clinical audiologists at Abid Hearing Care Centre Dhaka.',
    blogs: filtered,
    categories,
    selectedCategory: category || 'All',
    searchQuery: search || ''
  });
});

app.get('/blog/:slug', (req, res) => {
  const post = contentStore.getBlogPostBySlug(req.params.slug);
  if (!post) {
    return res.status(404).render('pages/404', {
      title: 'Article Not Found | Abid Hearing Care Centre',
      currentPath: '/blog'
    });
  }

  const allBlogs = contentStore.getBlogPosts();
  const relatedBlogs = allBlogs
    .filter(b => b.slug !== post.slug)
    .sort((a, b) => (b.category === post.category ? 1 : 0) - (a.category === post.category ? 1 : 0))
    .slice(0, 3);

  res.render('pages/blog-detail', {
    title: `${post.title} | Abid Hearing Care Centre`,
    currentPath: '/blog/' + post.slug,
    metaDesc: post.excerpt,
    blog: post,
    relatedBlogs
  });
});

// -------------------------------------------------------------
// SEO & Utilities: Sitemap.xml & Robots.txt
// -------------------------------------------------------------

app.get('/sitemap.xml', (req, res) => {
  const baseUrl = 'https://abidhearing.com';
  const staticPages = [
    '',
    '/about-us',
    '/hearing-aid',
    '/how-do-hearing-aid-work',
    '/hearing-aid-for-children',
    '/hearing-aids-style',
    '/hearing-aid-brand-in-bangladesh',
    '/products',
    '/services',
    '/hearing-test',
    '/management',
    '/affiliation',
    '/contact-us',
    '/blog'
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  staticPages.forEach(p => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${p}</loc>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += `    <priority>${p === '' ? '1.0' : '0.8'}</priority>\n`;
    xml += '  </url>\n';
  });

  const prods = contentStore.getProducts();
  prods.forEach(prod => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/product/${prod.slug}</loc>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += `    <priority>0.7</priority>\n`;
    xml += '  </url>\n';
  });

  const posts = contentStore.getBlogPosts();
  posts.forEach(post => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += `    <priority>0.7</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  res.header('Content-Type', 'application/xml');
  res.header('Cache-Control', 'public, max-age=86400');
  res.send(xml);
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Sitemap: https://abidhearing.com/sitemap.xml
`);
});

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Appointment / Consultation Submission Handler
app.post('/api/appointment', (req, res) => {
  try {
    const { name, phone, preferredDate, service, notes, message, ageGroup, branch } = req.body;
    
    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }

    const noteParts = [];
    if (notes) noteParts.push(notes);
    if (message) noteParts.push(message);
    if (ageGroup) noteParts.push(`Age Group: ${ageGroup}`);
    if (branch) noteParts.push(`Branch: ${branch}`);

    const appointment = contentStore.saveAppointment({
      name: name ? name.trim() : 'Anonymous Client',
      phone: phone.trim(),
      preferredDate: preferredDate || new Date().toISOString().split('T')[0],
      service: service || 'General Audiology Consultation',
      notes: noteParts.join(' | ') || ''
    });

    console.log(`[Appointment] Received booking from ${appointment.name} (${appointment.phone}) for ${appointment.service}`);

    return res.json({ 
      success: true, 
      message: 'Consultation request successfully recorded. Our clinic will contact you shortly.',
      id: appointment.id 
    });
  } catch (err) {
    console.error('[Appointment Error]', err);
    return res.status(500).json({ success: false, error: 'Server error processing appointment' });
  }
});

// Products API endpoint
app.get('/api/products', (req, res) => {
  const prods = contentStore.getProducts();
  res.json({
    total: prods.length,
    products: prods
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const prods = contentStore.getProducts();
  const blogs = contentStore.getBlogPosts();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()) + 's',
    productsCount: prods.length,
    blogsCount: blogs.length
  });
});

// -------------------------------------------------------------
// 404 Fallback & Global Error Handler
// -------------------------------------------------------------

app.use((req, res) => {
  res.status(404).render('pages/404', {
    title: 'Page Not Found | Abid Hearing Care Centre',
    currentPath: req.path
  });
});

app.use((err, req, res, next) => {
  console.error('[Internal Error]', err);
  if (res.headersSent) {
    return next(err);
  }
  if (req.originalUrl && req.originalUrl.startsWith('/admin')) {
    return res.status(500).send(`
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 580px; margin: 50px auto; padding: 30px; border: 1.5px solid #e2e8f0; border-radius: 12px; background: #ffffff; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
        <h2 style="color: #ef4444; margin-top: 0; font-size: 1.4rem;">⚠️ CMS Action Error</h2>
        <p style="color: #475569; font-size: 0.95rem; line-height: 1.6;">${err.message || 'An unexpected error occurred.'}</p>
        <div style="margin-top: 24px;">
          <a href="/admin" style="background: #0077ff; color: #ffffff; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 0.9rem;">&larr; Return to Admin Dashboard</a>
        </div>
      </div>
    `);
  }
  res.status(500).send(`
    <div style="font-family: sans-serif; text-align: center; padding: 60px;">
      <h2>Something went wrong</h2>
      <p>We are looking into it. Please call Abid Hearing Care Centre directly at <strong>0177 123 77 40</strong>.</p>
      <a href="/" style="color: #0d529c; text-decoration: underline;">Return to Homepage</a>
    </div>
  `);
});

// -------------------------------------------------------------
// Start Server with Graceful Port Fallback
// -------------------------------------------------------------

function startServer(portToTry) {
  const server = app.listen(portToTry, () => {
    const prods = contentStore.getProducts();
    const blogs = contentStore.getBlogPosts();
    console.log(`=======================================================`);
    console.log(`🚀 Abid Hearing Care Centre - Super-Fast Node.js Server`);
    console.log(`📍 Clinic: Sector-7, Uttara, Dhaka-1230, Bangladesh`);
    console.log(`🌐 Server running at: http://localhost:${portToTry}`);
    console.log(`🔐 Admin CMS Portal: http://localhost:${portToTry}/admin`);
    console.log(`📦 Loaded ${prods.length} products & ${blogs.length} blog posts with Live CMS`);
    console.log(`=======================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = Number(portToTry) + 1;
      console.log(`⚠️ Port ${portToTry} is in use (e.g. by Micro). Falling back to http://localhost:${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error('[Server Error]', err);
    }
  });
}

// Export default app for Vercel Serverless Function
export default app;

// Only start the HTTP listener when run directly (not in Vercel serverless)
if (!process.env.VERCEL) {
  startServer(PORT);
}
