from flask import Flask, jsonify, request
import pymysql
from admin_menu import add_menu_item, get_menu_items

app = Flask(__name__)

# Database connection configuration
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "root" # Type your database password here   
}

def initialize_database():
    try:
        # Connect to MySQL server (not specific database yet)
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()

        # Read and execute SQL script
        with open('database.sql', 'r') as sql_file:
            sql_script = sql_file.read()
            for statement in sql_script.split(';'):
                if statement.strip():
                    cursor.execute(statement)

        connection.commit()
        cursor.close()
        connection.close()
        print("Database initialized successfully.")

    except Exception as e:
        print(f"Error initializing database: {e}")

# Initialize the database when the app starts
initialize_database()

@app.route("/")
def home():
    return "Welcome to Restaurant Axiora Labs!"

@app.route("/menu", methods=["GET"])
def view_menu():
    menu = get_menu_items()
    return jsonify(menu)

@app.route("/menu", methods=["POST"])
def add_menu():
    data = request.json
    name = data.get("name")
    description = data.get("description")
    price = data.get("price")
    category = data.get("category")
    is_available = data.get("is_available", True)
    image_url = data.get("image_url", None)

    if not all([name, price, category]):
        return jsonify({"error": "Name, price, and category are required fields."}), 400

    add_menu_item(name, description, price, category, is_available, image_url)
    return jsonify({"message": "Menu item added successfully."})

if __name__ == "__main__":
    app.run(debug=True)
    
