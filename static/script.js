function goHome(){ window.location.href='/' }
function goLogin(){ window.location.href='/login' }
function goRegister(){ window.location.href='/register'; }
function goHotelRegister(){ window.location.href='/hotel_register'; }
function goDashboard(){ window.location.href='/user_dashboard' }
function logout(){ window.location.href='/logout' }
function goHome(){
    window.location.href = "/";
}

function goUserLogin(){
    window.location.href = "/login";
}

function goAdminLogin(){
    window.location.href = "/admin_login";
}

function goHotelLogin(){
    window.location.href = "/hotel_login";
}


function bookHotel(hotelId){
    document.getElementById("bookingForm"+hotelId).submit();
}

function filterHotels(){
    let rating=document.getElementById('ratingFilter').value;
    let price=document.getElementById('priceFilter').value;
    let room=document.getElementById('roomFilter').value;
    window.location.href=`/?rating=${rating}&price=${price}&room=${room}`;
}
// Booking submit
function submitBooking(hotelId){
    document.getElementById("bookingForm"+hotelId).submit();
}

// Hotel update submit
function updateHotelProfile(){
    document.getElementById("hotelUpdateForm").submit();
}
//State hotel selection
function go(state){
  alert("Clicked: " + state);
  window.location.href = "/dashboard?state=" + state;
}

// state selection
const selectedState = "{{ state }}";

const hotels = {
  goa: [
    {name:"Sea View Resort", price:"₹4,500", room:"Deluxe",
     img:"https://images.unsplash.com/photo-1566073771259-6a8506099945"},
    {name:"Palm Beach Hotel", price:"₹5,200", room:"Suite",
     img:"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa"},
    {name:"Ocean Pearl", price:"₹3,800", room:"Standard",
     img:"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"},
  ],
  jaipur: [
    {name:"Royal Palace", price:"₹4,200", room:"Deluxe",
     img:"https://images.unsplash.com/photo-1600607686527-6fb886090705"},
    {name:"Pink City Inn", price:"₹3,900", room:"Standard",
     img:"https://images.unsplash.com/photo-1591088398332-8a7791972843"},
  ],
  manali: [
    {name:"Snow Peak Stay", price:"₹4,800", room:"Suite",
     img:"https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"},
  ],
  mumbai: [
    {name:"Marine Drive Hotel", price:"₹6,500", room:"Suite",
     img:"https://images.unsplash.com/photo-1590490360182-c33d57733427"},
  ]
};

// repeat hotels to make 9 cards
const data = hotels[selectedState];
const grid = document.getElementById("hotelGrid");

for (let i = 0; i < 9; i++) {
  const h = data[i % data.length];
  grid.innerHTML += `
    <div class="hotel-card" onclick="book('${h.name}')">
      <img src="${h.img}">
      <div class="info">
        <h3>${h.name}</h3>
        <p>Room: ${h.room}</p>
        <p class="price">${h.price} / night</p>
      </div>
    </div>
  `;
}

function book(name) {
  window.location.href = `/booking?hotel=${name}`;
}

