from flask import Flask, render_template, request, redirect, session, flash
from aws_app import *
import uuid
from datetime import datetime
import qrcode
import os
from boto3.dynamodb.conditions import Attr

app = Flask(__name__)
app.secret_key = "hotel_secret_key"
SNS_ARN = "YOUR_SNS_TOPIC_ARN_HERE"


# ================= HOME =================
@app.route('/')
def home():
    hotels = get_all_hotels()
    return render_template('home.html', hotels=hotels)


@app.route('/about')
def about():
    return render_template('about.html')


# ================= USER REGISTER =================
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']

        if get_user(username):
            flash("User already exists. Please login.")
            return redirect('/login/user')

        add_user({
            'username': username,
            'name': request.form['name'],
            'phone': request.form['phone'],
            'email': request.form['email'],
            'password': request.form['password'],
            'role': 'user'
        })

        flash("Registration successful. Please login.")
        return redirect('/login/user')

    return render_template('register.html')


# ================= HOTEL REGISTER =================
@app.route('/hotel_register', methods=['GET', 'POST'])
def hotel_register():
    if request.method == 'POST':
        username = request.form['username']

        # Check duplicate in users table
        if get_user(username):
            flash("Username already exists. Please login.")
            return redirect('/login/hotel')

        hotel_id = str(uuid.uuid4())

        hotels_table.put_item(
            Item={
                'hotel_id': hotel_id,
                'hotel_name': request.form['hotel_name'],
                'owner_name': request.form['owner_name'],
                'username': username,
                'password': request.form['password'],
                'role': 'hotel',
                'online': False,
                'rating': "0",
                'room_type': "Not Set",
                'price': 0
            }
        )

        flash("Hotel registered successfully. Please login.")
        return redirect('/login/hotel')

    return render_template('hotel_register.html')
@app.route('/login/<role>', methods=['GET', 'POST'])
def login(role):

    if role not in ['user', 'hotel', 'admin']:
        return redirect('/')

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = None

        # USER & ADMIN → users table
        if role in ['user', 'admin']:
            user = get_user(username)

        # HOTEL → hotels table
        if role == 'hotel':
            response = hotels_table.scan(
                FilterExpression=Attr('username').eq(username)
            )
            items = response.get('Items', [])
            if items:
                user = items[0]

        if not user or user['password'] != password or user['role'] != role:
            flash("Invalid credentials")
            return redirect(f'/login/{role}')

        session['user'] = user
        session['role'] = role

        if role == 'hotel':
            hotels_table.update_item(
                Key={'hotel_id': user['hotel_id']},
                UpdateExpression="SET #on = :o",
                ExpressionAttributeNames={'#on': 'online'},
                ExpressionAttributeValues={':o': True}
            )
            return redirect('/hotel_dashboard')

        if role == 'admin':
            return redirect('/admin_dashboard')

        return redirect('/user_dashboard')

    # ✅ GET request
    if role == 'user':
        return render_template('login.html')
    elif role == 'hotel':
        return render_template('hotel_login.html')
    elif role == 'admin':
        return render_template('admin_login.html')

# ================= LOGOUT =================
@app.route('/logout')
def logout():

    # If hotel logs out → set offline
    if 'role' in session and session['role'] == 'hotel':
        user = session['user']

        hotels_table.update_item(
            Key={'hotel_id': user['hotel_id']},
            UpdateExpression="SET #on = :o",
            ExpressionAttributeNames={
                "#on": "online"
            },
            ExpressionAttributeValues={
                ':o': False
            }
        )

    session.clear()
    return redirect('/')


# ================= DASHBOARDS =================
@app.route('/user_dashboard')
def user_dashboard():
    state = request.args.get("state")
    if 'role' not in session or session['role'] != 'user':
        return redirect('/')
    return render_template('dashboard_user.html')

@app.route('/admin_dashboard')
def admin_dashboard():
    if 'role' not in session or session['role'] != 'admin':
        return redirect('/')
    hotels = get_all_hotels()
    return render_template('dashboard_admin.html', hotels=hotels)


@app.route('/hotel_dashboard', methods=['GET', 'POST'])
def hotel_dashboard():
    if 'role' not in session or session['role'] != 'hotel':
        return redirect('/')

    if request.method == 'POST':
        hotel_id = request.form['hotel_id']
        price = request.form['price']
        room_type = request.form['room_type']
        rating = request.form['rating']

        hotels_table.update_item(
            Key={'hotel_id': hotel_id},
            UpdateExpression="SET price = :p, room_type = :r, rating = :ra",
            ExpressionAttributeValues={
                ':p': int(price),
                ':r': room_type,
                ':ra': rating
            }
        )

        flash("Hotel details updated successfully ✅")
        return redirect('/hotel_dashboard')

    return render_template('dashboard_hotel.html')


# ================= BOOKING =================
@app.route('/booking/<hotel_id>', methods=['GET', 'POST'])
def booking(hotel_id):
    hotel = request.args.get("hotel")

    if 'user' not in session or session['role'] != 'user':
        flash("Please login first to book a hotel.")
        return redirect('/login/user')

    hotel = get_hotel(hotel_id)

    if not hotel:
        return "Hotel not found"

    if request.method == 'POST':
        booking_id = str(uuid.uuid4())

        add_booking({
            'booking_id': booking_id,
            'username': session['user']['username'],
            'hotel_id': hotel_id,
            'hotel_name': hotel['hotel_name'],
            'owner_name': hotel['owner_name'],
            'hotel_price': hotel['price'],   # ✅ ACTUAL PRICE
            'checkin': request.form['checkin'],
            'checkout': request.form['checkout'],
            'room_type': request.form['room_type'],
            'time': str(datetime.now())
        })

        send_notification(SNS_ARN, f"Booking Confirmed! ID: {booking_id}")

        return redirect(f'/confirmation/{booking_id}')
    return render_template('booking.html', hotel=hotel)



# ================= CONFIRMATION + QR =================
@app.route('/confirmation/<booking_id>')
def confirmation(booking_id):

    response = bookings_table.get_item(
        Key={'booking_id': booking_id}
    )

    booking = response.get('Item')

    if not booking:
        return "Booking not found"

    qr_data = f"""
Booking ID: {booking_id}
User: {booking['username']}
Hotel ID: {booking['hotel_id']}
Check-in: {booking['checkin']}
Check-out: {booking['checkout']}
"""

    qr = qrcode.make(qr_data)

    qr_folder = "static/qr"
    os.makedirs(qr_folder, exist_ok=True)

    qr_path = f"{qr_folder}/{booking_id}.png"
    qr.save(qr_path)

    return render_template(
        'confirmation.html',
        booking=booking,
        booking_id=booking_id,
        qr_image=f"/static/qr/{booking_id}.png"
    )


if __name__ == '__main__':
    app.run(debug=True)
