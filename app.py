from flask import Flask, request, redirect, send_from_directory, session, jsonify, url_for, render_template
import psycopg2, pytz
from datetime import datetime

app = Flask(__name__, static_folder='static')
app.secret_key = 'your_secret_key'  # Для использования сессий

# Конфигурация подключения к PostgreSQL
db_host = 'postgres'
db_name = 'gozDB'
db_user = 'goz_admin'
db_pass = 'zzz1234ZZZ'

def get_db_connection():
    return psycopg2.connect(
        host=db_host,
        database=db_name,
        user=db_user,
        password=db_pass
    )

# Экран: авторизация
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'login.html')

# Действие: авторизация
@app.route('/login', methods=['POST'])
def login():
    password = request.form['password']

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE password = %s", (password,))
    user = cur.fetchone()
    cur.close()
    conn.close()

    if user:
        session['username'] = user[1]  # Индекс 1 соответствует полю username
        session['role'] = user[3]  # Индекс 3 соответствует полю role
        if session['role'] == 'admin':
            return redirect('/admin_panel')
        else:
            return redirect('/select_product')
    else:
        return send_from_directory(app.static_folder, 'login_ng.html')
#        return "Введены неверные данные. <a href='/'>Назад</a>"

# Экран: панель администратора
@app.route('/admin_panel')
def admin_panel():
    if 'username' in session:
        return send_from_directory(app.static_folder, 'admin_panel.html')
    else:
        return redirect('/')

# Экран: редактор пользователей
@app.route('/edit_user')
def edit_user():
    if 'username' in session:
        return send_from_directory(app.static_folder, 'edit_user.html')
    else:
        return redirect('/')

# Действие: добавление пользователя в таблицу 'users'
@app.route('/add_user', methods=['POST'])
def add_user():
#    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        role = request.form['role']

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("INSERT INTO users (username, password, role) VALUES (%s, %s, %s)", (username, password, role))
        conn.commit()
        cur.close()
        conn.close()

        return "Пользователь успешно добавлен! <a href='/edit_user'>Назад</a>"

#    return send_from_directory(app.static_folder, 'edit_user.html')

# Действие: вывод данных из таблицы 'users' в JSON
@app.route('/get_users')
def get_users():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT username, role FROM users")
    users = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify(users)

# Действие: вывод данных из таблицы 'users' в JSON
@app.route('/get_product')
def get_product():
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT name, enable, picture FROM product")
            product = cur.fetchall()

        # Преобразуем результат в список словарей
        product_list = [{'name': product[0], 'enable': product[1], 'picture': product[2]} for product in product]

        return jsonify(product_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

# Действие: удаление пользователя из таблицы 'users'
@app.route('/delete_user', methods=['POST'])
def delete_user():
    username = request.form['username']

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM users WHERE username = %s", (username,))
    conn.commit()
    cur.close()
    conn.close()

    return "Пользователь успешно удалён!"

# Действие: удаление изделия из таблицы 'product'
@app.route('/delete_product', methods=['POST'])
def delete_product():
    name = request.form['name']

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM product WHERE name = %s", (name,))
    conn.commit()
    cur.close()
    conn.close()

    return "Изделие успешно удалёно!"


# Экран: редактор изделий
@app.route('/edit_product')
def edit_product():
    if 'username' in session:
        return send_from_directory(app.static_folder, 'edit_product.html')
    else:
        return redirect('/')

# Действие: добавление изделия в таблицу 'product'
@app.route('/add_product', methods=['POST'])
def add_product():
#    if request.method == 'POST':
        name = request.form['name']
        enable = request.form['enable']
        picture = request.form['picture']

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("INSERT INTO product (name, enable, picture) VALUES (%s, %s, %s)", (name, enable, picture))
        conn.commit()
        cur.close()
        conn.close()

        return "Изделие успешно добавлено! <a href='/edit_product'>Назад</a>"

# Экран: выбор изделия
@app.route('/select_product')
def select_product():
    if 'username' in session:
        return send_from_directory(app.static_folder, 'select_product.html')
    else:
        return redirect('/')



# Действие: вывод данных для экрана выбора изделия
@app.route('/get_select_product_info')
def get_select_product_info():
    if 'username' in session:
        return jsonify({
            'username': session['username'],
            'role': session['role'],
            'current_date': datetime.now(pytz.timezone('Etc/GMT-3')).strftime('%Y-%m-%d %H:%M:%S') # %H:%M:%S
        })
    else:
        return jsonify({'error': 'Not logged in'}), 401



# Действие: выход из сессии
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    session.pop('role', None)
    return redirect('/')

if __name__ == '__main__':
    app.run(host='0.0.0.0')