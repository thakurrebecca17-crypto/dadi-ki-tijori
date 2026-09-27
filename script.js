const products = [
  {id:'aam', name:'Aam Ki Tijori', tag:'Mango Pickle', img:'images/aam.jpg'},
  {id:'nimbu', name:'Nimbu Ki Tijori', tag:'Lemon Pickle', img:'images/nimbu.jpg'},
  {id:'mirchi', name:'Mirchi Ki Tijori', tag:'Chilli Pickle', img:'images/mirchi.jpg'},
  {id:'mixed', name:'Mixed Tijori', tag:'Mixed Pickle', img:'images/mixed.jpg'},
];
const sizes = [
  {id:'trial', label:'Trial · 100g', price:59},
  {id:'regular', label:'Regular · 250g', price:129},
  {id:'family', label:'Family · 500g', price:229},
  {id:'combo', label:'Tijori Combo · 3×250g', price:349},
];
let cart = [];

function renderProducts(){
  const grid = document.getElementById('prodGrid');
  grid.innerHTML = products.map(p => `
    <div class="prodCard reveal">
      <img src="${p.img}" alt="${p.name}">
      <div class="prodBody">
        <h4>${p.name}</h4>
        <div class="tag">${p.tag}</div>
        <select id="size-${p.id}">
          ${sizes.map(s=>`<option value="${s.id}" data-price="${s.price}">${s.label} — ₹${s.price}</option>`).join('')}
        </select>
        <div class="priceRow">
          <div class="qtyBox">
            <button type="button" onclick="changeQty('${p.id}',-1)">−</button>
            <span id="qty-${p.id}">1</span>
            <button type="button" onclick="changeQty('${p.id}',1)">+</button>
          </div>
        </div>
        <button class="addBtn" id="add-${p.id}" onclick="addToCart('${p.id}')">Add to Tijori</button>
      </div>
    </div>`).join('');
  observeReveals();
}
function changeQty(id,delta){
  const el = document.getElementById(`qty-${id}`);
  let v = Math.max(1, parseInt(el.textContent)+delta);
  el.textContent = v;
}
function addToCart(id){
  const p = products.find(x=>x.id===id);
  const sizeSel = document.getElementById(`size-${id}`);
  const size = sizes.find(s=>s.id===sizeSel.value);
  const qty = parseInt(document.getElementById(`qty-${id}`).textContent);
  const key = id+'-'+size.id;
  const existing = cart.find(c=>c.key===key);
  if(existing){ existing.qty += qty; } else {
    cart.push({key, name:p.name, sizeLabel:size.label, price:size.price, qty, img:p.img});
  }
  renderCart();
  const btn = document.getElementById(`add-${id}`);
  btn.textContent='Added ✓'; btn.classList.add('added');
  setTimeout(()=>{btn.textContent='Add to Tijori'; btn.classList.remove('added');},1200);
  openCart();
}
function removeFromCart(key){ cart = cart.filter(c=>c.key!==key); renderCart(); }
function cartTotal(){ return cart.reduce((s,c)=>s+c.price*c.qty,0); }
function renderCart(){
  document.getElementById('cartCount').textContent = cart.reduce((s,c)=>s+c.qty,0);
  const items = document.getElementById('drawerItems');
  if(cart.length===0){
    items.innerHTML = '<div class="emptyCart">Your Tijori is empty. Add a jar from the shop.</div>';
  } else {
    items.innerHTML = cart.map(c=>`
      <div class="cItem">
        <img src="${c.img}" alt="${c.name}">
        <div class="ci-info">
          <h5>${c.name}</h5>
          <small>${c.sizeLabel} × ${c.qty} — ₹${c.price*c.qty}</small><br>
          <span class="ci-remove" onclick="removeFromCart('${c.key}')">Remove</span>
        </div>
      </div>`).join('');
  }
  document.getElementById('cartTotal').textContent = '₹'+cartTotal();
  updateOrderLinks();
}
function orderSummary(){
  return cart.map(c=>`${c.name} (${c.sizeLabel}) x${c.qty} — ₹${c.price*c.qty}`).join('\n');
}
function updateOrderLinks(){
  const summary = orderSummary() || 'No items yet';
  const total = cartTotal();
  const waText = encodeURIComponent(`Namaste Dadi Ki Tijori! I'd like to place an order:\n\n${summary}\n\nTotal: ₹${total}\n\nName: \nPhone: \nAddress: \nCity: \nPincode: `);
  document.getElementById('waOrderBtn').href = `https://wa.me/919892514051?text=${waText}`;
  const emailBody = encodeURIComponent(`Order details:\n\n${summary}\n\nTotal: ₹${total}\n\nName: \nPhone: \nAddress: \nCity: \nPincode: `);
  document.getElementById('emailOrderBtn').href = `mailto:dadikitijori@gmail.com?subject=${encodeURIComponent('New Order - Dadi Ki Tijori')}&body=${emailBody}`;
}
document.getElementById('emailOrderBtn').addEventListener('click',()=>{ /* mailto handled via href set above */ });

