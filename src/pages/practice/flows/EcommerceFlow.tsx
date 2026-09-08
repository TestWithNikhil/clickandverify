import { useState, useMemo } from 'react';
import {
  ShoppingCart, Search, Star, Heart, ArrowLeft, ArrowRight,
  Filter, SlidersHorizontal, ChevronDown, Plus, Minus, Trash2,
  CheckCircle, Package, Truck, CreditCard, Tag, X,
  ChevronRight, Home, Grid, List, Zap
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Stage = 'browse' | 'product' | 'cart' | 'checkout' | 'confirmation';
interface Product {
  id: number; name: string; brand: string; price: number; originalPrice?: number;
  rating: number; reviews: number; category: string; badge?: string;
  image: string; description: string; specs: Record<string, string>;
  inStock: boolean; colors: string[]; sizes?: string[];
}
interface CartItem { product: Product; qty: number; color: string; size?: string; }

// ─── Mock Data ────────────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  { id: 1, name: 'Pro Wireless Headphones', brand: 'SoundMax', price: 79.99, originalPrice: 129.99, rating: 4.5, reviews: 1284, category: 'Electronics', badge: 'Best Seller', image: '🎧', description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and studio-quality sound.', specs: { Battery: '30 hours', Connectivity: 'Bluetooth 5.2', Weight: '250g', Warranty: '2 years' }, inStock: true, colors: ['Black', 'White', 'Navy'] },
  { id: 2, name: 'Smart Fitness Watch', brand: 'FitPro', price: 149.99, originalPrice: 199.99, rating: 4.3, reviews: 896, category: 'Electronics', badge: 'Sale', image: '⌚', description: 'Advanced fitness tracker with heart rate monitor, GPS, sleep tracking, and 7-day battery life.', specs: { Display: '1.4" AMOLED', Battery: '7 days', Water: 'IP68', Sensors: 'HR, SpO2, GPS' }, inStock: true, colors: ['Black', 'Silver', 'Rose Gold'] },
  { id: 3, name: 'Ergonomic Office Chair', brand: 'ComfortPlus', price: 299.99, rating: 4.7, reviews: 2341, category: 'Furniture', badge: 'Top Rated', image: '🪑', description: 'Fully adjustable ergonomic chair with lumbar support, breathable mesh back, and 5-year warranty.', specs: { Material: 'Mesh + Foam', Adjustable: 'Height, Armrests, Lumbar', Weight: '15kg', Capacity: '150kg' }, inStock: true, colors: ['Black', 'Gray'] },
  { id: 4, name: 'Mechanical Keyboard', brand: 'TypeMaster', price: 89.99, originalPrice: 119.99, rating: 4.6, reviews: 654, category: 'Electronics', image: '⌨️', description: 'Compact TKL mechanical keyboard with RGB backlighting and Cherry MX switches.', specs: { Switches: 'Cherry MX Red', Layout: 'TKL 87-key', Backlight: 'Per-key RGB', Cable: 'USB-C detachable' }, inStock: true, colors: ['Black', 'White'] },
  { id: 5, name: 'Running Shoes', brand: 'SpeedStep', price: 119.99, originalPrice: 159.99, rating: 4.4, reviews: 3102, category: 'Sports', badge: 'New', image: '👟', description: 'Lightweight marathon running shoes with responsive cushioning and breathable mesh upper.', specs: { Upper: 'Engineered mesh', Sole: 'Carbon rubber', Drop: '8mm', Weight: '265g' }, inStock: true, colors: ['White/Blue', 'Black/Red', 'Gray/Green'], sizes: ['7', '8', '9', '10', '11', '12'] },
  { id: 6, name: 'Yoga Mat Premium', brand: 'ZenFit', price: 49.99, rating: 4.2, reviews: 788, category: 'Sports', image: '🧘', description: 'Extra-thick 6mm yoga mat with alignment lines, non-slip surface, and carrying strap.', specs: { Thickness: '6mm', Material: 'TPE eco-friendly', Size: '183×61cm', Weight: '1.5kg' }, inStock: true, colors: ['Purple', 'Blue', 'Green', 'Black'] },
  { id: 7, name: 'Coffee Maker Deluxe', brand: 'BrewCraft', price: 69.99, originalPrice: 89.99, rating: 4.1, reviews: 445, category: 'Home', badge: 'Sale', image: '☕', description: 'Programmable 12-cup coffee maker with built-in grinder and thermal carafe.', specs: { Capacity: '12 cups', Grinder: 'Built-in conical burr', Timer: '24-hour programmable', Warranty: '3 years' }, inStock: true, colors: ['Black', 'Silver'] },
  { id: 8, name: 'Portable Bluetooth Speaker', brand: 'SoundMax', price: 39.99, originalPrice: 59.99, rating: 4.0, reviews: 2109, category: 'Electronics', image: '🔊', description: '360° sound portable speaker, waterproof IPX7, 12-hour playtime, and built-in microphone.', specs: { Battery: '12 hours', Water: 'IPX7', Connectivity: 'Bluetooth 5.0', Weight: '340g' }, inStock: false, colors: ['Black', 'Teal', 'Red'] },
  { id: 9, name: 'Desk Lamp LED', brand: 'LightPro', price: 34.99, rating: 4.3, reviews: 321, category: 'Home', image: '💡', description: 'Adjustable LED desk lamp with 5 brightness levels, USB charging port, and memory function.', specs: { Brightness: '5 levels', Color: '3 temperatures', USB: 'Type-A 5W', Life: '50,000 hours' }, inStock: true, colors: ['White', 'Black'] },
  { id: 10, name: 'Backpack 30L', brand: 'TrailBlaze', price: 59.99, originalPrice: 79.99, rating: 4.5, reviews: 1567, category: 'Bags', badge: 'Best Seller', image: '🎒', description: 'Water-resistant 30L backpack with laptop sleeve, multiple compartments, and padded straps.', specs: { Volume: '30L', Laptop: 'Up to 15.6"', Material: 'Water-resistant nylon', Weight: '700g' }, inStock: true, colors: ['Black', 'Navy', 'Olive'] },
  { id: 11, name: 'Wireless Charger Pad', brand: 'ChargeFast', price: 24.99, rating: 4.1, reviews: 890, category: 'Electronics', image: '🔌', description: '15W fast wireless charging pad compatible with all Qi-enabled devices.', specs: { Power: '15W max', Compatibility: 'Qi universal', LED: 'Indicator light', Cable: 'USB-C included' }, inStock: true, colors: ['Black', 'White'] },
  { id: 12, name: 'Stainless Water Bottle', brand: 'HydroMax', price: 29.99, rating: 4.6, reviews: 4230, category: 'Sports', badge: 'Top Rated', image: '🍶', description: 'Triple-wall insulated 750ml bottle keeps drinks cold 24h, hot 12h. BPA-free, leak-proof.', specs: { Capacity: '750ml', Insulation: '24h cold / 12h hot', Material: '18/8 stainless steel', Lid: 'Leak-proof' }, inStock: true, colors: ['Steel', 'Matte Black', 'Ocean Blue', 'Rose'] },
];

