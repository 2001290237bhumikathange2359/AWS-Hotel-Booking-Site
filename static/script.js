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
    {
      name: "Sea View Resort",
      price: "₹4,500",
      room: "Deluxe",
      img: "https://images.unsplash.com/photo-1566073771259-6a8506099945"
    },
    {
      name: "Palm Beach Hotel",
      price: "₹5,200",
      room: "Suite",
      img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa"
    },
    {
      name: "Ocean Pearl",
      price: "₹3,800",
      room: "Standard",
      img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
    },
    {
      name: "Golden Sands Stay",
      price: "₹4,900",
      room: "Deluxe",
      img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
    },
    {
      name: "Blue Lagoon Inn",
      price: "₹6,200",
      room: "Suite",
      img: "https://images.unsplash.com/photo-1501117716987-c8e1ecb2100a"
    }
  ],

  jaipur: [
    {
      name: "Royal Palace Hotel",
      price: "₹4,200",
      room: "Deluxe",
      img: "https://images.unsplash.com/photo-1600607686527-6fb886090705"
    },
    {
      name: "Pink City Inn",
      price: "₹3,600",
      room: "Standard",
      img: "https://images.unsplash.com/photo-1591088398332-8a7791972843"
    },
    {
      name: "Heritage Haveli",
      price: "₹5,000",
      room: "Suite",
      img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"
    },
    {
      name: "Amber Fort View",
      price: "₹4,800",
      room: "Deluxe",
      img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511"
    },
    {
      name: "Rajputana Residency",
      price: "₹3,900",
      room: "Standard",
      img: "https://images.unsplash.com/photo-1618773928121-c32242e63f39"
    }
  ],

  manali: [
    {
      name: "Snow Peak Resort",
      price: "₹4,700",
      room: "Suite",
      img: "https://images.unsplash.com/photo-1545158535-c3f7168c28b6"
    },
    {
      name: "Himalayan View Stay",
      price: "₹3,800",
      room: "Deluxe",
      img: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd"
    },
    {
      name: "Mountain Breeze Inn",
      price: "₹3,200",
      room: "Standard",
      img: "https://images.unsplash.com/photo-1505691723518-36a5ac3b2f48"
    }
  ],

  mumbai: [
    {
      name: "Marine Drive Hotel",
      price: "₹6,500",
      room: "Suite",
      img: "https://images.unsplash.com/photo-1590490360182-c33d57733427"
    },
    {
      name: "City Lights Residency",
      price: "₹5,200",
      room: "Deluxe",
      img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb"
    }
  ]
};



// repeat hotels to make 9 cards
const grid = document.getElementById("hotelGrid");

hotels[selectedState].forEach(hotel => {
  grid.innerHTML += `
    <div class="hotel-card">
      <img src="${hotel.img}">
      <div class="info">
        <h3>${hotel.name}</h3>
        <p>Room Type: ${hotel.room}</p>
        <p class="price">${hotel.price} / night</p>
        <button class="book-btn" onclick="bookHotels('${hotel.name}')">
          Book Now
        </button>
      </div>
    </div>
  `;
});

function bookHotels(name) {
  window.location.href = `/booking?hotel=${name}`;
}


function book(name) {
  window.location.href = `/booking?hotel=${name}`;
}

