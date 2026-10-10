// YAHAN IMAGES FOLDER KA USE HO RAHA HAI
// images/ folder me ye files rakhna: apple.jpg, banana.jpg, tomato.jpg, potato.jpg, tshirt.jpg, jeans.jpg, earbuds.jpg, watch.jpg, nike.jpg, sneakers.jpg, banner.jpg
const productsData = [
{id:1,name:"Apple Shimla 1kg",price:149,cat:"Fruits",img:"images/apple.jpg"},
{id:2,name:"Banana Robusta Dozen",price:60,cat:"Fruits",img:"images/banana.jpg"},
{id:3,name:"Tomato Local 1kg",price:35,cat:"Vegetables",img:"images/tomato.jpg"},
{id:4,name:"Potato 1kg",price:32,cat:"Vegetables",img:"images/potato.jpg"},
{id:5,name:"Men Regular T-Shirt",price:399,cat:"Cloth",img:"images/tshirt.jpg"},
{id:6,name:"Men Slim Jeans",price:999,cat:"Cloth",img:"images/jeans.jpg"},
{id:7,name:"Wireless Earbuds",price:1299,cat:"Electronics",img:"images/earbuds.jpg"},
{id:8,name:"Smart Watch Series 8",price:1999,cat:"Electronics",img:"images/watch.jpg"},
{id:9,name:"Nike Air Shoes",price:2999,cat:"Shoes",img:"images/nike.jpg"},
{id:10,name:"Sneakers White",price:1999,cat:"Shoes",img:"images/sneakers.jpg"},
];

let cart=JSON.parse(localStorage.getItem("cart")||"[]");
let user=JSON.parse(localStorage.getItem("user")||"null");
let orders=JSON.parse(localStorage.getItem("orders")||"[]");
const pDiv=document.getElementById("products");
const cartDrawer=document.getElementById("cartDrawer"), loginModal=document.getElementById("loginModal"), signupModal=document.getElementById("signupModal"), orderModal=document.getElementById("orderModal"), myOrdersModal=document.getElementById("myOrdersModal");

function render(list){
 pDiv.innerHTML="";
 list.forEach(p=> pDiv.innerHTML+=`<div class="card"><img src="${p.img}" onerror="this.src='https://via.placeholder.com/300x300?text=${encodeURIComponent(p.name)}'"><h4>${p.name}</h4><p class="price">₹${p.price}</p><button class="add" onclick="addCart(${p.id})">ADD</button></div>`);
}
function addCart(id){
 let f=cart.find(c=>c.id===id);
 if(f) f.qty++; else cart.push({...productsData.find(p=>p.id===id),qty:1});
 updateCart(); cartDrawer.classList.add("open");
}
function updateCart(){
 localStorage.setItem("cart",JSON.stringify(cart));
 let total=0,count=0,html="";
 cart.forEach(i=>{total+=i.price*i.qty;count+=i.qty; html+=`<div class="c-item"><span>${i.name} x ${i.qty}</span><b>₹${i.price*i.qty}</b></div>`});
 document.getElementById("cartCount").innerText=count;
 document.getElementById("cartTotal").innerText=total;
 document.getElementById("payTotal").innerText=total;
 document.getElementById("cartItems").innerHTML= html || "<p style='text-align:center;margin-top:30px;color:#999'>Your cart is empty<br>Add items to checkout</p>";
}
function renderOrders(){
 let listDiv=document.getElementById("ordersList");
 if(orders.length===0){ listDiv.innerHTML="<p style='text-align:center;color:#999'>No orders yet. Place your first order!</p>"; return;}
 listDiv.innerHTML="";
 orders.slice().reverse().forEach(o=>{
  let statusClass = o.status==="Cancelled"? "status-cancelled" : "status-placed";
  listDiv.innerHTML+=`<div class="order-card"><div style="display:flex;justify-content:space-between"><h4>Order #${o.id.toString().slice(-6)}</h4><small style="color:#999">${o.date||''}</small></div><span class="order-status ${statusClass}">${o.status}</span><p style="font-size:13px;margin:6px 0;color:#444">${o.items.map(i=>i.name+" x "+i.qty).join(", ")}</p><p style="font-size:13px"><b>₹${o.total}</b> • ${o.payment}</p><p style="font-size:12px;color:#666">${o.address}</p>${o.status!=="Cancelled"? `<button class="cancel-btn" onclick="cancelOrder(${o.id})">Cancel Order</button>` : ""}</div>`;
 });
}
window.cancelOrder=(id)=>{
 if(!confirm("Are you sure you want to cancel this order?")) return;
 let ord=orders.find(o=>o.id===id);
 if(ord){ ord.status="Cancelled"; localStorage.setItem("orders",JSON.stringify(orders)); renderOrders();}
};