const CATEGORIES = ['All', ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

// ─── Sub-components ───────────────────────────────────────────────────────────
function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size} className={i <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
      ))}
    </div>
  );
}

function Breadcrumb({ stage, product, onNavigate }: { stage: Stage; product: Product | null; onNavigate: (s: Stage) => void }) {
  const crumbs: { label: string; stage: Stage }[] = [
    { label: 'Browse', stage: 'browse' },
    ...(product && stage !== 'browse' ? [{ label: product.name.slice(0, 20) + '…', stage: 'product' as Stage }] : []),
    ...(stage === 'cart' || stage === 'checkout' || stage === 'confirmation' ? [{ label: 'Cart', stage: 'cart' as Stage }] : []),
    ...(stage === 'checkout' || stage === 'confirmation' ? [{ label: 'Checkout', stage: 'checkout' as Stage }] : []),
    ...(stage === 'confirmation' ? [{ label: 'Confirmation', stage: 'confirmation' as Stage }] : []),
  ];
  return (
    <nav className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-4 flex-wrap" data-testid="ec-breadcrumb" aria-label="breadcrumb">
      <Home size={12} />
      {crumbs.map((c, i) => (
        <span key={c.stage} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={10} />}
          {i < crumbs.length - 1 ? (
            <button onClick={() => onNavigate(c.stage)} className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline" data-testid={`bc-${c.stage}`}>{c.label}</button>
          ) : (
            <span className="text-gray-800 dark:text-gray-200 font-medium">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

// ─── Stage: Browse ────────────────────────────────────────────────────────────
function BrowseStage({ onSelect, cart, setCart }: {
  onSelect: (p: Product) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(500);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      const matchCat = category === 'All' || p.category === category;
      const matchPrice = p.price <= maxPrice;
      const matchStock = !inStockOnly || p.inStock;
      return matchSearch && matchCat && matchPrice && matchStock;
    });
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sort === 'reviews') list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [search, category, sort, maxPrice, inStockOnly]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div data-testid="ec-browse-stage">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-6 text-white" data-testid="ec-hero-banner">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">🔥 Flash Sale — Up to 40% OFF</p>
            <h2 className="text-2xl font-black mb-1">Shop Everything</h2>
            <p className="text-blue-100 text-sm">Electronics, Sports, Home & more</p>
          </div>
          <div className="text-5xl hidden sm:block">🛍️</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center mb-4" data-testid="ec-toolbar">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="search" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search products…" data-testid="ec-search-input" aria-label="Search products" />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="border border-gray-200 dark:border-gray-700 rounded-lg text-sm px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          data-testid="ec-category-filter" aria-label="Filter by category">
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="border border-gray-200 dark:border-gray-700 rounded-lg text-sm px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          data-testid="ec-sort-select" aria-label="Sort products">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating">Best Rated</option>
          <option value="reviews">Most Reviews</option>
        </select>
        <button onClick={() => setShowFilters(f => !f)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-colors ${showFilters ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
          data-testid="ec-filter-toggle" aria-expanded={showFilters}>
          <SlidersHorizontal size={14} /> Filters
        </button>
        <div className="flex gap-1 ml-auto">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg border transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500'}`} data-testid="ec-view-grid" aria-label="Grid view"><Grid size={14} /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg border transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500'}`} data-testid="ec-view-list" aria-label="List view"><List size={14} /></button>
        </div>
      </div>

      {/* Advanced filters panel */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 grid sm:grid-cols-2 gap-4" data-testid="ec-advanced-filters">
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 block">
              Max Price: <span className="text-blue-600 dark:text-blue-400 font-mono" data-testid="ec-max-price-display">${maxPrice}</span>
            </label>
            <input type="range" min={10} max={500} step={10} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-blue-600" data-testid="ec-price-range" aria-label="Maximum price filter" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$10</span><span>$500</span></div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300" data-testid="ec-in-stock-label">
              <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} className="w-4 h-4 rounded text-blue-600" data-testid="ec-in-stock-filter" />
              In-stock only
            </label>
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3" data-testid="ec-results-count">
        Showing <span className="font-semibold text-gray-800 dark:text-gray-200">{filtered.length}</span> products
        {search && <> for "<span className="text-blue-600 dark:text-blue-400">{search}</span>"</>}
      </p>

      {/* Product grid/list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400" data-testid="ec-no-results">
          <Search size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No products found</p>
          <button onClick={() => { setSearch(''); setCategory('All'); setMaxPrice(500); setInStockOnly(false); }} className="mt-3 text-blue-600 text-sm hover:underline" data-testid="ec-clear-filters">Clear all filters</button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="ec-product-grid">
          {filtered.map(p => (
            <div key={p.id} className={`bg-white dark:bg-gray-800 border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ${!p.inStock ? 'opacity-60' : ''}`}
              data-testid={`ec-product-card-${p.id}`} data-category={p.category} data-in-stock={p.inStock}>
              {/* Image area */}
              <div className="relative bg-gray-50 dark:bg-gray-700 p-5 text-center cursor-pointer" onClick={() => p.inStock && onSelect(p)}>
                <span className="text-5xl" role="img" aria-label={p.name}>{p.image}</span>
                {p.badge && <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white" data-testid={`ec-badge-${p.id}`}>{p.badge}</span>}
                {!p.inStock && <span className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full bg-red-500 text-white" data-testid={`ec-out-of-stock-${p.id}`}>Out of Stock</span>}
                <button onClick={e => { e.stopPropagation(); setWishlist(w => { const n = new Set(w); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; }); }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white dark:bg-gray-800 shadow"
                  data-testid={`ec-wishlist-${p.id}`} aria-label={`${wishlist.has(p.id) ? 'Remove from' : 'Add to'} wishlist`} aria-pressed={wishlist.has(p.id)}>
                  <Heart size={13} className={wishlist.has(p.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                </button>
              </div>
              {/* Info */}
              <div className="p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{p.brand}</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight mb-1 cursor-pointer hover:text-blue-600" onClick={() => p.inStock && onSelect(p)} data-testid={`ec-product-name-${p.id}`}>{p.name}</p>
                <div className="flex items-center gap-1 mb-2">
                  <Stars rating={p.rating} size={11} />
                  <span className="text-xs text-gray-400">({p.reviews.toLocaleString()})</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900 dark:text-gray-100 text-sm" data-testid={`ec-price-${p.id}`}>${p.price}</span>
                    {p.originalPrice && <span className="text-xs text-gray-400 line-through ml-1">${p.originalPrice}</span>}
                  </div>
                  <button disabled={!p.inStock}
                    onClick={() => { setCart(c => { const ex = c.find(i => i.product.id === p.id); return ex ? c.map(i => i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...c, { product: p, qty: 1, color: p.colors[0] }]; }); console.log(`[ClickAndVerify] EC: Added to cart: ${p.name}`); }}
                    className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    data-testid={`ec-add-to-cart-${p.id}`} aria-label={`Add ${p.name} to cart`}>
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3" data-testid="ec-product-list">
          {filtered.map(p => (
            <div key={p.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex gap-4 items-center hover:shadow-md transition-all"
              data-testid={`ec-list-item-${p.id}`}>
              <span className="text-4xl shrink-0">{p.image}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-gray-400">{p.brand} · {p.category}</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm cursor-pointer hover:text-blue-600" onClick={() => p.inStock && onSelect(p)} data-testid={`ec-list-name-${p.id}`}>{p.name}</p>
                  </div>
                  {p.badge && <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs shrink-0">{p.badge}</span>}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{p.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Stars rating={p.rating} size={11} />
                  <span className="text-xs text-gray-400">({p.reviews.toLocaleString()})</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-gray-100" data-testid={`ec-list-price-${p.id}`}>${p.price}</p>
                  {p.originalPrice && <p className="text-xs text-gray-400 line-through">${p.originalPrice}</p>}
                </div>
                <button disabled={!p.inStock}
                  onClick={() => { setCart(c => { const ex = c.find(i => i.product.id === p.id); return ex ? c.map(i => i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...c, { product: p, qty: 1, color: p.colors[0] }]; }); }}
                  className="btn text-sm px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg disabled:opacity-40"
                  data-testid={`ec-list-add-${p.id}`}>Add</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Stage: Product Detail ────────────────────────────────────────────────────
function ProductStage({ product, cart, setCart, onBack, onViewCart }: {
  product: Product; cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onBack: () => void; onViewCart: () => void;
}) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [added, setAdded] = useState(false);

  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const addToCart = () => {
    setCart(c => {
      const ex = c.find(i => i.product.id === product.id && i.color === selectedColor);
      if (ex) return c.map(i => i.product.id === product.id && i.color === selectedColor ? { ...i, qty: i.qty + qty } : i);
      return [...c, { product, qty, color: selectedColor, size: selectedSize || undefined }];
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    console.log(`[ClickAndVerify] EC: Added to cart: ${product.name} x${qty} ${selectedColor}`);
  };

  const MOCK_REVIEWS = [
    { name: 'Alice M.', rating: 5, date: '2024-11-12', text: 'Absolutely love this product! Exceeded my expectations in every way.' },
    { name: 'Bob T.', rating: 4, date: '2024-10-28', text: 'Great quality for the price. Shipping was fast too.' },
    { name: 'Carol S.', rating: 3, date: '2024-10-15', text: 'Good product overall but setup instructions could be clearer.' },
  ];

  return (
    <div data-testid="ec-product-stage" data-product-id={product.id}>
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors" data-testid="ec-back-to-browse">
        <ArrowLeft size={14} /> Back to Browse
      </button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Image & badges */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-10 flex flex-col items-center justify-center gap-4" data-testid="ec-product-image-panel">
          <span className="text-8xl" role="img" aria-label={product.name}>{product.image}</span>
          <div className="flex gap-2 flex-wrap justify-center">
            {product.badge && <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs" data-testid="ec-product-badge">{product.badge}</span>}
            {!product.inStock && <span className="badge bg-red-100 text-red-700 text-xs" data-testid="ec-product-out-of-stock">Out of Stock</span>}
            {discount > 0 && <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs" data-testid="ec-product-discount">-{discount}% OFF</span>}
          </div>
        </div>

        {/* Right: Details */}
        <div data-testid="ec-product-details-panel">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1" data-testid="ec-product-brand">{product.brand}</p>
          <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-2" data-testid="ec-product-title">{product.name}</h1>
          <div className="flex items-center gap-3 mb-3">
            <Stars rating={product.rating} size={16} />
            <span className="text-sm text-gray-500" data-testid="ec-product-rating">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviews.toLocaleString()} reviews)</span>
          </div>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-black text-gray-900 dark:text-gray-100" data-testid="ec-product-price">${product.price}</span>
            {product.originalPrice && <span className="text-xl text-gray-400 line-through" data-testid="ec-product-original-price">${product.originalPrice}</span>}
            {discount > 0 && <span className="text-green-600 dark:text-green-400 font-bold text-sm" data-testid="ec-product-save">Save ${(product.originalPrice! - product.price).toFixed(2)}</span>}
          </div>

          {/* Color selection */}
          <div className="mb-4" data-testid="ec-color-selector">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Color: <span className="text-blue-600 dark:text-blue-400" data-testid="ec-selected-color">{selectedColor}</span></p>
            <div className="flex gap-2 flex-wrap" role="group" aria-label="Select color">
              {product.colors.map(c => (
                <button key={c} onClick={() => setSelectedColor(c)}
                  className={`px-3 py-1.5 rounded-lg text-sm border-2 transition-all ${selectedColor === c ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-semibold' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400'}`}
                  data-testid={`ec-color-${c.toLowerCase().replace(/\s+/g, '-')}`} aria-pressed={selectedColor === c}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Size selection */}
          {product.sizes && (
            <div className="mb-4" data-testid="ec-size-selector">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Size: <span className="text-blue-600 dark:text-blue-400" data-testid="ec-selected-size">{selectedSize}</span></p>
              <div className="flex gap-2 flex-wrap" role="group" aria-label="Select size">
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className={`w-10 h-10 rounded-lg text-sm border-2 font-medium transition-all ${selectedSize === s ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400'}`}
                    data-testid={`ec-size-${s}`} aria-pressed={selectedSize === s}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-3 mb-5" data-testid="ec-quantity-selector">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quantity:</p>
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400" data-testid="ec-qty-decrease" aria-label="Decrease quantity"><Minus size={14} /></button>
              <span className="px-4 py-2 text-sm font-mono font-bold border-x border-gray-200 dark:border-gray-700 min-w-[2.5rem] text-center" data-testid="ec-qty-value">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400" data-testid="ec-qty-increase" aria-label="Increase quantity"><Plus size={14} /></button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mb-4">
            <button onClick={addToCart} disabled={!product.inStock}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${added ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'} disabled:opacity-40`}
              data-testid="ec-add-to-cart-detail" data-added={added}>
              {added ? <><CheckCircle size={16} /> Added!</> : <><ShoppingCart size={16} /> Add to Cart</>}
            </button>
            <button onClick={() => { addToCart(); setTimeout(onViewCart, 100); }}
              disabled={!product.inStock}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 disabled:opacity-40 transition-colors"
              data-testid="ec-buy-now">
              <Zap size={16} /> Buy Now
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400" data-testid="ec-trust-badges">
            {[{ icon: '🚚', label: 'Free Delivery', sub: 'Orders over $50' }, { icon: '↩️', label: '30-Day Returns', sub: 'Hassle-free' }, { icon: '🔒', label: 'Secure Payment', sub: 'SSL encrypted' }].map(b => (
              <div key={b.label} className="flex flex-col items-center text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-lg mb-0.5">{b.icon}</span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">{b.label}</span>
                <span>{b.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: description / specs / reviews */}
      <div className="mt-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden" data-testid="ec-product-tabs">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {(['desc', 'specs', 'reviews'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${tab === t ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              data-testid={`ec-tab-${t}`} aria-selected={tab === t}>
              {t === 'desc' ? 'Description' : t === 'specs' ? 'Specifications' : `Reviews (${MOCK_REVIEWS.length})`}
            </button>
          ))}
        </div>
        <div className="p-5" data-testid="ec-tab-content">
          {tab === 'desc' && <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed" data-testid="ec-desc-text">{product.description}</p>}
          {tab === 'specs' && (
            <table className="w-full text-sm" data-testid="ec-specs-table">
              <tbody>
                {Object.entries(product.specs).map(([k, v]) => (
                  <tr key={k} className="border-b border-gray-100 dark:border-gray-700" data-testid={`ec-spec-${k.toLowerCase()}`}>
                    <td className="py-2 pr-4 text-gray-500 dark:text-gray-400 font-medium w-1/3">{k}</td>
                    <td className="py-2 text-gray-800 dark:text-gray-200">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab === 'reviews' && (
            <div className="space-y-4" data-testid="ec-reviews-list">
              {MOCK_REVIEWS.map((r, i) => (
                <div key={i} className="border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0" data-testid={`ec-review-${i}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-gray-800 dark:text-gray-200" data-testid={`ec-reviewer-${i}`}>{r.name}</span>
                    <span className="text-xs text-gray-400">{r.date}</span>
                  </div>
                  <Stars rating={r.rating} size={12} />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Stage: Cart ──────────────────────────────────────────────────────────────
function CartStage({ cart, setCart, onBrowse, onCheckout }: {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onBrowse: () => void;
  onCheckout: () => void;
}) {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState('');

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const discountAmt = subtotal * discount;
  const total = subtotal + shipping + tax - discountAmt;

  const applyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (code === 'SAVE10') { setDiscount(0.10); setPromoMsg('✓ 10% discount applied!'); }
    else if (code === 'SAVE20') { setDiscount(0.20); setPromoMsg('✓ 20% discount applied!'); }
    else if (code === 'FREESHIP') { setPromoMsg('✓ Free shipping applied!'); }
    else { setDiscount(0); setPromoMsg('✗ Invalid code. Try SAVE10 or SAVE20'); }
    console.log(`[ClickAndVerify] EC Cart: Promo applied: ${promoCode}`);
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-20" data-testid="ec-empty-cart">
        <ShoppingCart size={56} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-4">Add some products to get started</p>
        <button onClick={onBrowse} className="btn text-sm px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700" data-testid="ec-continue-shopping-empty">Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6" data-testid="ec-cart-stage">
      {/* Cart items */}
      <div className="lg:col-span-2 space-y-3" data-testid="ec-cart-items">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-gray-800 dark:text-gray-200">Cart ({cart.reduce((s, i) => s + i.qty, 0)} items)</h2>
          <button onClick={() => { setCart([]); console.log('[ClickAndVerify] EC Cart: Cleared'); }} className="text-xs text-red-500 hover:underline" data-testid="ec-clear-cart">Clear all</button>
        </div>
        {cart.map((item, idx) => (
          <div key={`${item.product.id}-${item.color}`} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex gap-4 items-center" data-testid={`ec-cart-item-${item.product.id}`}>
            <span className="text-3xl shrink-0">{item.product.image}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 leading-tight" data-testid={`ec-cart-name-${idx}`}>{item.product.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">Color: <span data-testid={`ec-cart-color-${idx}`}>{item.color}</span>{item.size && <> · Size: <span data-testid={`ec-cart-size-${idx}`}>{item.size}</span></>}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1" data-testid={`ec-cart-unit-price-${idx}`}>${item.product.price} each</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden text-sm">
                <button onClick={() => setCart(c => c.map((i, ii) => ii === idx ? { ...i, qty: Math.max(1, i.qty - 1) } : i))} className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700" data-testid={`ec-cart-dec-${idx}`}><Minus size={12} /></button>
                <span className="px-3 py-1 font-mono font-bold border-x border-gray-200 dark:border-gray-700" data-testid={`ec-cart-qty-${idx}`}>{item.qty}</span>
                <button onClick={() => setCart(c => c.map((i, ii) => ii === idx ? { ...i, qty: i.qty + 1 } : i))} className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700" data-testid={`ec-cart-inc-${idx}`}><Plus size={12} /></button>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100 w-16 text-right" data-testid={`ec-cart-item-total-${idx}`}>${(item.product.price * item.qty).toFixed(2)}</span>
              <button onClick={() => { setCart(c => c.filter((_, ii) => ii !== idx)); console.log(`[ClickAndVerify] EC Cart: Removed ${item.product.name}`); }} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" data-testid={`ec-cart-remove-${idx}`} aria-label={`Remove ${item.product.name}`}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        <button onClick={onBrowse} className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline mt-2" data-testid="ec-continue-shopping"><ArrowLeft size={14} /> Continue Shopping</button>
      </div>

      {/* Order summary */}
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5" data-testid="ec-order-summary">
          <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Subtotal</span><span data-testid="ec-summary-subtotal">${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Shipping</span><span data-testid="ec-summary-shipping" className={shipping === 0 ? 'text-green-600 dark:text-green-400' : ''}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Tax (8%)</span><span data-testid="ec-summary-tax">${tax.toFixed(2)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600 dark:text-green-400 font-medium"><span>Discount</span><span data-testid="ec-summary-discount">-${discountAmt.toFixed(2)}</span></div>}
            <div className="border-t border-gray-100 dark:border-gray-700 pt-2 flex justify-between font-black text-gray-900 dark:text-gray-100 text-base"><span>Total</span><span data-testid="ec-summary-total">${total.toFixed(2)}</span></div>
          </div>
          {shipping > 0 && <p className="text-xs text-orange-600 dark:text-orange-400 mt-2" data-testid="ec-free-shipping-hint">Add ${(50 - subtotal).toFixed(2)} more for free shipping!</p>}
        </div>

        {/* Promo */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4" data-testid="ec-promo-section">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1"><Tag size={13} /> Promo Code</p>
          <div className="flex gap-2">
            <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value)} className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. SAVE10" data-testid="ec-promo-input" />
            <button onClick={applyPromo} className="px-3 py-2 bg-gray-900 dark:bg-gray-600 text-white rounded-lg text-sm hover:opacity-80" data-testid="ec-promo-apply">Apply</button>
          </div>
          {promoMsg && <p className={`text-xs mt-1.5 ${promoMsg.startsWith('✓') ? 'text-green-600' : 'text-red-500'}`} data-testid="ec-promo-msg">{promoMsg}</p>}
        </div>

        <button onClick={onCheckout} className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors" data-testid="ec-proceed-to-checkout">
          Proceed to Checkout <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Stage: Checkout ──────────────────────────────────────────────────────────
function CheckoutStage({ cart, onConfirm, onBack }: { cart: CartItem[]; onConfirm: (orderId: string) => void; onBack: () => void; }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zip: '', country: 'United States', cardName: '', cardNumber: '', expiry: '', cvv: '', saveCard: false });
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const u = (field: string, val: string | boolean) => setForm(f => ({ ...f, [field]: val }));

  const validateShipping = () => {
    const e: Record<string, string> = {};
    if (!form.firstName) e.firstName = 'Required';
    if (!form.lastName) e.lastName = 'Required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.address) e.address = 'Required';
    if (!form.city) e.city = 'Required';
    if (!form.zip) e.zip = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    const orderId = `ORD-${Date.now().toString().slice(-8)}`;
    console.log(`[ClickAndVerify] EC: Order placed: ${orderId}`);
    onConfirm(orderId);
  };

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const total = subtotal + (subtotal >= 50 ? 0 : 9.99) + subtotal * 0.08;

  const Field = ({ name, label, type = 'text', placeholder, half }: { name: string; label: string; type?: string; placeholder?: string; half?: boolean }) => (
    <div className={half ? '' : 'col-span-2 sm:col-span-1'}>
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1" htmlFor={`co-${name}`}>{label}</label>
      <input id={`co-${name}`} type={type} name={name}
        value={typeof form[name as keyof typeof form] === 'boolean' ? '' : form[name as keyof typeof form] as string}
        onChange={e => u(name, e.target.value)}
        className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[name] ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
        placeholder={placeholder} data-testid={`co-${name}`} />
      {errors[name] && <p className="text-xs text-red-500 mt-1" data-testid={`co-${name}-error`}>{errors[name]}</p>}
    </div>
  );

  return (
    <div data-testid="ec-checkout-stage">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 mb-4" data-testid="ec-back-to-cart"><ArrowLeft size={14} /> Back to Cart</button>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6" data-testid="co-step-indicator">
        {(['shipping', 'payment'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === s ? 'bg-blue-600 text-white' : i === 0 && step === 'payment' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}
              data-testid={`co-step-${s}`}>{i === 0 && step === 'payment' ? '✓' : i + 1}</div>
            <span className={`text-sm font-medium capitalize ${step === s ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>{s}</span>
            {i < 1 && <ArrowRight size={14} className="text-gray-300" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {step === 'shipping' ? (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6" data-testid="co-shipping-form">
              <h2 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2"><Truck size={16} className="text-blue-500" /> Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field name="firstName" label="First Name" placeholder="Jane" />
                <Field name="lastName" label="Last Name" placeholder="Smith" />
                <div className="col-span-2"><Field name="email" label="Email" type="email" placeholder="jane@example.com" /></div>
                <div className="col-span-2"><Field name="address" label="Street Address" placeholder="123 Main St" /></div>
                <Field name="city" label="City" placeholder="New York" />
                <Field name="zip" label="ZIP Code" placeholder="10001" />
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Country</label>
                  <select value={form.country} onChange={e => u('country', e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" data-testid="co-country">
                    {['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={() => { if (validateShipping()) setStep('payment'); }} className="w-full mt-5 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors" data-testid="co-to-payment">Continue to Payment</button>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6" data-testid="co-payment-form">
              <h2 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2"><CreditCard size={16} className="text-blue-500" /> Payment Details</h2>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-4 text-xs text-yellow-700 dark:text-yellow-400" data-testid="co-test-card-hint">
                🧪 Test card: <span className="font-mono">4242 4242 4242 4242</span> · Any future expiry · Any CVV
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><Field name="cardName" label="Cardholder Name" placeholder="Jane Smith" /></div>
                <div className="col-span-2"><Field name="cardNumber" label="Card Number" placeholder="4242 4242 4242 4242" /></div>
                <Field name="expiry" label="Expiry (MM/YY)" placeholder="12/26" />
                <Field name="cvv" label="CVV" placeholder="123" type="password" />
                <div className="col-span-2">
                  <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                    <input type="checkbox" checked={form.saveCard} onChange={e => u('saveCard', e.target.checked)} className="w-4 h-4 rounded text-blue-600" data-testid="co-save-card" />
                    Save card for future purchases
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setStep('shipping')} className="px-5 py-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-sm" data-testid="co-back-to-shipping">← Back</button>
                <button onClick={placeOrder} disabled={loading} className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2" data-testid="co-place-order" aria-busy={loading}>
                  {loading ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Processing…</> : '🔒 Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mini summary */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 h-fit" data-testid="co-mini-summary">
          <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Order ({cart.reduce((s, i) => s + i.qty, 0)} items)</h3>
          {cart.map((item, i) => (
            <div key={i} className="flex items-center gap-2 mb-2 text-sm" data-testid={`co-summary-item-${i}`}>
              <span>{item.product.image}</span>
              <span className="flex-1 text-gray-700 dark:text-gray-300 truncate">{item.product.name} ×{item.qty}</span>
              <span className="font-mono text-gray-900 dark:text-gray-100">${(item.product.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 dark:border-gray-700 mt-3 pt-3 flex justify-between font-black text-gray-900 dark:text-gray-100">
            <span>Total</span><span data-testid="co-total-value">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stage: Confirmation ──────────────────────────────────────────────────────
function ConfirmationStage({ orderId, cart, onContinue }: { orderId: string; cart: CartItem[]; onContinue: () => void }) {
  const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0) * 1.08;
  const est = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  return (
    <div className="max-w-lg mx-auto text-center py-8" data-testid="ec-confirmation-stage">
      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-5">
        <CheckCircle size={40} className="text-green-500" />
      </div>
      <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-2" data-testid="ec-confirm-title">Order Confirmed!</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-4">Thank you for your purchase. Here's your receipt.</p>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 text-left mb-6" data-testid="ec-confirm-receipt">
        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-500">Order ID</span><span className="font-mono font-bold text-blue-600 dark:text-blue-400" data-testid="ec-order-id">{orderId}</span>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-500">Total Paid</span><span className="font-bold" data-testid="ec-confirm-total">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-500">Estimated Delivery</span><span className="text-green-600 dark:text-green-400 font-semibold" data-testid="ec-delivery-date">{est}</span>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-3 space-y-2">
          {cart.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm" data-testid={`ec-confirm-item-${i}`}>
              <span>{item.product.image}</span>
              <span className="flex-1 text-gray-700 dark:text-gray-300">{item.product.name} ×{item.qty}</span>
              <span className="font-mono">${(item.product.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-full px-4 py-2" data-testid="ec-tracking-info">
          <Package size={14} className="text-blue-500" /> Tracking number will be emailed shortly
        </div>
        <button onClick={onContinue} className="btn text-sm px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold" data-testid="ec-shop-again">Continue Shopping</button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EcommerceFlow() {
  const [stage, setStage] = useState<Stage>('browse');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderId, setOrderId] = useState('');

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const navigate = (s: Stage) => { setStage(s); window.scrollTo(0, 0); };

  const reset = () => { setStage('browse'); setSelectedProduct(null); setCart([]); setOrderId(''); };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" data-testid="ecommerce-flow">
      {/* Store header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-14 z-30" data-testid="ec-store-header">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <span className="font-black text-lg text-gray-900 dark:text-gray-100" data-testid="ec-store-name">ShopZone</span>
            <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs ml-1">Practice Store</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline" data-testid="ec-reset-btn">Reset Flow</button>
            <button onClick={() => navigate('cart')} className="relative p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors" data-testid="ec-cart-icon" aria-label={`Cart: ${cartCount} items`}>
              <ShoppingCart size={18} />
              {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center" data-testid="ec-cart-count">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <Breadcrumb stage={stage} product={selectedProduct} onNavigate={navigate} />

        {stage === 'browse' && <BrowseStage onSelect={p => { setSelectedProduct(p); navigate('product'); }} cart={cart} setCart={setCart} />}
        {stage === 'product' && selectedProduct && <ProductStage product={selectedProduct} cart={cart} setCart={setCart} onBack={() => navigate('browse')} onViewCart={() => navigate('cart')} />}
        {stage === 'cart' && <CartStage cart={cart} setCart={setCart} onBrowse={() => navigate('browse')} onCheckout={() => navigate('checkout')} />}
        {stage === 'checkout' && <CheckoutStage cart={cart} onConfirm={id => { setOrderId(id); navigate('confirmation'); }} onBack={() => navigate('cart')} />}
        {stage === 'confirmation' && <ConfirmationStage orderId={orderId} cart={cart} onContinue={reset} />}
      </div>
    </div>
  );
}
