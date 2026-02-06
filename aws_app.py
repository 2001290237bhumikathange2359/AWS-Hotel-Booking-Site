import boto3

dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
sns = boto3.client("sns", region_name="us-east-1")

users_table = dynamodb.Table("Users")
hotels_table = dynamodb.Table("Hotels")
bookings_table = dynamodb.Table("Bookings")


def add_user(user):
    users_table.put_item(Item=user)


def get_user(username):
    response = users_table.get_item(
        Key={"username": username}
    )
    return response.get("Item")


def get_hotel(hotel_id):
    response = hotels_table.get_item(
        Key={"hotel_id": hotel_id}
    )
    return response.get("Item")


# ✅ GET ALL HOTELS
def get_all_hotels():
    response = hotels_table.scan()
    return response.get("Items", [])


def add_booking(booking):
    bookings_table.put_item(Item=booking)


def send_notification(arn, message):
    if arn != "YOUR_SNS_TOPIC_ARN_HERE":
        sns.publish(TargetArn=arn, Message=message)
