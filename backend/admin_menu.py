import pymysql

# Database connection configuration
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "root",  # Type your database password here
    "database": "RestaurantAxioraLabs"
}

def add_menu_item(name, description, price, category, is_available=True, image_url=None):
    try:
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()

        # SQL to insert a new menu item
        insert_query = """
        INSERT INTO menu_items (name, description, price, category, is_available, image_url)
        VALUES (%s, %s, %s, %s, %s, %s);
        """
        cursor.execute(insert_query, (name, description, price, category, is_available, image_url))

        connection.commit()
        cursor.close()
        connection.close()
        print("Menu item added successfully.")
    except Exception as e:
        print(f"Error adding menu item: {e}")

def get_menu_items():
    try:
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()

        # SQL to fetch all menu items
        select_query = "SELECT * FROM menu_items;"
        cursor.execute(select_query)
        menu_items = cursor.fetchall()

        cursor.close()
        connection.close()
        return menu_items
    except Exception as e:
        print(f"Error fetching menu items: {e}")
        return []
