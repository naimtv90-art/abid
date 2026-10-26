import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { products } from './data/products.js';
import { 
  clinicInfo, 
  navItems, 
  services as rawServices, 
  leadership, 
  affiliations, 
  brands, 
  stylesList, 
  blogPosts, 
  hearingQuizQuestions 
} from './data/siteData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable gzip compression for lightning-fast network response
app.use(compression({
  threshold: 1024,
  level: 6
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets with aggressive HTTP caching
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '7d',
  etag: true,
  lastModified: true
}));

// Route fallback for original WordPress upload paths
app.use('/wp-content/uploads', (req, res, next) => {
  const filename = path.basename(req.path);
  const localFile = path.join(__dirname, 'public', 'images', filename);
  if (fs.existsSync(localFile)) {
    return res.sendFile(localFile);
  }
  const stripped = filename.replace(/-\d+x\d+(\.\w+)$/, '$1');
  const localStripped = path.join(__dirname, 'public', 'images', stripped);
  if (fs.existsSync(localStripped)) {
    return res.sendFile(localStripped);
  }
  next();
});

// Set up EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Pre-normalize services with unified description accessors
const services = rawServices.map(srv => ({
  ...srv,
  desc: srv.description || srv.desc || srv.shortDesc
}));

// Global template variables for high rendering efficiency
app.locals.clinicInfo = clinicInfo;
app.locals.navItems = navItems;
app.locals.totalProducts = products.length;
app.locals.featuredProducts = products.slice(0, 6);
app.locals.brands = brands;
app.locals.stylesList = stylesList;
app.locals.services = services;
app.locals.leadership = leadership;
app.locals.affiliations = affiliations;
app.locals.blogPosts = blogPosts;
app.locals.hearingQuizQuestions = hearingQuizQuestions;

// Ensure appointments storage directory exists
const appointmentsFile = path.join(__dirname, 'data', 'appointments.json');
if (!fs.existsSync(appointmentsFile)) {
  fs.writeFileSync(appointmentsFile, JSON.stringify([], null, 2));
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
  let filtered = products;

  if (brandQuery && brandQuery.toLowerCase() !== 'all') {
    filtered = products.filter(p => p.brand.toLowerCase() === brandQuery.toLowerCase());
  }

  res.render('pages/products', {
    title: 'Digital Hearing Aids & Accessories Catalog (' + products.length + ' Models)',
    currentPath: '/products',
    metaDesc: 'Browse ' + products.length + '+ digital hearing aids from Phonak, Rexton, Unitron in Bangladesh with warranty and computer-assisted fitting.',
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
  const product = products.find(p => p.slug === slug);

  if (!product) {
    return res.status(404).render('pages/404', {
      title: 'Hearing Aid Not Found | Abid Hearing Care',
      currentPath: '/products'
    });
  }

  // Find related products in same brand or category
  const relatedProducts = products
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

// 15. Audiology Blog
app.get('/blog', (req, res) => {
  res.render('pages/blog', {
    title: 'Audiology Blog & Hearing Health Articles | Abid Hearing Care',
    currentPath: '/blog',
    metaDesc: 'Helpful audiology guides, hearing care advice, pediatric speech development, and device maintenance tips from clinical audiologists at Abid Hearing Care Centre.'
  });
});

app.get('/blog/:slug', (req, res) => {
  const post = blogPosts.find(p => p.slug === req.params.slug);
  if (!post) {
    return res.redirect('/blog');
  }
  res.render('pages/blog', {
    title: `${post.title} | Abid Hearing Care Centre`,
    currentPath: '/blog',
    metaDesc: post.excerpt,
    featuredPost: post
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

  products.forEach(prod => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/product/${prod.slug}</loc>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.7</priority>\n';
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
    const { name, phone, preferredDate, service, notes } = req.body;
    
    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }

    const appointment = {
      id: 'apt_' + Date.now(),
      name: name || 'Anonymous Client',
      phone: phone.trim(),
      preferredDate: preferredDate || new Date().toISOString().split('T')[0],
      service: service || 'General Audiology Consultation',
      notes: notes || '',
      submittedAt: new Date().toISOString()
    };

    // Save to appointments.json
    let existing = [];
    try {
      if (fs.existsSync(appointmentsFile)) {
        existing = JSON.parse(fs.readFileSync(appointmentsFile, 'utf8'));
      }
    } catch (e) {
      existing = [];
    }

    existing.unshift(appointment);
    fs.writeFileSync(appointmentsFile, JSON.stringify(existing, null, 2));

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
  res.json({
    total: products.length,
    products
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()) + 's',
    productsCount: products.length
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
  res.status(500).send(`
    <div style="font-family: sans-serif; text-align: center; padding: 60px;">
      <h2>Something went wrong</h2>
      <p>We are looking into it. Please call Abid Hearing Care Centre directly at <strong>0177 123 77 40</strong>.</p>
      <a href="/" style="color: #0d529c; text-decoration: underline;">Return to Homepage</a>
    </div>
  `);
});

// -------------------------------------------------------------
// Start Server
// -------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Abid Hearing Care Centre - Super-Fast Node.js Server`);
  console.log(`📍 Clinic: Sector-7, Uttara, Dhaka-1230, Bangladesh`);
  console.log(`🌐 Server running at: http://localhost:${PORT}`);
  console.log(`📦 Loaded ${products.length} products with EJS SSR & Gzip compression`);
  console.log(`=======================================================`);
});
