import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { products as defaultProducts } from './products.js';
import { blogPosts as defaultBlogPosts } from './siteData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Robust base directory resolution for both local and Vercel serverless
const isVercel = Boolean(process.env.VERCEL);
const tmpDir = os.tmpdir();
const basePath = fs.existsSync(path.join(process.cwd(), 'data')) ? process.cwd() : path.join(__dirname, '..');

// Seed files bundled with repository
const SEED_PRODUCTS = path.join(basePath, 'data', 'products.json');
const SEED_BLOGS = path.join(basePath, 'data', 'blogs.json');
const SEED_APPOINTMENTS = path.join(basePath, 'data', 'appointments.json');

// Storage files (on Vercel serverless, /tmp is the guaranteed writable filesystem)
const PRODUCTS_FILE = isVercel ? path.join(tmpDir, 'ahcc_products.json') : SEED_PRODUCTS;
const BLOGS_FILE = isVercel ? path.join(tmpDir, 'ahcc_blogs.json') : SEED_BLOGS;
const APPOINTMENTS_FILE = isVercel ? path.join(tmpDir, 'ahcc_appointments.json') : SEED_APPOINTMENTS;

// In-memory cache
let productsCache = null;
let blogsCache = null;
let appointmentsCache = null;

function readJsonFile(primaryPath, fallbackPath, fallbackData) {
  try {
    if (fs.existsSync(primaryPath)) {
      const data = fs.readFileSync(primaryPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn(`[ContentStore] Reading primary ${primaryPath}:`, err.message);
  }

  if (fallbackPath && fallbackPath !== primaryPath) {
    try {
      if (fs.existsSync(fallbackPath)) {
        const data = fs.readFileSync(fallbackPath, 'utf8');
        return JSON.parse(data);
      }
    } catch (err) {
      console.warn(`[ContentStore] Reading fallback ${fallbackPath}:`, err.message);
    }
  }

  return fallbackData;
}

function writeJsonFile(primaryPath, fallbackPath, data) {
  let written = false;
  try {
    fs.writeFileSync(primaryPath, JSON.stringify(data, null, 2), 'utf8');
    written = true;
  } catch (err) {
    console.warn(`[ContentStore] Primary write failed ${primaryPath}:`, err.message);
  }

  if (fallbackPath && fallbackPath !== primaryPath) {
    try {
      fs.writeFileSync(fallbackPath, JSON.stringify(data, null, 2), 'utf8');
      written = true;
    } catch (err) {
      // Ignored for read-only serverless file systems
    }
  }

  return written;
}

// Slugify helper
export function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Strip HTML tags helper for excerpts and plain descriptions
export function stripHtml(html) {
  return (html || '')
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const contentStore = {
  // PRODUCTS
  getProducts(filter = {}) {
    if (!productsCache) {
      productsCache = readJsonFile(PRODUCTS_FILE, SEED_PRODUCTS, defaultProducts);
    }
    let list = [...productsCache];

    if (filter.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.slug && p.slug.toLowerCase().includes(q))
      );
    }

    if (filter.brand && filter.brand.toLowerCase() !== 'all') {
      list = list.filter(p => p.brand && p.brand.toLowerCase() === filter.brand.toLowerCase());
    }

    if (filter.category && filter.category.toLowerCase() !== 'all') {
      list = list.filter(p => p.category && p.category.toLowerCase() === filter.category.toLowerCase());
    }

    return list;
  },

  getProductById(id) {
    const list = this.getProducts();
    const numericId = Number(id);
    return list.find(p => p.id === numericId || String(p.id) === String(id));
  },

  getProductBySlug(slug) {
    const list = this.getProducts();
    return list.find(p => p.slug === slug);
  },

  saveProduct(data) {
    const list = this.getProducts();

    let id = data.id ? Number(data.id) : null;
    if (!id || isNaN(id)) {
      const maxId = list.reduce((max, p) => (typeof p.id === 'number' && p.id > max ? p.id : max), 0);
      id = maxId + 1;
    }

    let slug = slugify(data.slug || data.name || `product-${id}`);
    
    // Ensure slug uniqueness among OTHER products
    let uniqueSlug = slug;
    let counter = 1;
    while (list.some(p => p.slug === uniqueSlug && p.id !== id)) {
      uniqueSlug = `${slug}-${counter++}`;
    }

    const plainDesc = data.plainDescription || (data.description ? stripHtml(data.description).substring(0, 220) + '...' : '');

    const newProduct = {
      id,
      name: data.name ? data.name.trim() : 'Unnamed Product',
      slug: uniqueSlug,
      brand: data.brand ? data.brand.trim() : 'Phonak',
      category: data.category ? data.category.trim() : 'Hearing Aids',
      image: data.image ? data.image.trim() : '/images/abid-hearing-care-product-placeholder-dhaka.webp',
      altText: data.altText ? data.altText.trim() : `${data.name || 'Digital Hearing Aid'} - Price in Uttara, Dhaka | Abid Hearing Care Centre`,
      priceText: data.priceText ? data.priceText.trim() : 'Call for Best Price: 01771-237740',
      shortDescription: data.shortDescription ? data.shortDescription.trim() : 'Price for Call: 01771-237740 01715-190901',
      description: data.description || `<p>${data.name} genuine hearing solution available at Abid Hearing Care Centre.</p>`,
      plainDescription: plainDesc,
      inStock: data.inStock === true || data.inStock === 'true' || data.inStock === 'on' || data.inStock === 1,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const existingIndex = list.findIndex(p => p.id === id);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...newProduct };
    } else {
      list.unshift(newProduct);
    }

    productsCache = list;
    writeJsonFile(PRODUCTS_FILE, SEED_PRODUCTS, list);
    return newProduct;
  },

  deleteProduct(id) {
    const list = this.getProducts();
    const numericId = Number(id);
    const filtered = list.filter(p => p.id !== numericId && String(p.id) !== String(id));
    if (filtered.length !== list.length) {
      productsCache = filtered;
      writeJsonFile(PRODUCTS_FILE, SEED_PRODUCTS, filtered);
      return true;
    }
    return false;
  },

  // BLOG POSTS
  getBlogPosts(filter = {}) {
    if (!blogsCache) {
      blogsCache = readJsonFile(BLOGS_FILE, SEED_BLOGS, defaultBlogPosts);
    }
    let list = [...blogsCache];

    if (filter.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(b => 
        (b.title && b.title.toLowerCase().includes(q)) ||
        (b.category && b.category.toLowerCase().includes(q)) ||
        (b.excerpt && b.excerpt.toLowerCase().includes(q)) ||
        (b.content && b.content.toLowerCase().includes(q))
      );
    }

    if (filter.category && filter.category.toLowerCase() !== 'all') {
      list = list.filter(b => b.category && b.category.toLowerCase() === filter.category.toLowerCase());
    }

    return list;
  },

  getBlogPostBySlug(slug) {
    const list = this.getBlogPosts();
    return list.find(b => b.slug === slug);
  },

  saveBlogPost(data, originalSlug = null) {
    const list = this.getBlogPosts();
    let slug = slugify(data.slug || data.title || 'blog-post');

    // Ensure slug uniqueness
    let uniqueSlug = slug;
    let counter = 1;
    while (list.some(b => b.slug === uniqueSlug && b.slug !== (originalSlug || data.slug))) {
      uniqueSlug = `${slug}-${counter++}`;
    }

    // Auto-compute read time if missing
    let readTime = data.readTime;
    if (!readTime) {
      const words = stripHtml(data.content || '').split(/\s+/).filter(Boolean).length;
      const minutes = Math.max(1, Math.ceil(words / 200));
      readTime = `${minutes} min read`;
    }

    const excerpt = data.excerpt || (data.content ? stripHtml(data.content).substring(0, 180) + '...' : '');

    const post = {
      slug: uniqueSlug,
      title: data.title ? data.title.trim() : 'Untitled Post',
      date: data.date ? data.date.trim() : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      readTime,
      category: data.category ? data.category.trim() : 'Hearing Health',
      author: data.author ? data.author.trim() : 'Mohammad Haidar Ali',
      image: data.image ? data.image.trim() : '/images/abid-hearing-care-centre-clinic-dhaka-bangladesh.webp',
      excerpt,
      content: data.content || '<p>Content coming soon.</p>',
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const targetSlug = originalSlug || uniqueSlug;
    const existingIndex = list.findIndex(b => b.slug === targetSlug);

    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...post };
    } else {
      list.unshift(post);
    }

    blogsCache = list;
    writeJsonFile(BLOGS_FILE, SEED_BLOGS, list);
    return post;
  },

  deleteBlogPost(slug) {
    const list = this.getBlogPosts();
    const filtered = list.filter(b => b.slug !== slug);
    if (filtered.length !== list.length) {
      blogsCache = filtered;
      writeJsonFile(BLOGS_FILE, SEED_BLOGS, filtered);
      return true;
    }
    return false;
  },

  // APPOINTMENTS
  getAppointments() {
    if (!appointmentsCache) {
      appointmentsCache = readJsonFile(APPOINTMENTS_FILE, SEED_APPOINTMENTS, []);
    }
    return appointmentsCache || [];
  },

  saveAppointment(data) {
    const list = [...this.getAppointments()];
    const appointment = {
      id: data.id || ('apt_' + Date.now()),
      name: (data.name || '').trim() || 'Anonymous Client',
      phone: (data.phone || '').trim(),
      preferredDate: data.preferredDate || new Date().toISOString().split('T')[0],
      service: data.service || 'General Audiology Consultation',
      notes: data.notes || '',
      submittedAt: data.submittedAt || new Date().toISOString()
    };
    list.unshift(appointment);
    appointmentsCache = list;
    writeJsonFile(APPOINTMENTS_FILE, SEED_APPOINTMENTS, list);
    return appointment;
  },

  deleteAppointment(id) {
    const list = this.getAppointments();
    const filtered = list.filter(a => a.id !== id);
    if (filtered.length !== list.length) {
      appointmentsCache = filtered;
      writeJsonFile(APPOINTMENTS_FILE, SEED_APPOINTMENTS, filtered);
      return true;
    }
    return false;
  },

  // METRICS & STATS FOR DASHBOARD
  getStats() {
    const products = this.getProducts();
    const blogs = this.getBlogPosts();
    const appointments = this.getAppointments();

    const brandsSet = new Set(products.map(p => p.brand).filter(Boolean));
    const inStockCount = products.filter(p => p.inStock).length;

    return {
      totalProducts: products.length,
      totalBlogs: blogs.length,
      totalAppointments: appointments.length,
      totalBrands: brandsSet.size,
      inStockCount,
      outOfStockCount: products.length - inStockCount
    };
  }
};