document.getElementById("cartBtn").onclick=()=>cartDrawer.classList.add("open");
document.getElementById("closeCart").onclick=()=>cartDrawer.classList.remove("open");
document.getElementById("searchInput").oninput=(e)=>{
 let q=e.target.value.toLowerCase();
 render(productsData.filter(p=>p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)));
};
document.querySelectorAll(".cat").forEach(b=>{
 b.onclick=()=>{
  document.querySelectorAll(".cat").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  if(b.dataset.cat==="all") render(productsData);
  else render(productsData.filter(p=>p.cat===b.dataset.cat));
 };
});
document.getElementById("loginBtn").onclick=()=>{
 if(user){ if(confirm(`Logged in as ${user.name}\nLogout?`)){ localStorage.removeItem("user"); location.reload(); } return; }
 loginModal.classList.add("open");
};
document.getElementById("closeLogin").onclick=()=>loginModal.classList.remove("open");
document.getElementById("closeSignup").onclick=()=>signupModal.classList.remove("open");
document.getElementById("goSignup").onclick=()=>{loginModal.classList.remove("open"); signupModal.classList.add("open");};
document.getElementById("goLogin").onclick=()=>{signupModal.classList.remove("open"); loginModal.classList.add("open");};
document.getElementById("doLogin").onclick=()=>{
 let email=document.getElementById("loginEmail").value;
 let saved=JSON.parse(localStorage.getItem("user"));
 if(saved && saved.email===email){ user=saved; loginModal.classList.remove("open"); document.getElementById("loginText").innerText=saved.name.split(" ")[0]; alert("Login Success");}
 else alert("User not found! Please Sign Up first");
};
document.getElementById("doSignup").onclick=()=>{
 let name=document.getElementById("signupName").value, email=document.getElementById("signupEmail").value, pass=document.getElementById("signupPass").value;
 if(!name||!email||!pass) return alert("Fill all fields");
 localStorage.setItem("user",JSON.stringify({name,email,pass})); alert("Account created! Now Login"); signupModal.classList.remove("open"); loginModal.classList.add("open");
};
document.getElementById("orderBtn").onclick=()=>{
 if(cart.length===0) return alert("Cart empty!");
 if(!user) return alert("Please Login first!"), loginModal.classList.add("open");
 orderModal.classList.add("open");
};
document.getElementById("closeOrder").onclick=()=>orderModal.classList.remove("open");
document.getElementById("myOrdersBtn").onclick=()=>{ if(!user) return alert("Please Login to see orders"), loginModal.classList.add("open"); renderOrders(); myOrdersModal.classList.add("open"); };
document.getElementById("closeMyOrders").onclick=()=>myOrdersModal.classList.remove("open");
document.getElementById("payBtn").onclick=()=>{
 let addr=document.getElementById("address").value;
 if(!addr) return alert("Enter address");
 let mode=document.querySelector('input[name="pay"]:checked').value;
 let newOrder={id:Date.now(), items:[...cart], total:document.getElementById("payTotal").innerText, address:addr, payment:mode, status:"Placed", date:new Date().toLocaleString()};
 orders.push(newOrder);
 localStorage.setItem("orders",JSON.stringify(orders));
 alert(`Order Placed Successfully!\nID: ${newOrder.id}`);
 cart=[]; updateCart(); orderModal.classList.remove("open"); cartDrawer.classList.remove("open");
};
render(productsData); updateCart();
if(user) document.getElementById("loginText").innerText=user.name.split(" ")[0];
