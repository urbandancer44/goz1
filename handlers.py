from flask import request, redirect, send_from_directory, session, jsonify
from datetime import datetime
import pytz
from db import DatabaseManager


class Handlers:
    def __init__(self, app):
        self.app = app
        self.db_manager = DatabaseManager(app)

    def index(self):
        return send_from_directory(self.app.static_folder, 'login.html')

    def login(self):
        password = request.form['password']

        query = "SELECT * FROM users WHERE password = %s"
        user = self.db_manager.execute_query(query, (password,))

        if user:
            session['username'] = user[0][1]
            session['role'] = user[0][3]
            if session['role'] == 'admin':
                return redirect('/admin_panel')
            else:
                return redirect('/select_product')
        else:
            return send_from_directory(self.app.static_folder, 'login_ng.html')

    def admin_panel(self):
        if 'username' in session:
            return send_from_directory(self.app.static_folder, 'admin_panel.html')
        else:
            return redirect('/')

    def edit_user(self):
        if 'username' in session:
            return send_from_directory(self.app.static_folder, 'edit_user.html')
        else:
            return redirect('/')

    def add_user(self):
        username = request.form['username']
        password = request.form['password']
        role = request.form['role']

        query = "INSERT INTO users (username, password, role) VALUES (%s, %s, %s)"
        self.db_manager.execute_insert(query, (username, password, role))

        return "Пользователь успешно добавлен! <a href='/edit_user'>Назад</a>"

    def get_users(self):
        query = "SELECT username, role FROM users"
        users = self.db_manager.execute_query(query)

        return jsonify(users)

    def get_product(self):
        try:
            query = "SELECT name, enable, picture FROM product"
            products = self.db_manager.execute_query(query)

            product_list = [{'name': product[0], 'enable': product[1], 'picture': product[2]} for product in products]

            return jsonify(product_list)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def delete_user(self):
        username = request.form['username']

        query = "DELETE FROM users WHERE username = %s"
        self.db_manager.execute_delete(query, (username,))

        return "Пользователь успешно удалён!"

    def delete_product(self):
        name = request.form['name']

        query = "DELETE FROM product WHERE name = %s"
        self.db_manager.execute_delete(query, (name,))

        return "Изделие успешно удалёно!"

    def edit_product(self):
        if 'username' in session:
            return send_from_directory(self.app.static_folder, 'edit_product.html')
        else:
            return redirect('/')

    def add_product(self):
        name = request.form['name']
        enable = request.form['enable']
        picture = request.form['picture']

        query = "INSERT INTO product (name, enable, picture) VALUES (%s, %s, %s)"
        self.db_manager.execute_insert(query, (name, enable, picture))

        return "Изделие успешно добавлено! <a href='/edit_product'>Назад</a>"

    def select_product(self):
        if 'username' in session:
            return send_from_directory(self.app.static_folder, 'select_product.html')
        else:
            return redirect('/')

    @staticmethod
    def get_select_product_info():
        if 'username' in session:
            return jsonify({
                'username': session['username'],
                'role': session['role'],
                'current_date': datetime.now(pytz.timezone('Etc/GMT-3')).strftime('%Y-%m-%d %H:%M:%S')
            })
        else:
            return jsonify({'error': 'Not logged in'}), 401

    @staticmethod
    def logout():
        session.pop('username', None)
        session.pop('role', None)
        return redirect('/')
