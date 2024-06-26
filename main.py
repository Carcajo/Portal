from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
import pyodbc
import os

load_dotenv()

app = Flask(__name__)

connection = pyodbc.connect(driver=os.getenv("DRIVER"),
                            server=os.getenv("SERVER"),
                            uid=os.getenv("UID"),
                            pwd=os.getenv("PWD"))


def check_table_existence():
    cursor = connection.cursor()
    tables = cursor.tables(table='requests', tableType='TABLE').fetchall()
    cursor.close()
    return len(tables) > 0


def create_table_if_not_exists():
    if not check_table_existence():
        cursor = connection.cursor()
        cursor.execute('''CREATE TABLE requests (
                            id VARCHAR(255) PRIMARY KEY,
                            status VARCHAR(255),
                            description VARCHAR(255),
                            activity VARCHAR(255))''')
        cursor.close()
        connection.commit()


def parse_user_info(data):
    user_data = data[0]

    status = user_data[0].strip()
    role = user_data[1].strip()

    user_info = {
        "status": status,
        "role": role
    }

    return user_info
  
def authenticate_user(username, password):
    cursor = connection.cursor()
    query = "SELECT role, status FROM users WHERE username = ? AND password = ?"
    cursor.execute(query, (username, password))
    user = cursor.fetchall()
    cursor.close()

    if user:
        user_info = parse_user_info(user)
        return user_info  
    return None

@app.route('/')
def index():
    return render_template('templates/autorization_test.html')


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'status': 'error', 'message': 'Missing username or password'}), 400

    user_info = authenticate_user(username, password)

    if user_info:
        if user_info['status'] == 'active':
            if username == 'user' and password == 'password' and user_info['role'] == 'USER':
                return jsonify({'status': 'success', 'role': 'user'})
            elif username == 'admin' and password == 'password' and user_info['role'] == 'ADMIN':
                return jsonify({'status': 'success', 'role': 'admin'})
            else:
                return jsonify({'status': 'error', 'message': 'Invalid credentials'}), 401
        else:
            return jsonify({'status': 'error', 'message': 'User is blocked'}), 401
    else:
        return jsonify({'status': 'error', 'message': 'Invalid credentials'}), 401

@app.route('/queries', methods=['GET'])
def get_queries():
    conn = connection
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM requests')
    rows = cursor.fetchall()

    requests = []
    for row in rows:
        requests.append({
            'id': row.id,
            'status': row.status,
            'description': row.description,
            'activity': row.activity
        })

    cursor.close()
    conn.close()

    return jsonify(requests)


@app.route('/create_request', methods=['POST'])
def create_request():
    data = request.get_json()
    new_request = (
        data['id'],
        data['status'],
        data['description'],
        data['activity']
    )

    conn = connection
    cursor = conn.cursor()
    cursor.execute('INSERT INTO requests (id, status, description, activity) VALUES (?, ?, ?, ?)', new_request)
    cursor.close()
    conn.close()

    return jsonify(data), 201


@app.route('/update_query_status', methods=['POST'])
def update_query_status():
    data = request.get_json()
    request_id = data['id']
    new_status = data['status']

    conn = connection
    cursor = conn.cursor()
    cursor.execute('UPDATE requests SET status = ? WHERE id = ?', new_status, request_id)
    cursor.close()
    conn.close()

    return '', 204


if __name__ == '__main__':
    app.run(debug=True)





