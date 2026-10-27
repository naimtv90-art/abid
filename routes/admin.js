import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { contentStore, slugify } from '../data/contentStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configuration
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'abid2026!';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'ahcc_secret_session_key_uttara_2026';
const COOKIE_NAME = 'ahcc_admin_token';

// Ensure upload directory exists
const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'images', 'cms');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E6);
    cb(null, `cms-${base}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg|gif/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const mime = file.mimetype;
    if (allowed.test(ext) || allowed.test(mime)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpg, png, webp, svg, gif) are allowed'));
    }
  }
});

// Helper: Token Generation & Verification
function createToken(username) {
  const payload = `${username}:${Date.now()}`;
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64');
}

function verifyToken(token) {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return false;
    const [username, timestamp, hmac] = parts;
    const payload = `${username}:${timestamp}`;
    const expected = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
    if (hmac !== expected) return false;
    // Session expires after 7 days
    const age = Date.now() - parseInt(timestamp, 10);
    if (age > 7 * 24 * 60 * 60 * 1000) return false;
    return username;
  } catch (err) {
    return false;
  }
}

// Middleware: Require Admin Authentication
export function requireAdminAuth(req, res, next) {
  const token = req.cookies ? req.cookies[COOKIE_NAME] : null;
  const username = verifyToken(token);
  if (!username) {
    const nextUrl = encodeURIComponent(req.originalUrl || '/admin');
    return res.redirect(`/admin/login?next=${nextUrl}`);
  }
  req.adminUser = username;
  res.locals.adminUser = username;
  next();
}

// -------------------------------------------------------------
// Authentication Routes (Public)
// -------------------------------------------------------------

// GET /admin/login
router.get('/login', (req, res) => {
  const token = req.cookies ? req.cookies[COOKIE_NAME] : null;
  if (verifyToken(token)) {
    return res.redirect('/admin');
  }
  const error = req.query.error || null;
  const msg = req.query.msg || null;
  const next = req.query.next || '/admin';
  res.render('admin/login', { error, msg, next, title: 'CMS Admin Login | Abid Hearing Care' });
});

// POST /admin/login
router.post('/login', (req, res) => {
  const { username, password, next = '/admin' } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = createToken(username);
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax'
    });
    return res.redirect(next.startsWith('/') ? next : '/admin');
  }
  res.redirect(`/admin/login?error=invalid_credentials&next=${encodeURIComponent(next)}`);
});

// GET /admin/logout
router.get('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.redirect('/admin/login?msg=logged_out');
});

// -------------------------------------------------------------
// Admin Protected Routes
// -------------------------------------------------------------
router.use(requireAdminAuth);

// GET /admin -> Redirect to Dashboard
router.get('/', (req, res) => {
  res.redirect('/admin/dashboard');
});

// GET /admin/dashboard
router.get('/dashboard', (req, res) => {
  const stats = contentStore.getStats();
  const recentProducts = contentStore.getProducts().slice(0, 5);
  const recentBlogs = contentStore.getBlogPosts().slice(0, 4);
  const recentAppointments = contentStore.getAppointments().slice(0, 5);

  res.render('admin/dashboard', {
    title: 'Admin Dashboard | Abid Hearing Care CMS',
    currentSection: 'dashboard',
    stats,
    recentProducts,
    recentBlogs,
    recentAppointments,
    msg: req.query.msg || null
  });
});

// -------------------------------------------------------------
// Product Management Routes
// -------------------------------------------------------------

// GET /admin/products - List all products
router.get('/products', (req, res) => {
  const { search, brand, category, page = 1 } = req.query;
  const products = contentStore.getProducts({ search, brand, category });
  const allBrands = [...new Set(contentStore.getProducts().map(p => p.brand).filter(Boolean))].sort();
  const allCategories = [...new Set(contentStore.getProducts().map(p => p.category).filter(Boolean))].sort();

  res.render('admin/products-list', {
    title: 'Product Management | Abid Hearing Care CMS',
    currentSection: 'products',
    products,
    allBrands,
    allCategories,
    querySearch: search || '',
    queryBrand: brand || 'all',
    queryCategory: category || 'all',
    msg: req.query.msg || null
  });
});

// GET /admin/products/new - Create product form
router.get('/products/new', (req, res) => {
  const allBrands = [...new Set(contentStore.getProducts().map(p => p.brand).filter(Boolean))].sort();
  const allCategories = ['Hearing Aids', 'Behind-the-Ear (BTE)', 'Receiver-in-Canal (RIC)', 'Invisible / CIC', 'In-the-Ear (ITE)', 'Pediatric Hearing Aids', 'Batteries', 'Accessories', 'Hearing Protection'];

  res.render('admin/product-form', {
    title: 'Add New Product | Abid Hearing Care CMS',
    currentSection: 'products-new',
    product: {
      name: '',
      slug: '',
      brand: 'Phonak',
      category: 'Hearing Aids',
      image: '',
      altText: '',
      priceText: 'Call for Best Price: 01771-237740',
      shortDescription: '',
      description: '',
      inStock: true
    },
    isEdit: false,
    allBrands,
    allCategories,
    error: req.query.error || null
  });
});

// POST /admin/products/new - Save new product
router.post('/products/new', upload.single('productImageFile'), (req, res) => {
  try {
    const body = req.body;
    let imagePath = body.image || '';

    // If an image was uploaded through the file input, prioritize it
    if (req.file) {
      imagePath = `/images/cms/${req.file.filename}`;
    } else if (!imagePath) {
      imagePath = '/images/abid-hearing-care-product-placeholder-dhaka.webp';
    }

    const saved = contentStore.saveProduct({
      name: body.name,
      slug: body.slug,
      brand: body.brandCustom && body.brand === '__custom__' ? body.brandCustom : body.brand,
      category: body.categoryCustom && body.category === '__custom__' ? body.categoryCustom : body.category,
      image: imagePath,
      altText: body.altText || `${body.name} - Digital Hearing Aid Price in Dhaka, Bangladesh`,
      priceText: body.priceText || 'Call for Best Price: 01771-237740',
      shortDescription: body.shortDescription || '',
      description: body.description || '',
      inStock: body.inStock === 'on' || body.inStock === 'true' || body.inStock === true
    });

    res.redirect(`/admin/products?msg=created&slug=${saved.slug}`);
  } catch (err) {
    console.error('[CMS Product Save Error]', err);
    res.redirect('/admin/products/new?error=save_failed');
  }
});

// GET /admin/products/edit/:id - Edit product form
router.get('/products/edit/:id', (req, res) => {
  const product = contentStore.getProductById(req.params.id);
  if (!product) {
    return res.redirect('/admin/products?error=not_found');
  }

  const allBrands = [...new Set(contentStore.getProducts().map(p => p.brand).filter(Boolean))].sort();
  const allCategories = ['Hearing Aids', 'Behind-the-Ear (BTE)', 'Receiver-in-Canal (RIC)', 'Invisible / CIC', 'In-the-Ear (ITE)', 'Pediatric Hearing Aids', 'Batteries', 'Accessories', 'Hearing Protection'];

  res.render('admin/product-form', {
    title: `Edit ${product.name} | Abid Hearing Care CMS`,
    currentSection: 'products',
    product,
    isEdit: true,
    allBrands,
    allCategories,
    error: req.query.error || null,
    msg: req.query.msg || null
  });
});

// POST /admin/products/edit/:id - Update product
router.post('/products/edit/:id', upload.single('productImageFile'), (req, res) => {
  try {
    const existing = contentStore.getProductById(req.params.id);
    if (!existing) {
      return res.redirect('/admin/products?error=not_found');
    }

    const body = req.body;
    let imagePath = body.image || existing.image;

    if (req.file) {
      imagePath = `/images/cms/${req.file.filename}`;
    }

    const updated = contentStore.saveProduct({
      id: existing.id,
      name: body.name,
      slug: body.slug || existing.slug,
      brand: body.brandCustom && body.brand === '__custom__' ? body.brandCustom : body.brand,
      category: body.categoryCustom && body.category === '__custom__' ? body.categoryCustom : body.category,
      image: imagePath,
      altText: body.altText || `${body.name} - Price in Uttara, Dhaka | Abid Hearing Care Centre`,
      priceText: body.priceText,
      shortDescription: body.shortDescription,
      description: body.description,
      inStock: body.inStock === 'on' || body.inStock === 'true' || body.inStock === true
    });

    res.redirect(`/admin/products?msg=updated&id=${updated.id}`);
  } catch (err) {
    console.error('[CMS Product Update Error]', err);
    res.redirect(`/admin/products/edit/${req.params.id}?error=update_failed`);
  }
});

// POST /admin/products/delete/:id - Delete product
router.post('/products/delete/:id', (req, res) => {
  const success = contentStore.deleteProduct(req.params.id);
  if (success) {
    res.redirect('/admin/products?msg=deleted');
  } else {
    res.redirect('/admin/products?error=delete_failed');
  }
});

// -------------------------------------------------------------
// Blog Post Management Routes
// -------------------------------------------------------------

// GET /admin/blogs - List all blog posts
router.get('/blogs', (req, res) => {
  const { search, category } = req.query;
  const blogs = contentStore.getBlogPosts({ search, category });
  const allCategories = [...new Set(contentStore.getBlogPosts().map(b => b.category).filter(Boolean))].sort();

  res.render('admin/blogs-list', {
    title: 'Blog Post Management | Abid Hearing Care CMS',
    currentSection: 'blogs',
    blogs,
    allCategories,
    querySearch: search || '',
    queryCategory: category || 'all',
    msg: req.query.msg || null
  });
});

// GET /admin/blogs/new - Create new blog post
router.get('/blogs/new', (req, res) => {
  const allCategories = ['Hearing Health', 'Pediatric Audiology', 'Care & Maintenance', 'Technology & Science', 'Hearing Aids Guide', 'Clinic News'];

  res.render('admin/blog-form', {
    title: 'Write New Blog Post | Abid Hearing Care CMS',
    currentSection: 'blogs-new',
    post: {
      title: '',
      slug: '',
      category: 'Hearing Health',
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      readTime: '4 min read',
      image: '',
      excerpt: '',
      content: ''
    },
    isEdit: false,
    allCategories,
    error: req.query.error || null
  });
});

// POST /admin/blogs/new - Save new blog post
router.post('/blogs/new', upload.single('blogImageFile'), (req, res) => {
  try {
    const body = req.body;
    let imagePath = body.image || '';

    if (req.file) {
      imagePath = `/images/cms/${req.file.filename}`;
    } else if (!imagePath) {
      imagePath = '/images/abid-hearing-care-centre-clinic-dhaka-bangladesh.webp';
    }

    const saved = contentStore.saveBlogPost({
      title: body.title,
      slug: body.slug,
      category: body.categoryCustom && body.category === '__custom__' ? body.categoryCustom : body.category,
      date: body.date,
      readTime: body.readTime,
      image: imagePath,
      excerpt: body.excerpt,
      content: body.content
    });

    res.redirect(`/admin/blogs?msg=created&slug=${saved.slug}`);
  } catch (err) {
    console.error('[CMS Blog Save Error]', err);
    res.redirect('/admin/blogs/new?error=save_failed');
  }
});

// GET /admin/blogs/edit/:slug - Edit blog post form
router.get('/blogs/edit/:slug', (req, res) => {
  const post = contentStore.getBlogPostBySlug(req.params.slug);
  if (!post) {
    return res.redirect('/admin/blogs?error=not_found');
  }

  const allCategories = ['Hearing Health', 'Pediatric Audiology', 'Care & Maintenance', 'Technology & Science', 'Hearing Aids Guide', 'Clinic News'];

  res.render('admin/blog-form', {
    title: `Edit Post: ${post.title} | Abid Hearing Care CMS`,
    currentSection: 'blogs',
    post,
    isEdit: true,
    allCategories,
    error: req.query.error || null,
    msg: req.query.msg || null
  });
});

// POST /admin/blogs/edit/:slug - Update blog post
router.post('/blogs/edit/:slug', upload.single('blogImageFile'), (req, res) => {
  try {
    const existing = contentStore.getBlogPostBySlug(req.params.slug);
    if (!existing) {
      return res.redirect('/admin/blogs?error=not_found');
    }

    const body = req.body;
    let imagePath = body.image || existing.image;

    if (req.file) {
      imagePath = `/images/cms/${req.file.filename}`;
    }

    const updated = contentStore.saveBlogPost({
      title: body.title,
      slug: body.slug || existing.slug,
      category: body.categoryCustom && body.category === '__custom__' ? body.categoryCustom : body.category,
      date: body.date || existing.date,
      readTime: body.readTime || existing.readTime,
      image: imagePath,
      excerpt: body.excerpt,
      content: body.content
    }, req.params.slug);

    res.redirect(`/admin/blogs?msg=updated&slug=${updated.slug}`);
  } catch (err) {
    console.error('[CMS Blog Update Error]', err);
    res.redirect(`/admin/blogs/edit/${req.params.slug}?error=update_failed`);
  }
});

// POST /admin/blogs/delete/:slug - Delete blog post
router.post('/blogs/delete/:slug', (req, res) => {
  const success = contentStore.deleteBlogPost(req.params.slug);
  if (success) {
    res.redirect('/admin/blogs?msg=deleted');
  } else {
    res.redirect('/admin/blogs?error=delete_failed');
  }
});

// -------------------------------------------------------------
// Appointments Consultation Leads Management
// -------------------------------------------------------------

// GET /admin/appointments
router.get('/appointments', (req, res) => {
  const appointments = contentStore.getAppointments();
  res.render('admin/appointments-list', {
    title: 'Patient Appointments & Inquiries | Abid Hearing Care CMS',
    currentSection: 'appointments',
    appointments,
    msg: req.query.msg || null
  });
});

// POST /admin/appointments/delete/:id
router.post('/appointments/delete/:id', (req, res) => {
  const success = contentStore.deleteAppointment(req.params.id);
  res.redirect('/admin/appointments?msg=' + (success ? 'deleted' : 'error'));
});

// -------------------------------------------------------------
// Quick AJAX Upload Image Endpoint (for rich text editors)
// -------------------------------------------------------------
router.post('/api/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No image uploaded' });
  }
  const url = `/images/cms/${req.file.filename}`;
  return res.json({ success: true, url });
});

export default router;
