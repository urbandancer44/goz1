from flask import Flask, session
from jinja2.ext import debug

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
app.add_url_rule('/edit_workplace', 'edit_workplace', handlers.edit_workplace)
app.add_url_rule('/get_workplaces', 'get_workplaces', handlers.get_workplaces)
app.add_url_rule('/add_workplace', 'add_workplace', handlers.add_workplace, methods=['POST'])
app.add_url_rule('/get_workplace_name', 'get_workplace_name', handlers.get_workplace_name, methods=['POST'])
app.add_url_rule('/update_workplace_name', 'update_workplace_name', handlers.update_workplace_name, methods=['POST'])
app.add_url_rule('/delete_workplace', 'delete_workplace', handlers.delete_workplace, methods=['POST'])
app.add_url_rule('/get_info', 'get_info', handlers.get_info)
app.add_url_rule('/quality_control', 'quality_control', handlers.quality_control)
app.add_url_rule('/flying_test', 'flying_test', handlers.flying_test)
app.add_url_rule('/package_control', 'package_control', handlers.package_control)
app.add_url_rule('/select_product', 'select_product', handlers.select_product)
app.add_url_rule('/select_order', 'select_order', handlers.select_order)
app.add_url_rule('/set_product_name', 'set_product_name', handlers.set_product_name, methods=['POST'])
app.add_url_rule('/set_order_num', 'set_order_num', handlers.set_order_num, methods=['POST'])
app.add_url_rule('/productions', 'productions', handlers.productions)
app.add_url_rule('/get_productions', 'get_productions', handlers.get_productions)
app.add_url_rule('/get_productions_status5', 'get_productions_status5', handlers.get_productions_status5)
app.add_url_rule('/get_productions_status6', 'get_productions_status6', handlers.get_productions_status6)
app.add_url_rule('/add_production', 'add_production', handlers.add_production, methods=['POST'])
app.add_url_rule('/productions_history', 'productions_history', handlers.productions_history)
app.add_url_rule('/edit_productions', 'edit_productions', handlers.edit_productions)
app.add_url_rule('/update_production_time', 'update_production_time', handlers.update_production_time, methods=['POST'])
app.add_url_rule('/update_production_order', 'update_production_order', handlers.update_production_order, methods=['POST'])
app.add_url_rule('/update_production_user', 'update_production_user', handlers.update_production_user, methods=['POST'])
app.add_url_rule('/update_production_status', 'update_production_status', handlers.update_production_status, methods=['POST'])
app.add_url_rule('/delete_production', 'delete_production', handlers.delete_production, methods=['POST'])
app.add_url_rule('/update_quality', 'update_quality', handlers.update_quality, methods=['POST'])
app.add_url_rule('/sub_quality', 'sub_quality', handlers.sub_quality, methods=['POST'])
app.add_url_rule('/get_quality_control', 'get_quality_control', handlers.get_quality_control)
app.add_url_rule('/add_quality_control', 'add_quality_control', handlers.add_quality_control, methods=['POST'])
app.add_url_rule('/delete_quality_control', 'delete_quality_control', handlers.delete_quality_control, methods=['POST'])
app.add_url_rule('/get_production_control', 'get_production_control', handlers.get_production_control)
app.add_url_rule('/add_production_control', 'add_production_control', handlers.add_production_control, methods=['POST'])
app.add_url_rule('/get_picture_name', 'get_picture_name', handlers.get_picture_name, methods=['POST'])
app.add_url_rule('/get_time', 'get_time', handlers.get_time)
app.add_url_rule('/logout', 'logout', handlers.logout, methods=['POST'])

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)