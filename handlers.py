from flask import request, redirect, send_from_directory, session, jsonify
from datetime import datetime
import pytz
from db import DatabaseManager
import os
import uuid
import hashlib

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
        hashed_password = hashlib.md5(password.encode()).hexdigest()
        current_workplace_id = request.cookies.get('workplace_id')

        query = "SELECT * FROM users WHERE password = %s"
        try:
            user = self.db_manager.execute_query(query, (hashed_password,))
            if user:
                session['username'] = user[0]['username']
                session['role'] = user[0]['role']
                if session['role'] == 'admin':
                    return jsonify({'message': 'Успешная авторизация!', 'redirect': '/admin_panel'})
                elif session['role'] == 'otk':
                    return jsonify({'message': 'Успешная авторизация!', 'redirect': '/quality_control'})
                elif current_workplace_id == '5':
                    return jsonify({'message': 'Успешная авторизация!', 'redirect': '/select_product'})
                elif current_workplace_id == '6':
                    return jsonify({'message': 'Успешная авторизация!', 'redirect': '/flying_test'})
                elif current_workplace_id == '7':
                    return jsonify({'message': 'Успешная авторизация!', 'redirect': '/package_control'})
                else:
                    return jsonify({'message': 'Рабочее место не задано, обратитесь к администратору!'})
            else:
                return jsonify({'message': 'Отказ доступа!'}), 401
        except Exception as e:
            return jsonify({'error': str(e)}), 500

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
            hashed_password = hashlib.md5(password.encode('utf-8')).hexdigest()

            query = "INSERT INTO users (username, password, role) VALUES (%s, %s, %s)"
            try:
                self.db_manager.execute_insert(query, (username, hashed_password, role))
                return "Пользователь успешно добавлен!"
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        else:
            return redirect('/')

    def get_users(self):
        query = "SELECT * FROM users"
        try:
            users = self.db_manager.execute_query(query)
            return jsonify(users)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def update_user_password(self):
        if 'username' in session:
            username = request.json['username']
            new_password = request.json['newPassword']
            new_hashed_password = hashlib.md5(new_password.encode('utf-8')).hexdigest()

            query = "UPDATE users SET password = %s WHERE username = %s"
            try:
                self.db_manager.execute_update(query, (new_hashed_password, username))
                return jsonify({'message': 'Пароль успешно изменён!'})
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        else:
            return redirect('/')

    def update_user_role(self):
        if 'username' in session:
            username = request.json['username']
            new_role = request.json['newRole']

            query = "UPDATE users SET role = %s WHERE username = %s"
            try:
                self.db_manager.execute_update(query, (new_role, username))
                return jsonify({'message': 'Роль успешно изменена!'})
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        else:
            return redirect('/')

    def delete_user(self):
        if 'username' in session:
            username = request.json['username']

            query = "DELETE FROM users WHERE username = %s"
            try:
                self.db_manager.execute_delete(query, (username,))
                return jsonify({'message': 'Пользователь успешно удален!'})
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        else:
            return redirect('/')

    def get_products(self):
        query = "SELECT * FROM products"
        try:
            products = self.db_manager.execute_query(query)
            return jsonify(products)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def edit_product(self):
        if 'username' in session:
            return send_from_directory(self.app.static_folder, 'edit_product.html')
        else:
            return redirect('/')

    def delete_product(self):
        if 'username' not in session:
            return redirect('/')

        product_name = request.json['productName']
        delete_picture_name = request.json['deletePictureName']

        # Удаление из базы данных
        query = "DELETE FROM products WHERE product_name = %s"
        try:
            self.db_manager.execute_delete(query, (product_name,))

            # Удаление файла изображения, если указано имя файла
            if delete_picture_name and delete_picture_name != 'None':
                try:
                    # Используем путь из конфига приложения
                    img_path = os.path.join(self.app.config['UPLOAD_FOLDER'], delete_picture_name)

                    if os.path.exists(img_path):
                        os.remove(img_path)
                        return jsonify({
                            'message': 'Изделие и изображение успешно удалены!',
                            'deleted_file': True,
                            'file_path': img_path  # Для отладки
                        })
                    return jsonify({
                        'message': 'Изделие удалено, но файл изображения не найден',
                        'deleted_file': False,
                        'file_path': img_path  # Для отладки
                    })
                except Exception as e:
                    return jsonify({
                        'message': f'Изделие удалено, но ошибка при удалении файла: {str(e)}',
                        'deleted_file': False,
                        'error': str(e),
                        'file_path': img_path  # Для отладки
                    }), 500

            return jsonify({
                'message': 'Изделие успешно удалено!',
                'deleted_file': False
            })

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def add_product(self):
        if 'username' in session:
            product_name = str(request.form.get('product_name'))
            picture = request.files.get('picture')

            if picture:
                unique_id = uuid.uuid4().hex
                short_hash = hashlib.sha256(unique_id.encode('utf-8')).hexdigest()[:6]
                picture_name = f"{short_hash}_{picture.filename}"
                picture_path = os.path.join(self.app.config['UPLOAD_FOLDER'], picture_name)
                picture.save(picture_path)
            else:
                picture_name = None

            query = "INSERT INTO products (product_name, picture_path) VALUES (%s, %s)"
            try:
                self.db_manager.execute_insert(query, (product_name, picture_name))
                return "Изделие успешно добавлено!"
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        else:
            return redirect('/')

    def get_picture_name(self):
        if 'username' in session:
            product_name = request.json.get('product_name')
            query = "SELECT picture_path FROM products WHERE product_name = %s"
            try:
                result = self.db_manager.execute_query(query, (product_name,))
                if result:
                    return jsonify({'picture_name': result[0]['picture_path']})
                else:
                    return jsonify({'picture_name': None})
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        else:
            return redirect('/')

    def update_product_picture(self):
        if 'username' in session:
            product_name = str(request.form.get('productName'))
            new_picture = request.files.get('newPicture')

            if new_picture:
                unique_id = uuid.uuid4().hex
                short_hash = hashlib.sha256(unique_id.encode('utf-8')).hexdigest()[:6]
                picture_name = f"{short_hash}_{new_picture.filename}"
                picture_path = os.path.join(self.app.config['UPLOAD_FOLDER'], picture_name)
                new_picture.save(picture_path)
            else:
                picture_name = None

            query = "UPDATE products SET picture_path = %s WHERE product_name = %s"
            try:
                self.db_manager.execute_update(query, (picture_name, product_name))
                return "Изображение изделия успешно изменено!"
            except Exception as e:
                return jsonify({'error': str(e)}), 500
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

    def edit_workplace(self):
        if 'username' in session:
            return send_from_directory(self.app.static_folder, 'edit_workplace.html')
        else:
            return redirect('/')

    def get_workplaces(self):
        query = "SELECT * FROM workplaces"
        try:
            workplaces = self.db_manager.execute_query(query)
            return jsonify(workplaces)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def get_workplace_name(self):
        if 'username' in session:
            workplace_id = request.json.get('workplaceID')
            query = "SELECT workplace_name FROM workplaces WHERE workplace_id = %s"
            try:
                result = self.db_manager.execute_query(query, (workplace_id,))
                if result:
                    return jsonify({'workplaceName': result[0]['workplace_name']})
                else:
                    return jsonify({'workplaceName': None})
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        else:
            return redirect('/')

    def add_workplace(self):
        if 'username' in session:
            workplace_name = str(request.form.get('workplaceName'))
            workplace_id = str(request.form.get('workplaceID'))

            query = "INSERT INTO workplaces (workplace_name, workplace_id) VALUES (%s, %s)"
            try:
                self.db_manager.execute_insert(query, (workplace_name, workplace_id))
                return "Рабочее место успешно добавлено!"
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        else:
            return redirect('/')

    def update_workplace_name(self):
        if 'username' in session:
            workplace_id = request.json['workplaceID']
            new_workplace_name = request.json['newWorkplaceName']

            query = "UPDATE workplaces SET workplace_name = %s WHERE workplace_id = %s"
            try:
                self.db_manager.execute_update(query, (new_workplace_name, workplace_id))
                return jsonify({'message': 'Имя успешно изменено!'})
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        else:
            return redirect('/')

    def delete_workplace(self):
        if 'username' in session:
            workplace_id = request.json['workplaceID']

            query = "DELETE FROM workplaces WHERE workplace_id = %s"
            try:
                self.db_manager.execute_delete(query, (workplace_id,))
                return jsonify({'message': 'Рабочее место успешно удалено!'})
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        else:
            return redirect('/')

    def quality_control(self):
        if 'username' in session:
            return send_from_directory(self.app.static_folder, 'quality_control.html')
        else:
            return redirect('/')

    def select_product(self):
        if 'username' in session:
            return send_from_directory(self.app.static_folder, 'select_product.html')
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
            if session.get('role') in ['manager', 'otk', 'admin']:
                return send_from_directory(self.app.static_folder, 'edit_productions.html')
            else:
                return "Недостаточно прав для отображения контента!"
        else:
            return redirect('/')

    def get_productions_common(self, status = None):
        if status:
            query = "SELECT * FROM productions WHERE production_status = %s AND qc_status = 'OK'"
        else:
            query = "SELECT * FROM productions"

        try:
            productions = self.db_manager.execute_query(query, (status,))
            # print(productions)
            return jsonify(productions)
        except Exception as e:
            print(e)
            return jsonify({'error': str(e)}), 500

    def get_productions(self):
        return self.get_productions_common()

    def get_productions_status5(self):
        return self.get_productions_common(status = 5)

    def get_productions_status6(self):
        return self.get_productions_common(status = 6)

    def add_production(self):
        if 'username' in session:
            datetime_value = datetime.now(tz=pytz.timezone('Europe/Moscow'))
            product_name = session.get('product_name')
            order_num = session.get('order_num')
            product_uid = request.json['productUid']
            serial_num = request.json['serialNum']
            username = session.get('username')
            production_status = 5
            qc_status = 'OK'

            query = "INSERT INTO productions (datetime, product_name, order_num, product_uid, serial_num, username, production_status, qc_status) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
            try:
                self.db_manager.execute_insert(query, (datetime_value, product_name, order_num, product_uid, serial_num, username, production_status, qc_status))
                return jsonify({'message': 'Изделие успешно добавлено!'})
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        else:
            return redirect('/')

    def update_production_time(self):
        if 'username' in session:
            production_uid = request.json['productionUid']
            new_datetime = request.json['newDatetime']

            query = "UPDATE productions SET datetime = %s WHERE product_uid = %s"
            try:
                self.db_manager.execute_update(query, (new_datetime, production_uid))
                return jsonify({'message': 'Время успешно изменено!'})
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        else:
            return redirect('/')

    def update_production_order(self):
        if 'username' in session:
            production_uid = request.json['productionUid']
            new_order_num = request.json['newOrder']

            query = "UPDATE productions SET order_num = %s WHERE product_uid = %s"
            try:
                self.db_manager.execute_update(query, (new_order_num, production_uid))
                return jsonify({'message': 'Номер ШПЗ успешно изменен!'})
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        else:
            return redirect('/')

    def update_production_user(self):
        if 'username' in session:
            production_uid = request.json['productionUid']
            new_username = request.json['newUser']

            query = "UPDATE productions SET username = %s WHERE product_uid = %s"
            try:
                self.db_manager.execute_update(query, (new_username, production_uid))
                return jsonify({'message': 'Пользователь успешно изменен!'})
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        else:
            return redirect('/')

    def delete_production(self):
        if 'username' in session:
            production_uid = request.json['productionUid']

            query = "DELETE FROM productions WHERE product_uid = %s"
            try:
                self.db_manager.execute_delete(query, (production_uid,))
                return jsonify({'message': 'Запись успешно удалена!'})
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        else:
            return redirect('/')

    def update_quality(self):
        if 'username' in session:
            datetime_value = datetime.now(tz=pytz.timezone('Europe/Moscow'))
            production_uid = request.json['productionUid']
            new_qc_status = request.json['newQualityStatus']
            new_qc_return_quantity = request.json['newQcReturnQuantity']

            query = "UPDATE productions SET datetime = %s, qc_status = %s, qc_return_quantity = %s WHERE product_uid = %s"
            try:
                self.db_manager.execute_update(query, (datetime_value, new_qc_status, new_qc_return_quantity, production_uid))
                return jsonify({'message': 'Запись занесена в базу данных!'})
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        else:
            return redirect('/')

    def sub_quality(self):
        if 'username' in session:
            production_uid = request.json['productionUid']
            new_qc_return_quantity = request.json['newQcReturnQuantity']
            if new_qc_return_quantity == 0:
                new_qc_status = 'OK'
            else:
                new_qc_status = 'NG'

            query = "UPDATE productions SET qc_status = %s, qc_return_quantity = %s WHERE product_uid = %s"
            try:
                self.db_manager.execute_update(query, (new_qc_status, new_qc_return_quantity, production_uid))
                return jsonify({'message': 'Запись занесена в базу данных!'})
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        else:
            return redirect('/')

    def delete_quality(self):
        if 'username' in session:
            production_uid = request.json['productionUid']
            new_qc_status = request.json['newQualityStatus']
            new_qc_return_quantity = request.json['newQcReturnQuantity']

            query = "UPDATE productions SET qc_status = %s, qc_return_quantity = %s WHERE product_uid = %s"
            try:
                self.db_manager.execute_update(query, (new_qc_status, new_qc_return_quantity, production_uid))
                return jsonify({'message': 'Запись занесена в базу данных!'})
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        else:
            return redirect('/')
    def get_quality_control(self):
        query = "SELECT * FROM quality_control"
        try:
            quality_control = self.db_manager.execute_query(query)
            return jsonify(quality_control)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def add_quality_control(self):
        if 'username' in session:
            datetime_value = datetime.now(tz=pytz.timezone('Europe/Moscow'))
            product_uid = request.json['productionUid']
            username = request.json['username']
            production_status = request.json['productionStatus']
            qc_username = session.get('username')
            qc_status = request.json['newQualityStatus']
            qc_comment = request.json['qualityComment']

            query = "INSERT INTO quality_control (datetime, product_uid, username, production_status, qc_username, qc_status, qc_comment) VALUES (%s, %s, %s, %s, %s, %s, %s)"
            try:
                self.db_manager.execute_insert(query, (datetime_value, product_uid, username, production_status, qc_username, qc_status, qc_comment))
                return jsonify({'message': 'Запись успешно добавлена!'})
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        else:
            return redirect('/')

    def delete_quality_control(self):
        if 'username' in session:
            quality_control_id = request.json['quality_controlID']

            query = "DELETE FROM quality_control WHERE id = %s"
            try:
                self.db_manager.execute_delete(query, (quality_control_id,))
                return jsonify({'message': 'Запись успешно удалена!'})
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        else:
            return redirect('/')

    def flying_test(self):
        if 'username' in session:
            return send_from_directory(self.app.static_folder, 'flying_test.html')
        else:
            return redirect('/')

    def update_production_status(self):
        if 'username' in session:
            datetime_value = datetime.now(tz=pytz.timezone('Europe/Moscow'))
            production_uid = request.json['productionUid']
            new_production_status = request.json['newProductionStatus']
            new_qc_status = request.json['newQualityStatus']
            username = session.get('username')
            new_qc_return_quantity = request.json['newQcReturnQuantity']

            query = "UPDATE productions SET datetime = %s, qc_status = %s, production_status = %s, username = %s, qc_return_quantity = %s WHERE product_uid = %s"
            try:
                self.db_manager.execute_update(query, (datetime_value, new_qc_status, new_production_status, username, new_qc_return_quantity, production_uid))
                return jsonify({'message': 'Запись занесена в базу данных!'})
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        else:
            return redirect('/')

    def package_control(self):
        if 'username' in session:
            return send_from_directory(self.app.static_folder, 'package_control.html')
        else:
            return redirect('/')

    def get_production_control(self):
        query = "SELECT * FROM production_control"
        try:
            production_control = self.db_manager.execute_query(query)
            return jsonify(production_control)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def add_production_control(self):
        if 'username' in session:
            datetime_value = datetime.now(tz=pytz.timezone('Europe/Moscow'))
            product_uid = request.json['productionUid']
            username = request.json['username']
            production_status = request.json['productionStatus']

            query = "INSERT INTO production_control (datetime, product_uid, username, production_status) VALUES (%s, %s, %s, %s)"
            try:
                self.db_manager.execute_insert(query, (datetime_value, product_uid, username, production_status))
                return jsonify({'message': 'Запись успешно добавлена!'})
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        else:
            return redirect('/')

    @staticmethod
    def get_info():
        if 'username' in session:
            return jsonify({
                'username': session.get('username'),
                'role': session.get('role'),
                'product_name': session.get('product_name'),
                'order_num': session.get('order_num'),
                'picture_name': session.get('picture_name')
            })
        else:
            return jsonify({'error': 'Not logged in'}), 401

    @staticmethod
    def get_time():
        if 'username' in session:
            return jsonify({
                'datetime_value': datetime.now(tz=pytz.timezone('Europe/Moscow'))
            })
        else:
            return jsonify({'error': 'Not logged in'}), 401

    @staticmethod
    def logout():
        session.pop('username', None)
        session.pop('role', None)
        session.pop('product_name', None)
        session.pop('order_num', None)
        session.pop('picture_name', None)
        return redirect('/')