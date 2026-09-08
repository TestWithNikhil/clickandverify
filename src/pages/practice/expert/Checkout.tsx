import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ChevronRight, CheckCircle, Package } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';

interface CartItem { id: string; name: string; price: number; qty: number; img: string; }
type CheckoutStage = 'cart' | 'address' | 'payment' | 'review' | 'confirmation';

const CATALOG: Omit<CartItem, 'qty'>[] = [
  { id: 'p1', name: 'Selenium WebDriver Guide', price: 29.99, img: '📘' },
  { id: 'p2', name: 'Playwright Masterclass', price: 39.99, img: '🎭' },
  { id: 'p3', name: 'Cypress Pro Subscription', price: 49.99, img: '🌲' },
  { id: 'p4', name: 'REST Assured Cookbook', price: 24.99, img: '☕' },
  { id: 'p5', name: 'k6 Performance Testing', price: 34.99, img: '⚡' },
];

export default function CheckoutPage() {
  const [stage, setStage] = useState<CheckoutStage>('cart');
  const [cart, setCart] = useState<CartItem[]>([
    { ...CATALOG[0], qty: 1 },
    { ...CATALOG[1], qty: 1 },
  ]);
  const [address, setAddress] = useState({ firstName: '', lastName: '', address: '', city: '', state: '', zip: '', country: '' });
  const [payment, setPayment] = useState({ cardName: '', cardNumber: '', expiry: '', cvv: '' });
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderNumber] = useState(() => `ORD-${Math.floor(10000 + Math.random() * 90000)}`);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const discountAmt = subtotal * discount;
  const total = subtotal + shipping - discountAmt;

  const addToCart = (item: Omit<CartItem, 'qty'>) => {
    setCart(c => { const ex = c.find(i => i.id === item.id); return ex ? c.map(i => i.id === item.id ? {...i, qty: i.qty+1} : i) : [...c, {...item, qty: 1}]; });
    console.log(`[ClickAndVerify] Cart add: ${item.name}`);
  };
  const updateQty = (id: string, delta: number) => {
    setCart(c => c.map(i => i.id === id ? {...i, qty: Math.max(1, i.qty+delta)} : i));
  };
  const removeItem = (id: string) => {
    console.log(`[ClickAndVerify] Cart remove: ${id}`);
    setCart(c => c.filter(i => i.id !== id));
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'TEST20') { setDiscount(0.2); setPromoMsg('✓ 20% discount applied!'); }
    else if (promoCode.toUpperCase() === 'FREE') { setDiscount(1); setPromoMsg('✓ 100% off! (test code)'); }
    else { setDiscount(0); setPromoMsg('✗ Invalid promo code. Try TEST20 or FREE'); }
    console.log(`[ClickAndVerify] Promo code: ${promoCode}`);
  };

  const proceed = async () => {
    if (stage === 'payment') {
      setLoading(true);
      await new Promise(r => setTimeout(r, 1500));
      setLoading(false);
    }
    const order: CheckoutStage[] = ['cart','address','payment','review','confirmation'];
    const next = order[order.indexOf(stage) + 1];
    if (next) { setStage(next); console.log(`[ClickAndVerify] Checkout stage: ${next}`); }
  };
  const back = () => {
    const order: CheckoutStage[] = ['cart','address','payment','review','confirmation'];
    const prev = order[order.indexOf(stage) - 1];
    if (prev) setStage(prev);
  };

  const stagesInfo = [
    {id:'cart', label:'Cart'}, {id:'address', label:'Shipping'}, {id:'payment', label:'Payment'},
    {id:'review', label:'Review'}, {id:'confirmation', label:'Done'},
  ];
  const stageIdx = stagesInfo.findIndex(s => s.id === stage);

  const F = ({ label, name, value, onChange, type='text', placeholder, required }: any) => (
    <div><label className="label" htmlFor={`checkout-${name}`}>{label}{required && ' *'}</label>
      <input id={`checkout-${name}`} type={type} name={name} value={value} onChange={(e:any) => onChange(e.target.value)} className="input" placeholder={placeholder} data-testid={`checkout-${name}`} /></div>
  );

  return (
    <PageLayout title="Mock Checkout Flow" description="Cart → Address → Payment → Review → Confirmation — full e2e practice flow." difficulty="expert" testId="checkout-page"
      onReset={() => { setStage('cart'); setCart([{...CATALOG[0],qty:1},{...CATALOG[1],qty:1}]); setAddress({firstName:'',lastName:'',address:'',city:'',state:'',zip:'',country:''}); setPayment({cardName:'',cardNumber:'',expiry:'',cvv:''}); setPromoCode(''); setDiscount(0); setPromoMsg(''); }}>
      <div className="max-w-4xl mx-auto">
        {/* Stage indicator */}
        <div className="flex items-center justify-center gap-1 mb-6 flex-wrap" data-testid="checkout-progress">
          {stagesInfo.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${s.id === stage ? 'bg-blue-600 text-white' : i < stageIdx ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}
                data-testid={`checkout-stage-${s.id}`} data-active={s.id === stage}>
                {i < stageIdx ? '✓ ' : ''}{s.label}
              </div>
              {i < stagesInfo.length - 1 && <ChevronRight size={14} className="text-gray-300 mx-1" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* CART */}
            {stage === 'cart' && (
              <div className="space-y-4">
                <div className="card p-5" data-testid="checkout-cart">
                  <h2 className="section-header flex items-center gap-2"><ShoppingCart size={18}/> Your Cart ({cart.length} items)</h2>
                  {cart.length === 0 ? (
                    <p className="text-gray-400 text-sm py-4 text-center" data-testid="cart-empty">Your cart is empty.</p>
                  ) : (
                    <div className="space-y-3">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg" data-testid={`cart-item-${item.id}`}>
                          <span className="text-2xl">{item.img}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200" data-testid={`cart-name-${item.id}`}>{item.name}</p>
                            <p className="text-xs text-gray-500" data-testid={`cart-price-${item.id}`}>${item.price.toFixed(2)} each</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-300" data-testid={`cart-dec-${item.id}`} aria-label="Decrease quantity"><Minus size={12}/></button>
                            <span className="w-8 text-center text-sm font-mono font-semibold" data-testid={`cart-qty-${item.id}`}>{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-300" data-testid={`cart-inc-${item.id}`} aria-label="Increase quantity"><Plus size={12}/></button>
                          </div>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100 w-16 text-right" data-testid={`cart-item-total-${item.id}`}>${(item.price * item.qty).toFixed(2)}</p>
                          <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500" data-testid={`cart-remove-${item.id}`} aria-label={`Remove ${item.name}`}><Trash2 size={14}/></button>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Promo */}
                  <div className="mt-4 flex gap-2" data-testid="checkout-promo">
                    <input type="text" className="input flex-1 text-sm" placeholder="Promo code (try TEST20)" value={promoCode} onChange={e => setPromoCode(e.target.value)} data-testid="checkout-promo-input" />
                    <button onClick={applyPromo} className="btn-secondary text-sm" data-testid="checkout-promo-apply">Apply</button>
                  </div>
                  {promoMsg && <p className={`text-xs mt-1.5 ${promoMsg.startsWith('✓') ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`} data-testid="checkout-promo-msg">{promoMsg}</p>}
                </div>
                <div className="card p-5" data-testid="checkout-catalog">
                  <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Add More Items</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CATALOG.map(item => (
                      <button key={item.id} onClick={() => addToCart(item)} className="p-2 text-left bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-700 transition-colors" data-testid={`catalog-add-${item.id}`}>
                        <span className="text-lg block mb-1">{item.img}</span>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 leading-tight">{item.name}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-mono mt-0.5">${item.price}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ADDRESS */}
            {stage === 'address' && (
              <div className="card p-6" data-testid="checkout-address-form">
                <h2 className="section-header">Shipping Address</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <F label="First Name" name="firstName" value={address.firstName} onChange={(v:string) => setAddress(a => ({...a, firstName: v}))} required placeholder="Jane" />
                  <F label="Last Name" name="lastName" value={address.lastName} onChange={(v:string) => setAddress(a => ({...a, lastName: v}))} required placeholder="Smith" />
                  <div className="sm:col-span-2"><F label="Address" name="address" value={address.address} onChange={(v:string) => setAddress(a => ({...a, address: v}))} required placeholder="123 Main St" /></div>
                  <F label="City" name="city" value={address.city} onChange={(v:string) => setAddress(a => ({...a, city: v}))} required placeholder="New York" />
                  <F label="State" name="state" value={address.state} onChange={(v:string) => setAddress(a => ({...a, state: v}))} required placeholder="NY" />
                  <F label="ZIP Code" name="zip" value={address.zip} onChange={(v:string) => setAddress(a => ({...a, zip: v}))} required placeholder="10001" />
                  <div><label className="label">Country *</label>
                    <select className="input" value={address.country} onChange={e => setAddress(a => ({...a, country: e.target.value}))} data-testid="checkout-country">
                      <option value="">Select…</option>
                      {['United States','Canada','United Kingdom','Australia'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* PAYMENT */}
            {stage === 'payment' && (
              <div className="card p-6" data-testid="checkout-payment-form">
                <h2 className="section-header">Payment Details</h2>
                <p className="section-sub">Mock payment — no real charges</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2"><F label="Cardholder Name" name="cardName" value={payment.cardName} onChange={(v:string) => setPayment(p => ({...p, cardName: v}))} required placeholder="Jane Smith" /></div>
                  <div className="sm:col-span-2"><F label="Card Number" name="cardNumber" value={payment.cardNumber} onChange={(v:string) => setPayment(p => ({...p, cardNumber: v.replace(/\D/,'').replace(/(.{4})/g,'$1 ').trim().slice(0,19)}))} required placeholder="4242 4242 4242 4242" /></div>
                  <F label="Expiry (MM/YY)" name="expiry" value={payment.expiry} onChange={(v:string) => setPayment(p => ({...p, expiry: v}))} required placeholder="12/26" />
                  <F label="CVV" name="cvv" value={payment.cvv} onChange={(v:string) => setPayment(p => ({...p, cvv: v.replace(/\D/,'').slice(0,4)}))} required placeholder="123" type="password" />
                </div>
                <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs text-yellow-700 dark:text-yellow-400" data-testid="payment-test-hint">
                  Use any test card: <code className="font-mono">4242 4242 4242 4242</code>, any future expiry, any CVV.
                </div>
              </div>
            )}

            {/* REVIEW */}
            {stage === 'review' && (
              <div className="card p-6 space-y-4" data-testid="checkout-review">
                <h2 className="section-header">Review Order</h2>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4" data-testid="review-items">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Items</p>
                  {cart.map(i => <div key={i.id} className="flex justify-between text-sm py-1" data-testid={`review-item-${i.id}`}><span>{i.img} {i.name} ×{i.qty}</span><span className="font-mono">${(i.price*i.qty).toFixed(2)}</span></div>)}
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4" data-testid="review-address">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Shipping</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{address.firstName} {address.lastName}<br/>{address.address}, {address.city} {address.zip}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4" data-testid="review-payment">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Payment</p>
                  <p className="text-sm font-mono text-gray-700 dark:text-gray-300">**** **** **** {payment.cardNumber.slice(-4) || '????'}</p>
                </div>
              </div>
            )}

            {/* CONFIRMATION */}
            {stage === 'confirmation' && (
              <div className="card p-10 text-center" data-testid="checkout-confirmation">
                <CheckCircle size={56} className="text-green-500 mx-auto mb-4"/>
                <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-2" data-testid="confirmation-title">Order Confirmed!</h2>
                <p className="text-gray-500 mb-1">Order number:</p>
                <p className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400 mb-4" data-testid="confirmation-order-number">{orderNumber}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">A confirmation would be sent to <span data-testid="confirmation-email" className="font-semibold">{address.firstName || 'Test'}</span>.</p>
                <div className="mt-6 flex gap-3 justify-center">
                  <button onClick={() => setStage('cart')} className="btn-secondary" data-testid="btn-continue-shopping"><Package size={14}/> Continue Shopping</button>
                </div>
              </div>
            )}

            {/* Navigation */}
            {stage !== 'confirmation' && (
              <div className="flex justify-between mt-4">
                <button onClick={back} disabled={stage === 'cart'} className="btn-secondary disabled:opacity-40" data-testid="checkout-back-btn">← Back</button>
                <button onClick={proceed} disabled={loading || cart.length === 0} className="btn-primary disabled:opacity-40" data-testid="checkout-next-btn" aria-busy={loading}>
                  {loading ? '⏳ Processing…' : stage === 'review' ? '✓ Place Order' : 'Continue →'}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="card p-5 h-fit" data-testid="checkout-order-summary">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Subtotal ({cart.reduce((s,i)=>s+i.qty,0)} items)</span><span data-testid="summary-subtotal">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Shipping</span><span data-testid="summary-shipping">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600 dark:text-green-400"><span>Discount ({(discount*100).toFixed(0)}%)</span><span data-testid="summary-discount">-${discountAmt.toFixed(2)}</span></div>}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-bold text-gray-900 dark:text-gray-100"><span>Total</span><span data-testid="summary-total">${total.toFixed(2)}</span></div>
            </div>
            {shipping === 0 && <p className="text-xs text-green-600 dark:text-green-400 mt-2" data-testid="free-shipping-msg">✓ Free shipping over $50!</p>}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
