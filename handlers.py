from flask import request, redirect, send_from_directory, session, jsonify
from datetime import datetime
import pytz
from db import DatabaseManager
from werkzeug.utils import secure_filename
import os

class Handlers:
    def __init__(self, app):
        self.app = app
        self.db_manager = DatabaseManager(app)

    @staticmethod
    def check_non_session_value(keys):
        missing_keys = [key for key in keys if session.get(key) is None]
        if missing_keys:
            return f"Данные по ключам {', '.join(missing_keys)} отсутствуют в сессии"
        return None

    def index(self):
        return send_from_directory(self.app.static_folder, 'login.html')

    def login(self):
        password = str(request.form.get('password'))

        query = "SELECT * FROM users WHERE password = %s"
        user = self.db_manager.execute_query(query, (password,))

        if user:
            session['username'] = user[0][1]
            session['role'] = user[0][3]
            if session['role'] == 'admin':
                return jsonify({'message': 'Успешная авторизация!', 'redirect': '/admin_panel'})
            else:
                return jsonify({'message': 'Успешная авторизация!', 'redirect': '/select_product'})
        else:
            return jsonify({'message': 'Отказ доступа!'}), 401

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
        if 'username' in session:
            username = str(request.form.get('username'))
            password = str(request.form.get('password'))
            role = str(request.form.get('role'))

            query = "INSERT INTO users (username, password, role) VALUES (%s, %s, %s)"
            self.db_manager.execute_insert(query, (username, password, role))

            return "Пользователь успешно добавлен!"
        else:
            return redirect('/')

    def get_users(self):
        query = "SELECT * FROM users"
        users = self.db_manager.execute_query(query)

        return jsonify(users)

    # def update_user(self):
    #     if 'username' in session:
    #         username = str(request.form.get('username'))
    #         new_password = str(request.form.get('new_password'))
    #
    #         query = "UPDATE users SET password = %s WHERE username = %s"
    #         self.db_manager.execute_insert(query, (new_password, username))
    #
    #         return "Пароль успешно изменен!"
    #     else:
    #         return redirect('/')

    def update_user_password(self):
        if 'username' in session:
            username = request.json['username']
            new_password = request.json['newPassword']

            query = "UPDATE users SET password = %s WHERE username = %s"
            self.db_manager.execute_insert(query, (new_password, username))

            return jsonify({'message': 'Пароль успешно изменен!'})
        else:
            return redirect('/')

    def update_user_role(self):
        if 'username' in session:
            username = request.json['username']
            new_role = request.json['newRole']

            query = "UPDATE users SET role = %s WHERE username = %s"
            self.db_manager.execute_insert(query, (new_role, username))

            return jsonify({'message': 'Роль успешно изменена!'})
        else:
            return redirect('/')

    # def delete_user(self):
    #     if 'username' in session:
    #         username = str(request.form.get('username'))
    #
    #         query = "DELETE FROM users WHERE username = %s"
    #         self.db_manager.execute_delete(query, (username,))
    #
    #         return "Пользователь успешно удалён!"
    #     else:
    #         return redirect('/')

    def delete_user(self):
        if 'username' in session:
            username = request.json['username']

            query = "DELETE FROM users WHERE username = %s"
            self.db_manager.execute_delete(query, (username,))

            return jsonify({'message': 'Пользователь успешно удален!'})
        else:
            return redirect('/')


    def get_products(self):
        query = "SELECT * FROM products"
        products = self.db_manager.execute_query(query)

        return jsonify(products)

    def delete_product(self):
        if 'username' in session:
            product_name = request.json['product_name']

            query = "DELETE FROM products WHERE product_name = %s"
            self.db_manager.execute_delete(query, (product_name,))

            return jsonify({'message': 'Изделие успешно удалено!'})
        else:
            return redirect('/')

    def edit_product(self):
        if 'username' in session:
            return send_from_directory(self.app.static_folder, 'edit_product.html')
        else:
            return redirect('/')

    def add_product(self):
        if 'username'in session:
            product_name = str(request.form.get('product_name'))
            picture = request.files.get('picture')

            if picture:
                picture_name = secure_filename(picture.filename)
                picture_path = os.path.join(self.app.config['UPLOAD_FOLDER'], picture_name)
                picture.save(os.getcwd() + picture_path)
            else:
                picture_name = None

            query = "INSERT INTO products (product_name, picture_path) VALUES (%s, %s)"
            self.db_manager.execute_insert(query, (product_name, picture_name))

            return "Изделие успешно добавлено!"
        else:
            return redirect('/')

    def update_product_picture(self):
        if 'username'in session:
            product_name = str(request.form.get('productName'))
            new_picture = request.files.get('newPicture')

            if new_picture:
                picture_name = secure_filename(new_picture.filename)
                picture_path = os.path.join(self.app.config['UPLOAD_FOLDER'], picture_name)
                new_picture.save(os.getcwd() + picture_path)
            else:
                picture_name = None

            query = "UPDATE products SET picture_path = %s WHERE product_name = %s"
            self.db_manager.execute_insert(query, (picture_name, product_name))

            return "Изображение изделия успешно изменено!"
        else:
            return redirect('/')


    def select_product(self):
        if 'username' in session:
            return send_from_directory(self.app.static_folder, 'select_product.html')
        else:
            return redirect('/')

    def set_product_name(self):
        if 'username' in session:
            product_name = str(request.form.get('product_name'))
            picture_name = str(request.form.get('picture_name'))
            session['product_name'] = product_name
            session['picture_name'] = picture_name

            return send_from_directory(self.app.static_folder, 'select_order.html')
        else:
            return redirect('/')

    def select_order(self):
        if 'username' in session:
            return send_from_directory(self.app.static_folder, 'select_order.html')
        else:
            return redirect('/')

    def set_order_num(self):
        if 'username' in session:
            order_num = str(request.form.get('order_num'))
            session['order_num'] = order_num

            return send_from_directory(self.app.static_folder, 'productions.html')
        else:
            return redirect('/')

    def productions(self):
        if 'username' in session:
            return send_from_directory(self.app.static_folder, 'productions.html')
        else:
            return redirect('/')

    def productions_history(self):
        if 'username' in session:
            return send_from_directory(self.app.static_folder, 'productions_history.html')
        else:
            return redirect('/')

    def edit_productions(self):
        if 'username' in session:
            if session.get('role') == 'manager' or session.get('role') == 'admin':
                return send_from_directory(self.app.static_folder, 'edit_productions.html')
            else:
                return "Недостаточно прав для отображения контента!"
        else:
            return redirect('/')

    def get_productions(self):
        query = "SELECT * FROM productions"
        productions = self.db_manager.execute_query(query)

        return jsonify(productions)

    def add_production(self):
        if 'username' in session:
            datetime_value = datetime.now(pytz.timezone('Etc/GMT-3')).strftime('%Y-%m-%d %H:%M:%S')
            product_name = session.get('product_name')
            order_num = session.get('order_num')
            product_uid = str(request.form.get('product_uid'))
            username = session.get('username')
            production_status = 1

            query = "INSERT INTO productions (datetime, product_name, order_num, product_uid, username, production_status) VALUES (%s, %s, %s, %s, %s, %s)"
            self.db_manager.execute_insert(query, (datetime_value, product_name, order_num, product_uid, username, production_status))
            return "Запись успешно добавлена!"
        else:
            return redirect('/')

        #return "Запись успешно добавлена!"

    def update_production_time(self):
        if 'username' in session:
            production_uid = request.json['productionUid']
            new_datetime = request.json['newDatetime']

            query = "UPDATE productions SET datetime = %s WHERE product_uid = %s"
            self.db_manager.execute_insert(query, (new_datetime, production_uid))

            return jsonify({'message': 'Время успешно изменено!'})
        else:
            return redirect('/')

    def update_production_order(self):
        if 'username' in session:
            production_uid = request.json['productionUid']
            new_order_num = request.json['newOrder']

            query = "UPDATE productions SET order_num = %s WHERE product_uid = %s"
            self.db_manager.execute_insert(query, (new_order_num, production_uid))

            return jsonify({'message': 'Номер ШПЗ успешно изменен!'})
        else:
            return redirect('/')

    def update_production_user(self):
        if 'username' in session:
            production_uid = request.json['productionUid']
            new_username = request.json['newUser']

            query = "UPDATE productions SET username = %s WHERE product_uid = %s"
            self.db_manager.execute_insert(query, (new_username, production_uid))

            return jsonify({'message': 'Пользователь успешно изменен!'})
        else:
            return redirect('/')

    def delete_production(self):
        if 'username' in session:
            production_uid = request.json['productionUid']

            query = "DELETE FROM productions WHERE product_uid = %s"
            self.db_manager.execute_delete(query, (production_uid,))

            return jsonify({'message': 'Запись успешно удалена!'})
        else:
            return redirect('/')

    @staticmethod
    def get_select_product_info():
        if 'username' in session:
            return jsonify({
                'username': session.get('username'),
                'role': session.get('role'),
                'datetime_value': datetime.now(pytz.timezone('Etc/GMT-3')).strftime('%Y-%m-%d %H:%M:%S'),
            })
        else:
            return jsonify({'error': 'Not logged in'}), 401

    @staticmethod
    def get_select_order_info():
        if 'username' in session:
            return jsonify({
                'username': session.get('username'),
                'role': session.get('role'),
                'datetime_value': datetime.now(pytz.timezone('Etc/GMT-3')).strftime('%Y-%m-%d %H:%M:%S'),
                'product_name': session.get('product_name')
            })
        else:
            return jsonify({'error': 'Not logged in'}), 401

    @staticmethod
    def get_productions_info():
        if 'username' in session:
            return jsonify({
                'username': session.get('username'),
                'role': session.get('role'),
                'datetime_value': datetime.now(pytz.timezone('Etc/GMT-3')).strftime('%Y-%m-%d %H:%M:%S'),
                'product_name': session.get('product_name'),
                'picture_name': session.get('picture_name'),
                'order_num': session.get('order_num')
            })
        else:
            return jsonify({'error': 'Not logged in'}), 401

    @staticmethod
    def get_productions_history_info():
        if 'username' in session:
            return jsonify({
                'username': session.get('username'),
                'role': session.get('role'),
                'datetime_value': datetime.now(pytz.timezone('Etc/GMT-3')).strftime('%Y-%m-%d %H:%M:%S'),
            })
        else:
            return jsonify({'error': 'Not logged in'}), 401

    @staticmethod
    def get_edit_productions_info():
        if 'username' in session:
            return jsonify({
                'username': session.get('username'),
                'role': session.get('role'),
                'datetime_value': datetime.now(pytz.timezone('Etc/GMT-3')).strftime('%Y-%m-%d %H:%M:%S'),
            })
        else:
            return jsonify({'error': 'Not logged in'}), 401

    @staticmethod
    def get_time():
        if 'username' in session:
            return jsonify({
                'datetime_value': datetime.now(pytz.timezone('Etc/GMT-3')).strftime('%Y-%m-%d %H:%M:%S'),
            })
        else:
            return jsonify({'error': 'Not logged in'}), 401

    @staticmethod
    def logout():
        session.pop('username', None)
        session.pop('role', None)
        session.pop('product_name', None)
        session.pop('order_num', None)
        session.pop('picture_path', None)
        return redirect('/')
