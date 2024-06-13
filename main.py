from flask import Flask, render_template, jsonify, request
import ibm_db

app = Flask(__name__)


dsn_hostname = "your_host"
dsn_uid = "your_username"
dsn_pwd = "your_password"
dsn_driver = "{IBM DB2 ODBC DRIVER}"
dsn_database = "your_db_name"
dsn_port = "your_port"
dsn_protocol = "TCPIP"

dsn = (
    f"DRIVER={dsn_driver};"
    f"DATABASE={dsn_database};"
    f"HOSTNAME={dsn_hostname};"
    f"PORT={dsn_port};"
    f"PROTOCOL={dsn_protocol};"
    f"UID={dsn_uid};"
    f"PWD={dsn_pwd};"
)


try:
    conn = ibm_db.connect(dsn, "", "")
    print("Connected to database")
except:
    print("Unable to connect to the database")


@app.route('/')
def index():
    return render_template('admin_page_test.html')


@app.route('/requests', methods=['GET'])
def get_requests():
    sql = "SELECT * FROM requests"
    stmt = ibm_db.exec_immediate(conn, sql)
    requests = []
    row = ibm_db.fetch_assoc(stmt)
    while row:
        requests.append(row)
        row = ibm_db.fetch_assoc(stmt)
    return jsonify(requests)


@app.route('/requests', methods=['POST'])
def create_request():
    new_request = request.json
    sql = f"INSERT INTO requests (id, status, description, activity) VALUES ('{new_request['id']}', '{new_request['status']}', '{new_request['description']}', '{new_request['activity']}')"
    ibm_db.exec_immediate(conn, sql)
    return jsonify(new_request), 201


if __name__ == '__main__':
    app.run(debug=True)
