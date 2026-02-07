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

