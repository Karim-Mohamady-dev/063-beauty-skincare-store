import { useEffect, useMemo, useState } from 'react';
import {
  Check, Drop, Globe, Heart, MagnifyingGlass, ShoppingBag, Star, Trash, X,
} from '@phosphor-icons/react';
import { dicts, initialLang, t, type Lang } from './i18n';

type Stock = 'in' | 'low' | 'out';
type Review = { name: string; stars: number; textEn: string; textAr: string };
type Product = {
  id: string; nameEn: string; nameAr: string; category: string; concern: string;
  price: number; stock: Stock; color: string; isNew: boolean; pop: number; image: string;
  ingredientsEn: string[]; ingredientsAr: string[]; reviews: Review[];
};
type CartItem = { id: string; qty: number };

const LANG_KEY = '063-bloom-lang';
const CART_KEY = '063-bloom-cart-v1';
const WISH_KEY = '063-bloom-wish-v1';

const R = (name: string, stars: number, textEn: string, textAr: string): Review => ({ name, stars, textEn, textAr });

const PRODUCTS: Product[] = [
  { id: 'b1', nameEn: 'Hydra Glow Serum', nameAr: 'سيروم هيدرا جلو', category: 'skincare', concern: 'hydration', price: 42.37, stock: 'in', color: '#7dd3fc', isNew: true, pop: 94, image: 'https://images.pexels.com/photos/39392892/pexels-photo-39392892/free-photo-of-elegant-minimalist-skincare-product-display.jpeg?cs=tinysrgb&dpr=1&w=500', ingredientsEn: ['Hyaluronic acid', 'Glycerin', 'Panthenol'], ingredientsAr: ['حمض الهيالورونيك', 'جلسرين', 'بانثينول'], reviews: [R('Mona Adel', 5, 'My skin felt softer after the first week of use.', 'شعرت ببشرتي أنعم بعد أول أسبوع من الاستخدام.'), R('Sara Nabil', 4, 'Light texture and no sticky feeling.', 'قوام خفيف ولا يترك إحساسا لزجا.')] },
  { id: 'b2', nameEn: 'Vitamin C Bright Cream', nameAr: 'كريم فيتامين سي المشرق', category: 'skincare', concern: 'brightening', price: 38.91, stock: 'in', color: '#fbbf24', isNew: false, pop: 88, image: 'https://images.pexels.com/photos/27544691/pexels-photo-27544691/free-photo-of-a-white-tube-of-cream-and-a-green-plant-on-a-pink-background.jpeg?cs=tinysrgb&dpr=1&w=500', ingredientsEn: ['Vitamin C 10%', 'Ferulic acid', 'Vitamin E'], ingredientsAr: ['فيتامين سي 10٪', 'حمض الفيروليك', 'فيتامين هـ'], reviews: [R('Layla Hassan', 5, 'My skin tone looks more even after a month.', 'بدت درجة بشرتي أكثر توازنا بعد شهر.')] },
  { id: 'b3', nameEn: 'Gentle Foam Cleanser', nameAr: 'غسول رغوي لطيف', category: 'skincare', concern: 'sensitivity', price: 21.64, stock: 'low', color: '#a7f3d0', isNew: false, pop: 81, image: 'https://images.pexels.com/photos/16008945/pexels-photo-16008945/free-photo-of-creams-in-bottles-with-pumps-standing-on-a-mirror-and-on-yellow-background.jpeg?cs=tinysrgb&dpr=1&w=500', ingredientsEn: ['Aloe vera', 'Chamomile extract', 'Glycerin'], ingredientsAr: ['ألوفيرا', 'مستخلص البابونج', 'جلسرين'], reviews: [R('Omar Fathy', 4, 'Does not dry my skin out after washing.', 'لا يجفف بشرتي بعد الغسل.')] },
  { id: 'b4', nameEn: 'Matte Velvet Lipstick', nameAr: 'أحمر شفاه مخملي مطفي', category: 'makeup', concern: 'color', price: 18.47, stock: 'in', color: '#be185d', isNew: true, pop: 90, image: 'https://images.pexels.com/photos/7810573/pexels-photo-7810573.jpeg?cs=tinysrgb&dpr=1&w=500', ingredientsEn: ['Shea butter', 'Jojoba oil', 'Vitamin E'], ingredientsAr: ['زبدة الشيا', 'زيت الجوجوبا', 'فيتامين هـ'], reviews: [R('Nour Ahmed', 5, 'Stays in place for hours without drying my lips.', 'يثبت لساعات دون أن يجفف شفتي.')] },
  { id: 'b5', nameEn: 'Silk Finish Foundation', nameAr: 'كريم أساس سيلك فينيش', category: 'makeup', concern: 'coverage', price: 34.82, stock: 'in', color: '#f5d0a9', isNew: false, pop: 77, image: 'https://images.pexels.com/photos/4938271/pexels-photo-4938271.jpeg?cs=tinysrgb&dpr=1&w=500', ingredientsEn: ['Niacinamide', 'Squalane', 'SPF 15'], ingredientsAr: ['نياسيناميد', 'سكوالان', 'عامل حماية 15'], reviews: [R('Hana Mostafa', 4, 'Blends easily and looks natural in daylight.', 'يمتزج بسهولة ويبدو طبيعيا في ضوء النهار.')] },
  { id: 'b6', nameEn: 'Argan Repair Hair Oil', nameAr: 'زيت الأرغان لإصلاح الشعر', category: 'hair', concern: 'repair', price: 27.53, stock: 'in', color: '#f59e0b', isNew: false, pop: 83, image: 'https://images.pexels.com/photos/7428099/pexels-photo-7428099.jpeg?cs=tinysrgb&dpr=1&w=500', ingredientsEn: ['Argan oil', 'Castor oil', 'Vitamin E'], ingredientsAr: ['زيت الأرغان', 'زيت الخروع', 'فيتامين هـ'], reviews: [R('Dina Samir', 5, 'My hair feels smoother and less frizzy.', 'شعري أنعم وأقل تجعيدا.')] },
  { id: 'b7', nameEn: 'Clay Detox Mask', nameAr: 'قناع الطين المنقي', category: 'skincare', concern: 'pores', price: 24.19, stock: 'out', color: '#d6d3d1', isNew: false, pop: 72, image: 'https://images.pexels.com/photos/7691112/pexels-photo-7691112.jpeg?cs=tinysrgb&dpr=1&w=500', ingredientsEn: ['Kaolin clay', 'Zinc PCA', 'Green tea extract'], ingredientsAr: ['طين الكاولين', 'زنك PCA', 'مستخلص الشاي الأخضر'], reviews: [R('Karim Adel', 4, 'My skin feels clean without tightness.', 'بشرتي نظيفة دون شد.')] },
  { id: 'b8', nameEn: 'Rose Water Toner', nameAr: 'تونر ماء الورد', category: 'skincare', concern: 'hydration', price: 16.78, stock: 'in', color: '#f9a8d4', isNew: false, pop: 86, image: 'https://images.pexels.com/photos/7691166/pexels-photo-7691166.jpeg?cs=tinysrgb&dpr=1&w=500', ingredientsEn: ['Rose water', 'Glycerin', 'Allantoin'], ingredientsAr: ['ماء الورد', 'جلسرين', 'ألانتوين'], reviews: [R('Farah Ali', 5, 'Refreshing and gentle on my skin.', 'منعش ولطيف على بشرتي.')] },
  { id: 'b9', nameEn: 'Shea Body Butter', nameAr: 'زبدة الجسم بالشيا', category: 'body', concern: 'hydration', price: 22.46, stock: 'low', color: '#fef3c7', isNew: true, pop: 79, image: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?cs=tinysrgb&dpr=1&w=500', ingredientsEn: ['Shea butter', 'Cocoa butter', 'Sweet almond oil'], ingredientsAr: ['زبدة الشيا', 'زبدة الكاكاو', 'زيت اللوز الحلو'], reviews: [R('Maya Tarek', 5, 'Rich but absorbs well after a shower.', 'غنية وتمتص جيدا بعد الاستحمام.')] },
  { id: 'b10', nameEn: 'Lash Length Mascara', nameAr: 'ماسكارا إطالة الرموش', category: 'makeup', concern: 'color', price: 19.93, stock: 'in', color: '#181818', isNew: false, pop: 84, image: 'https://images.pexels.com/photos/7256145/pexels-photo-7256145.jpeg?cs=tinysrgb&dpr=1&w=500', ingredientsEn: ['Castor oil', 'Carnauba wax', 'Panthenol'], ingredientsAr: ['زيت الخروع', 'شمع الكرنوبا', 'بانثينول'], reviews: [R('Salma Yasser', 4, 'No clumps and easy to remove at night.', 'بدون تكتلات وسهلة الإزالة ليلا.')] },
  { id: 'b11', nameEn: 'Scalp Soothe Shampoo', nameAr: 'شامبو تهدئة فروة الرأس', category: 'hair', concern: 'sensitivity', price: 23.71, stock: 'in', color: '#86efac', isNew: false, pop: 75, image: 'https://images.pexels.com/photos/13573923/pexels-photo-13573923.jpeg?cs=tinysrgb&dpr=1&w=500', ingredientsEn: ['Tea tree oil', 'Aloe vera', 'Panthenol'], ingredientsAr: ['زيت شجرة الشاي', 'ألوفيرا', 'بانثينول'], reviews: [R('Ahmed Zaki', 4, 'My scalp feels calmer after two weeks.', 'فروة رأسي أهدأ بعد أسبوعين.')] },
  { id: 'b12', nameEn: 'Retinol Night Cream', nameAr: 'كريم الريتينول الليلي', category: 'skincare', concern: 'anti-aging', price: 47.28, stock: 'low', color: '#c4b5fd', isNew: true, pop: 89, image: 'https://images.pexels.com/photos/7691162/pexels-photo-7691162.jpeg?cs=tinysrgb&dpr=1&w=500', ingredientsEn: ['Retinol 0.3%', 'Squalane', 'Ceramide NP'], ingredientsAr: ['ريتينول 0.3٪', 'سكوالان', 'سيراميد NP'], reviews: [R('Rania Ehab', 5, 'Fine lines look softer after six weeks of use.', 'بدت الخطوط الدقيقة أنعم بعد ستة أسابيع.')] },
];

const CATS = ['skincare', 'makeup', 'hair', 'body'];
const CONCERNS = ['hydration', 'brightening', 'sensitivity', 'color', 'coverage', 'repair', 'pores', 'anti-aging'];

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() => initialLang(LANG_KEY));
  const dict = dicts[lang];
  const tr = (k: string) => t(dict, k);
  const [cart, setCart] = useState<CartItem[]>(() => load(CART_KEY, []));
  const [wish, setWish] = useState<string[]>(() => load(WISH_KEY, []));
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('all');
  const [concern, setConcern] = useState('all');
  const [maxPrice, setMaxPrice] = useState(50);
  const [sort, setSort] = useState('popular');
  const [view, setView] = useState<'shop' | 'wishlist'>('shop');
  const [detail, setDetail] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderNo, setOrderNo] = useState('');
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custAddr, setCustAddr] = useState('');
  const [formErrs, setFormErrs] = useState({ name: '', email: '', addr: '' });
  const [toast, setToast] = useState('');
  const [legal, setLegal] = useState<'privacy' | 'terms' | null>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem(LANG_KEY, lang); } catch { /* storage unavailable */ }
  }, [lang]);
  useEffect(() => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* noop */ } }, [cart]);
  useEffect(() => { try { localStorage.setItem(WISH_KEY, JSON.stringify(wish)); } catch { /* noop */ } }, [wish]);
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(''), 3000);
    return () => window.clearTimeout(id);
  }, [toast]);

  const nameOf = (p: Product) => (lang === 'ar' ? p.nameAr : p.nameEn);
  const ingOf = (p: Product) => (lang === 'ar' ? p.ingredientsAr : p.ingredientsEn);
  const avgStars = (p: Product) => p.reviews.length ? p.reviews.reduce((s, r) => s + r.stars, 0) / p.reviews.length : 0;

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) =>
      (cat === 'all' || p.category === cat) &&
      (concern === 'all' || p.concern === concern) &&
      p.price <= maxPrice &&
      (search.trim() === '' || `${p.nameEn} ${p.nameAr} ${ingOf(p).join(' ')}`.toLowerCase().includes(search.trim().toLowerCase())),
    );
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === 'new') list = [...list].sort((a, b) => Number(b.isNew) - Number(a.isNew));
    else list = [...list].sort((a, b) => b.pop - a.pop);
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat, concern, maxPrice, search, sort, lang]);

  const shown = view === 'wishlist' ? filtered.filter((p) => wish.includes(p.id)) : filtered;
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => {
    const p = PRODUCTS.find((x) => x.id === i.id);
    return s + (p ? p.price * i.qty : 0);
  }, 0);

  function addToCart(p: Product) {
    if (p.stock === 'out') return;
    setCart((c) => {
      const found = c.find((i) => i.id === p.id);
      if (found) return c.map((i) => (i === found ? { ...i, qty: i.qty + 1 } : i));
      return [...c, { id: p.id, qty: 1 }];
    });
    setToast(`${nameOf(p)} · ${tr('addToCart')}`);
  }
  function toggleWish(id: string) {
    setWish((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  }
  function placeOrder() {
    const errs = {
      name: custName.trim() ? '' : tr('nameError'),
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(custEmail.trim()) ? '' : tr('emailError'),
      addr: custAddr.trim() ? '' : tr('addressError'),
    };
    setFormErrs(errs);
    if (errs.name || errs.email || errs.addr) return;
    setOrderNo(`BLM-${Math.floor(10000 + Math.random() * 89999)}`);
    setCart([]);
    setCheckoutOpen(false);
  }
  function stockLabel(p: Product) {
    return p.stock === 'in' ? tr('inStock') : p.stock === 'low' ? tr('lowStock') : tr('outOfStock');
  }
  function stockClass(p: Product) {
    return p.stock === 'in' ? 'bg-[#e6f4f2] text-[#0f766e]' : p.stock === 'low' ? 'bg-[#fdf3e3] text-[#b45309]' : 'bg-[#f5f5f4] text-[#666666]';
  }

  function productCard(p: Product) {
    const wished = wish.includes(p.id);
    return (
      <article key={p.id} className="overflow-hidden rounded-2xl border border-[#e3e3e3] motion-hover hover:shadow-lg">
        <button type="button" onClick={() => setDetail(p)} className="block w-full text-start" aria-label={nameOf(p)}>
          <span className="relative block h-40 overflow-hidden">
            <img src={p.image} alt={nameOf(p)} loading="lazy" className="h-full w-full object-cover" />
            {p.isNew && <span className="caption-4 absolute top-2 start-2 rounded-full bg-[#181818] px-2 py-1 text-white">{tr('new')}</span>}
          </span>
        </button>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="title-2 truncate">{nameOf(p)}</h3>
              <p className="caption-2 text-[#666666]">{p.category} · {p.concern}</p>
            </div>
            <button type="button" onClick={() => toggleWish(p.id)} aria-label={tr('wishlist')} aria-pressed={wished} className="rounded-full p-2 motion-hover hover:bg-[#fdf2f8] active:scale-[0.98]">
              <Heart size={20} weight={wished ? 'fill' : 'regular'} className={wished ? 'text-[#be185d]' : 'text-[#181818]'} />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="flex items-center gap-1" aria-label={`${avgStars(p).toFixed(1)} / 5`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} size={14} weight={n <= Math.round(avgStars(p)) ? 'fill' : 'regular'} className="text-[#f59e0b]" />
              ))}
            </span>
            <span className="caption-5 text-[#666666]">{avgStars(p).toFixed(1)} · {p.reviews.length} {tr('reviews')}</span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="title-2">${p.price.toFixed(2)}</span>
            <span className={`caption-4 rounded-full px-2 py-1 ${stockClass(p)}`}>{stockLabel(p)}</span>
          </div>
          <p className="caption-5 mt-2 truncate text-[#666666]">{tr('ingredients')}: {ingOf(p).join(', ')}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => setDetail(p)} className="button-sm flex-1 rounded-xl border border-[#e3e3e3] px-3 py-2 motion-hover hover:bg-[#fdf2f8] active:scale-[0.98]">{tr('viewDetails')}</button>
            <button type="button" disabled={p.stock === 'out'} onClick={() => addToCart(p)} className="button-sm flex-1 rounded-xl bg-[#be185d] px-3 py-2 text-white motion-hover hover:bg-[#9d174d] active:scale-[0.98] disabled:opacity-50">{tr('addToCart')}</button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#181818]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-sm">
        {lang === 'ar' ? 'تخطَّ إلى المحتوى' : 'Skip to content'}
      </a>
      <header className="sticky top-4 z-40 mx-auto max-w-6xl px-4">
        <nav className="flex items-center justify-between gap-2 rounded-2xl border border-[#e3e3e3] bg-white/90 px-4 py-2 backdrop-blur" aria-label="Main">
          <span className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#be185d] text-white"><Drop size={18} weight="bold" /></span>
            <span className="title-1">Bloom</span>
            <span className="caption-4 hidden rounded-full bg-[#fdf2f8] px-2 py-1 text-[#be185d] sm:inline">{tr('demoLabel')}</span>
          </span>
          <span className="flex items-center gap-2">
            <button type="button" onClick={() => setView('shop')} className={`button-sm rounded-lg px-3 py-2 motion-hover active:scale-[0.98] ${view === 'shop' ? 'bg-[#181818] text-white' : 'hover:bg-[#fdf2f8]'}`}>{tr('category')}</button>
            <button type="button" onClick={() => setView('wishlist')} className={`button-sm flex items-center gap-1 rounded-lg px-3 py-2 motion-hover active:scale-[0.98] ${view === 'wishlist' ? 'bg-[#181818] text-white' : 'hover:bg-[#fdf2f8]'}`}>
              <Heart size={16} weight={wish.length ? 'fill' : 'regular'} />{tr('wishlist')} ({wish.length})
            </button>
            <button type="button" onClick={() => setCartOpen(true)} className="button-sm flex items-center gap-1 rounded-lg bg-[#be185d] px-3 py-2 text-white motion-hover hover:bg-[#9d174d] active:scale-[0.98]">
              <ShoppingBag size={16} />{tr('cart')} ({cartCount})
            </button>
            <button type="button" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="button-sm flex items-center gap-2 rounded-lg border border-[#e3e3e3] px-3 py-2 motion-hover hover:bg-[#fdf2f8] active:scale-[0.98]">
              <Globe size={16} />{tr('langSwitch')}
            </button>
          </span>
        </nav>
      </header>

      <main id="main">
        <section className="mx-auto max-w-6xl px-4 pt-16 pb-8 text-center">
          <h1 className="heading-1 hero-gradient-light mx-auto max-w-[680px]">{tr('heroTitle')}</h1>
          <p className="body-3 mx-auto mt-4 max-w-[680px] text-[#666666]">{tr('heroSub')}</p>
          <div className="mt-8">
            <button type="button" onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })} className="button-md rounded-xl bg-[#be185d] px-3 py-2 text-white motion-hover hover:bg-[#9d174d] active:scale-[0.98]">{tr('heroCta')}</button>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8" aria-label="Tagline">
          <p className="heading-3 mx-auto max-w-[680px] text-center">{tr('tagline')}</p>
        </section>

        <section id="shop" className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col gap-4 rounded-2xl border border-[#e3e3e3] p-4 lg:flex-row lg:items-end">
            <div className="flex-1">
              <label htmlFor="search" className="title-4 block">{tr('searchPh')}</label>
              <div className="relative mt-2">
                <MagnifyingGlass size={18} className="absolute top-1/2 start-3 -translate-y-1/2 text-[#9b9b9b]" />
                <input id="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={tr('searchPh')} className="body-3 w-full rounded-xl border border-[#e3e3e3] py-2 pe-3 ps-10" />
              </div>
            </div>
            <div>
              <label htmlFor="cat" className="title-4 block">{tr('category')}</label>
              <select id="cat" value={cat} onChange={(e) => setCat(e.target.value)} className="body-3 mt-2 rounded-xl border border-[#e3e3e3] px-3 py-2">
                <option value="all">{tr('all')}</option>
                {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="concern" className="title-4 block">{tr('skinConcern')}</label>
              <select id="concern" value={concern} onChange={(e) => setConcern(e.target.value)} className="body-3 mt-2 rounded-xl border border-[#e3e3e3] px-3 py-2">
                <option value="all">{tr('all')}</option>
                {CONCERNS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="sort" className="title-4 block">{tr('sort')}</label>
              <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)} className="body-3 mt-2 rounded-xl border border-[#e3e3e3] px-3 py-2">
                <option value="popular">{tr('sortPopular')}</option>
                <option value="low">{tr('sortLow')}</option>
                <option value="high">{tr('sortHigh')}</option>
                <option value="new">{tr('sortNew')}</option>
              </select>
            </div>
            <div className="min-w-40">
              <label htmlFor="price" className="title-4 block">{tr('maxPrice')} · ${maxPrice}</label>
              <input id="price" type="range" min={15} max={50} step={1} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="mt-4 w-full accent-[#be185d]" />
            </div>
            <button type="button" onClick={() => { setSearch(''); setCat('all'); setConcern('all'); setMaxPrice(50); setSort('popular'); }} className="button-sm rounded-xl border border-[#e3e3e3] px-3 py-2 motion-hover hover:bg-[#fdf2f8] active:scale-[0.98]">{tr('clearFilters')}</button>
          </div>

          {shown.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-[#e3e3e3] p-8 text-center">
              <Drop size={40} className="mx-auto text-[#9b9b9b]" />
              <p className="title-2 mt-4">{view === 'wishlist' ? tr('wishlistEmpty') : tr('noResults')}</p>
              <p className="body-6 mt-2 text-[#666666]">{view === 'wishlist' ? tr('wishlistEmptyBody') : tr('noResultsBody')}</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {shown.map((p) => productCard(p))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-[#e3e3e3] py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4">
          <p className="caption-2 text-[#666666]">{tr('footerNote')}</p>
          <span className="flex gap-4">
            <button type="button" onClick={() => setLegal('privacy')} className="caption-2 underline motion-hover hover:text-[#be185d]">{tr('privacy')}</button>
            <button type="button" onClick={() => setLegal('terms')} className="caption-2 underline motion-hover hover:text-[#be185d]">{tr('terms')}</button>
          </span>
        </div>
      </footer>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" role="dialog" aria-modal="true" aria-label={nameOf(detail)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="heading-6">{nameOf(detail)}</h2>
                <p className="caption-2 mt-1 text-[#666666]">{detail.category} · {detail.concern}</p>
              </div>
              <button type="button" onClick={() => setDetail(null)} className="rounded-lg p-2 motion-hover hover:bg-[#fdf2f8]" aria-label={tr('close')}><X size={18} /></button>
            </div>
            <div className="mt-4 h-40 overflow-hidden rounded-2xl">
              <img src={detail.image} alt={nameOf(detail)} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="heading-5">${detail.price.toFixed(2)}</span>
              <span className={`caption-4 rounded-full px-2 py-1 ${stockClass(detail)}`}>{stockLabel(detail)}</span>
            </div>
            <h3 className="title-2 mt-6">{tr('ingredients')}</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {ingOf(detail).map((ing) => (
                <li key={ing} className="caption-4 rounded-full bg-[#fdf2f8] px-3 py-1 text-[#be185d]">{ing}</li>
              ))}
            </ul>
            <h3 className="title-2 mt-6 flex items-center gap-2">{tr('reviews')} <span className="caption-4 rounded-full bg-[#fdf3e3] px-2 py-1 text-[#b45309]">{tr('sampleLabel')}</span></h3>
            <p className="caption-2 mt-1 text-[#666666]">{tr('reviewsNote')}</p>
            <ul className="mt-2 space-y-3">
              {detail.reviews.map((r) => (
                <li key={r.name} className="rounded-xl border border-[#e3e3e3] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="body-5">{r.name}</span>
                    <span className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} size={12} weight={n <= r.stars ? 'fill' : 'regular'} className="text-[#f59e0b]" />
                      ))}
                    </span>
                  </div>
                  <p className="body-6 mt-2 text-[#666666]">{lang === 'ar' ? r.textAr : r.textEn}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-2">
              <button type="button" disabled={detail.stock === 'out'} onClick={() => { addToCart(detail); setDetail(null); }} className="button-sm flex-1 rounded-xl bg-[#be185d] px-3 py-2 text-white motion-hover hover:bg-[#9d174d] active:scale-[0.98] disabled:opacity-50">{tr('addToCart')}</button>
              <button type="button" onClick={() => toggleWish(detail.id)} className="button-sm flex items-center gap-2 rounded-xl border border-[#e3e3e3] px-3 py-2 motion-hover hover:bg-[#fdf2f8] active:scale-[0.98]">
                <Heart size={16} weight={wish.includes(detail.id) ? 'fill' : 'regular'} className={wish.includes(detail.id) ? 'text-[#be185d]' : ''} />{tr('wishlist')}
              </button>
            </div>
          </div>
        </div>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" role="dialog" aria-modal="true" aria-label={tr('cart')}>
          <div className="flex h-full w-full max-w-md flex-col bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="heading-6">{tr('cart')} ({cartCount})</h2>
              <button type="button" onClick={() => setCartOpen(false)} className="rounded-lg p-2 motion-hover hover:bg-[#fdf2f8]" aria-label={tr('close')}><X size={18} /></button>
            </div>
            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <ShoppingBag size={40} className="text-[#9b9b9b]" />
                <p className="title-2 mt-4">{tr('cartEmpty')}</p>
                <p className="body-6 mt-2 text-[#666666]">{tr('cartEmptyBody')}</p>
                <button type="button" onClick={() => setCartOpen(false)} className="button-sm mt-6 rounded-xl bg-[#181818] px-3 py-2 text-white motion-hover active:scale-[0.98]">{tr('continueShopping')}</button>
              </div>
            ) : (
              <>
                <ul className="mt-4 flex-1 space-y-2 overflow-y-auto">
                  {cart.map((item) => {
                    const p = PRODUCTS.find((x) => x.id === item.id);
                    if (!p) return null;
                    return (
                      <li key={item.id} className="flex items-center gap-3 rounded-xl border border-[#e3e3e3] p-3">
                        <img src={p.image} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                        <span className="min-w-0 flex-1">
                          <span className="body-5 block truncate">{nameOf(p)}</span>
                          <span className="caption-5 block text-[#666666]">${p.price.toFixed(2)} · ${(p.price * item.qty).toFixed(2)}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <button type="button" onClick={() => setCart((c) => c.map((x) => (x.id === item.id ? { ...x, qty: Math.max(1, x.qty - 1) } : x)))} className="button-sm h-8 w-8 rounded-lg border border-[#e3e3e3] motion-hover hover:bg-[#fdf2f8]" aria-label="-">−</button>
                          <span className="body-5 w-4 text-center">{item.qty}</span>
                          <button type="button" onClick={() => setCart((c) => c.map((x) => (x.id === item.id ? { ...x, qty: x.qty + 1 } : x)))} className="button-sm h-8 w-8 rounded-lg border border-[#e3e3e3] motion-hover hover:bg-[#fdf2f8]" aria-label="+">+</button>
                          <button type="button" onClick={() => setCart((c) => c.filter((x) => x.id !== item.id))} className="rounded-lg p-2 text-[#c2410c] motion-hover hover:bg-[#fdf2f8]" aria-label={tr('remove')}><Trash size={16} /></button>
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-4 border-t border-[#e3e3e3] pt-4">
                  <div className="flex justify-between"><span className="body-5">{tr('subtotal')}</span><span className="title-2">${subtotal.toFixed(2)}</span></div>
                  <button type="button" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }} className="button-md mt-4 w-full rounded-xl bg-[#be185d] px-3 py-2 text-white motion-hover hover:bg-[#9d174d] active:scale-[0.98]">{tr('checkout')} · ${subtotal.toFixed(2)}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" role="dialog" aria-modal="true" aria-label={tr('checkout')}>
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="heading-6">{tr('checkout')}</h2>
              <button type="button" onClick={() => setCheckoutOpen(false)} className="rounded-lg p-2 motion-hover hover:bg-[#fdf2f8]" aria-label={tr('close')}><X size={18} /></button>
            </div>
            <p className="caption-2 mt-2 rounded-xl bg-[#fdf2f8] px-3 py-2 text-[#be185d]">{tr('checkoutDemo')} · {tr('checkoutNote')}</p>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="co-name" className="title-4 block">{tr('name')}</label>
                <input id="co-name" value={custName} onChange={(e) => setCustName(e.target.value)} className="body-3 mt-2 w-full rounded-xl border border-[#e3e3e3] px-3 py-2" />
                {formErrs.name && <p className="caption-2 mt-2 text-[#c2410c]" role="alert">{formErrs.name}</p>}
              </div>
              <div>
                <label htmlFor="co-email" className="title-4 block">{tr('email')}</label>
                <input id="co-email" value={custEmail} onChange={(e) => setCustEmail(e.target.value)} dir="ltr" className="body-3 mt-2 w-full rounded-xl border border-[#e3e3e3] px-3 py-2" />
                {formErrs.email && <p className="caption-2 mt-2 text-[#c2410c]" role="alert">{formErrs.email}</p>}
              </div>
              <div>
                <label htmlFor="co-addr" className="title-4 block">{tr('address')}</label>
                <textarea id="co-addr" value={custAddr} onChange={(e) => setCustAddr(e.target.value)} rows={2} className="body-3 mt-2 w-full rounded-xl border border-[#e3e3e3] px-3 py-2" />
                {formErrs.addr && <p className="caption-2 mt-2 text-[#c2410c]" role="alert">{formErrs.addr}</p>}
              </div>
              <div className="flex justify-between border-t border-[#e3e3e3] pt-4"><span className="body-5">{tr('total')}</span><span className="title-2">${subtotal.toFixed(2)}</span></div>
              <button type="button" onClick={placeOrder} className="button-md w-full rounded-xl bg-[#be185d] px-3 py-2 text-white motion-hover hover:bg-[#9d174d] active:scale-[0.98]">{tr('placeOrder')}</button>
            </div>
          </div>
        </div>
      )}

      {orderNo && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" role="dialog" aria-modal="true" aria-label={tr('orderDone')}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e6f4f2] text-[#0f766e]"><Check size={24} weight="bold" /></span>
            <h2 className="heading-6 mt-4">{tr('orderDone')}</h2>
            <p className="body-6 mt-2 text-[#666666]">{tr('orderDoneBody')}</p>
            <p className="title-2 mt-4">{tr('orderNumber')}: <span dir="ltr">{orderNo}</span></p>
            <button type="button" onClick={() => setOrderNo('')} className="button-sm mt-6 rounded-xl bg-[#181818] px-3 py-2 text-white motion-hover active:scale-[0.98]">{tr('continueShopping')}</button>
          </div>
        </div>
      )}

      {legal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" role="dialog" aria-modal="true" aria-label={tr(legal)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between"><h2 className="heading-6">{tr(legal)}</h2><button type="button" onClick={() => setLegal(null)} className="rounded-lg p-2 motion-hover hover:bg-[#fdf2f8]" aria-label={tr('close')}><X size={18} /></button></div>
            <p className="body-3 mt-4 text-[#666666]">{tr(legal === 'privacy' ? 'privacyBody' : 'termsBody')}</p>
            <button type="button" onClick={() => setLegal(null)} className="button-sm mt-6 rounded-xl bg-[#181818] px-3 py-2 text-white motion-hover active:scale-[0.98]">{tr('close')}</button>
          </div>
        </div>
      )}
      {toast && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-[#181818] px-4 py-2 text-sm text-white shadow-lg" role="status">{toast}</div>
      )}
    </div>
  );
}