function openCart(){ document.getElementById('drawer').classList.add('open'); document.getElementById('overlay').classList.add('open'); }
function closeCart(){ document.getElementById('drawer').classList.remove('open'); document.getElementById('overlay').classList.remove('open'); }
function closeMobile(){ document.querySelector('.mobileNav').classList.remove('open'); }

function openForm(){ document.getElementById('modalOverlay').classList.add('open'); }
function closeForm(){ document.getElementById('modalOverlay').classList.remove('open'); }
function submitForm(e){
  e.preventDefault();
  const name=document.getElementById('ofName').value, phone=document.getElementById('ofPhone').value,
        email=document.getElementById('ofEmail').value, address=document.getElementById('ofAddress').value,
        city=document.getElementById('ofCity').value, pin=document.getElementById('ofPincode').value,
        notes=document.getElementById('ofNotes').value;
  const summary = orderSummary() || 'No items selected';
  const total = cartTotal();
  const waText = encodeURIComponent(`Namaste Dadi Ki Tijori! Order:\n\n${summary}\n\nTotal: ₹${total}\n\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\nCity: ${city}\nPincode: ${pin}\nNotes: ${notes}`);
  const emailBody = encodeURIComponent(`Order:\n\n${summary}\n\nTotal: ₹${total}\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nAddress: ${address}\nCity: ${city}\nPincode: ${pin}\nNotes: ${notes}`);
  document.getElementById('formArea').innerHTML = `
    <div style="text-align:center;padding:10px 0;">
      <h3 style="margin-bottom:14px;">Your Tijori order is ready! 🗝️</h3>
      <div class="orderOpts">
        <a class="btn waBtn" href="https://wa.me/919892514051?text=${waText}" target="_blank">Order on WhatsApp</a>
        <a class="btn emailBtn" href="mailto:dadikitijori@gmail.com?subject=${encodeURIComponent('New Order - Dadi Ki Tijori')}&body=${emailBody}">Send via Email</a>
      </div>
    </div>`;
  return false;
}

/* bingo */
const bingoWords = ['Pickle with dal-rice','Pickle with paratha','Asked for extra achar','Pickle in your tiffin','Mango pickle lover','Lemon pickle lover','Chilli pickle lover','Love spicy achar','Pickle with khichdi','"Thoda aur achar?"','Have a favourite pickle','FREE','Pickle with every meal','Cannot eat without pickle','Homemade achar > everything','Achar in my lunchbox','Pickle with parathe','Ate achar today','Shared pickle with a friend','Pickle > any sauce','Grew up on homemade achar','Pickle before pickle was cool','Kept a secret achar stash','Achar with khakra','Always double the achar'];
function renderBingo(){
  const grid = document.getElementById('bingoGrid');
  grid.innerHTML = bingoWords.map((w,i)=>{
    const isFree = w==='FREE';
    return `<div class="bCell${isFree?' free':''}" data-i="${i}" onclick="toggleBingo(this,${isFree})">${w}</div>`;
  }).join('');
  document.querySelectorAll('.bCell.free').forEach(c=>c.classList.add('marked'));
}
function toggleBingo(el,isFree){ if(isFree) return; el.classList.toggle('marked'); }

/* feedback stars + submit */
let ratingVal = 0;
document.getElementById('stars').addEventListener('click', e=>{
  if(e.target.dataset.v){
    ratingVal = parseInt(e.target.dataset.v);
    document.querySelectorAll('#stars span').forEach(s=>s.classList.toggle('on', parseInt(s.dataset.v)<=ratingVal));
  }
});
function submitFeedback(e){
  e.preventDefault();
  document.getElementById('fbWrap').innerHTML = `<div class="fbThanks"><h3 class="serif">Thank you for unlocking your feedback.</h3><p>We treasure every word. 🗝️</p></div>`;
  return false;
}

/* scroll reveal */
function observeReveals(){
  const els = document.querySelectorAll('.reveal:not(.in)');
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  },{threshold:.15});
  els.forEach(el=>io.observe(el));
}
const journeySteps = document.querySelectorAll('.journey .step');
const io2 = new IntersectionObserver(entries=>{
  entries.forEach((en,idx)=>{ if(en.isIntersecting){ setTimeout(()=>en.target.classList.add('in'), idx*150); io2.unobserve(en.target);} });
},{threshold:.4});
journeySteps.forEach(s=>io2.observe(s));

renderProducts();
renderCart();
renderBingo();
observeReveals();