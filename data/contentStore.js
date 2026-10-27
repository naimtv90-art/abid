import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { products as defaultProducts } from './products.js';
import { blogPosts as defaultBlogPosts } from './siteData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTS_FILE = path.join(__dirname, 'products.json');
const BLOGS_FILE = path.join(__dirname, 'blogs.json');
const APPOINTMENTS_FILE = path.join(__dirname, 'appointments.json');

// Initialize products.json if it doesn't exist
if (!fs.existsSync(PRODUCTS_FILE)) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(defaultProducts, null, 2), 'utf8');
}

// Initialize blogs.json if it doesn't exist
if (!fs.existsSync(BLOGS_FILE)) {
  fs.writeFileSync(BLOGS_FILE, JSON.stringify(defaultBlogPosts, null, 2), 'utf8');
}

// Ensure appointments.json exists
if (!fs.existsSync(APPOINTMENTS_FILE)) {
  fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify([], null, 2), 'utf8');
}

// In-memory cache
let productsCache = null;
let blogsCache = null;

function readJsonFile(filePath, fallback) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`[ContentStore] Error reading ${filePath}:`, err);
  }
  return fallback;
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`[ContentStore] Error writing ${filePath}:`, err);
    return false;
  }
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
      productsCache = readJsonFile(PRODUCTS_FILE, defaultProducts);
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
    writeJsonFile(PRODUCTS_FILE, list);
    return newProduct;
  },

  deleteProduct(id) {
    const list = this.getProducts();
    const numericId = Number(id);
    const filtered = list.filter(p => p.id !== numericId && String(p.id) !== String(id));
    if (filtered.length !== list.length) {
      productsCache = filtered;
      writeJsonFile(PRODUCTS_FILE, filtered);
      return true;
    }
    return false;
  },

  // BLOG POSTS
  getBlogPosts(filter = {}) {
    if (!blogsCache) {
      blogsCache = readJsonFile(BLOGS_FILE, defaultBlogPosts);
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
    writeJsonFile(BLOGS_FILE, list);
    return post;
  },

  deleteBlogPost(slug) {
    const list = this.getBlogPosts();
    const filtered = list.filter(b => b.slug !== slug);
    if (filtered.length !== list.length) {
      blogsCache = filtered;
      writeJsonFile(BLOGS_FILE, filtered);
      return true;
    }
    return false;
  },

  // APPOINTMENTS
  getAppointments() {
    return readJsonFile(APPOINTMENTS_FILE, []);
  },

  deleteAppointment(id) {
    const list = this.getAppointments();
    const filtered = list.filter(a => a.id !== id);
    if (filtered.length !== list.length) {
      writeJsonFile(APPOINTMENTS_FILE, filtered);
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
