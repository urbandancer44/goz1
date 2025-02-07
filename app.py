from flask import Flask, session
from handlers import Handlers
import os

app = Flask(__name__, static_folder='static')
app.secret_key = 'your_secret_key'

app.config['DB_HOST'] = 'postgres'
app.config['DB_NAME'] = 'gozDB'
app.config['DB_USER'] = 'goz_admin'
app.config['DB_PASS'] = 'zzz1234ZZZ'
app.config['UPLOAD_FOLDER'] = os.getcwd() + '/static/img/products'
# Папка для загрузки изображений
# app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'static', 'img', 'products')

# Инициализация обработчиков
handlers = Handlers(app)

# Маршрут для всех статических файлов
# @app.route('/static/<path:filename>')
# def serve_static(filename):
#     return handlers.serve_static(filename)

# Основные маршруты
app.add_url_rule('/', 'index', handlers.index)
app.add_url_rule('/login', 'login', handlers.login, methods=['POST'])
app.add_url_rule('/admin_panel', 'admin_panel', handlers.admin_panel)
app.add_url_rule('/edit_user', 'edit_user', handlers.edit_user)
app.add_url_rule('/get_users', 'get_users', handlers.get_users)
app.add_url_rule('/add_user', 'add_user', handlers.add_user, methods=['POST'])
app.add_url_rule('/update_user_password', 'update_user_password', handlers.update_user_password, methods=['POST'])
app.add_url_rule('/update_user_role', 'update_user_role', handlers.update_user_role, methods=['POST'])
app.add_url_rule('/delete_user', 'delete_user', handlers.delete_user, methods=['POST'])
app.add_url_rule('/edit_product', 'edit_product', handlers.edit_product)
app.add_url_rule('/get_products', 'get_products', handlers.get_products)
app.add_url_rule('/add_product', 'add_product', handlers.add_product, methods=['POST'])
app.add_url_rule('/update_product_picture', 'update_product_picture', handlers.update_product_picture, methods=['POST'])
app.add_url_rule('/delete_product', 'delete_product', handlers.delete_product, methods=['POST'])
app.add_url_rule('/select_product', 'select_product', handlers.select_product)
app.add_url_rule('/edit_workplace', 'edit_workplace', handlers.edit_workplace)
app.add_url_rule('/get_workplaces', 'get_workplaces', handlers.get_workplaces)
app.add_url_rule('/add_workplace', 'add_workplace', handlers.add_workplace, methods=['POST'])
app.add_url_rule('/update_workplace_name', 'update_workplace_name', handlers.update_workplace_name, methods=['POST'])
app.add_url_rule('/delete_workplace', 'delete_workplace', handlers.delete_workplace, methods=['POST'])
# app.add_url_rule('/get_select_product_info', 'get_select_product_info', handlers.get_select_product_info)
app.add_url_rule('/get_info', 'get_info', handlers.get_info)
app.add_url_rule('/select_order', 'select_order', handlers.select_order)
# app.add_url_rule('/get_select_order_info', 'get_select_order_info', handlers.get_select_order_info)
app.add_url_rule('/set_product_name', 'set_product_name', handlers.set_product_name, methods=['POST'])
app.add_url_rule('/set_order_num', 'set_order_num', handlers.set_order_num, methods=['POST'])
app.add_url_rule('/productions', 'productions', handlers.productions)
app.add_url_rule('/get_productions', 'get_productions', handlers.get_productions)
# app.add_url_rule('/get_productions_info', 'get_productions_info', handlers.get_productions_info)
app.add_url_rule('/add_production', 'add_production', handlers.add_production, methods=['POST'])
app.add_url_rule('/productions_history', 'productions_history', handlers.productions_history)
# app.add_url_rule('/get_productions_history_info', 'get_productions_history_info', handlers.get_productions_history_info)
# app.add_url_rule('/get_edit_productions_info', 'get_edit_productions_info', handlers.get_edit_productions_info)
app.add_url_rule('/edit_productions', 'edit_productions', handlers.edit_productions)
app.add_url_rule('/update_production_time', 'update_production_time', handlers.update_production_time, methods=['POST'])
app.add_url_rule('/update_production_order', 'update_production_order', handlers.update_production_order, methods=['POST'])
app.add_url_rule('/update_production_user', 'update_production_user', handlers.update_production_user, methods=['POST'])
app.add_url_rule('/delete_production', 'delete_production', handlers.delete_production, methods=['POST'])
app.add_url_rule('/get_time', 'get_time', handlers.get_time)
app.add_url_rule('/logout', 'logout', handlers.logout, methods=['POST'])

if __name__ == '__main__':
    app.run(host='0.0.0.0')