from flask import Flask, session
from handlers import Handlers

app = Flask(__name__, static_folder='static')
app.secret_key = 'your_secret_key'

app.config['DB_HOST'] = 'postgres'
app.config['DB_NAME'] = 'gozDB'
app.config['DB_USER'] = 'goz_admin'
app.config['DB_PASS'] = 'zzz1234ZZZ'

handlers = Handlers(app)

app.add_url_rule('/', 'index', handlers.index)
app.add_url_rule('/login', 'login', handlers.login, methods=['POST'])
app.add_url_rule('/admin_panel', 'admin_panel', handlers.admin_panel)
app.add_url_rule('/edit_user', 'edit_user', handlers.edit_user)
app.add_url_rule('/get_users', 'get_users', handlers.get_users)
app.add_url_rule('/add_user', 'add_user', handlers.add_user, methods=['POST'])
app.add_url_rule('/update_user', 'update_user', handlers.update_user, methods=['POST'])
app.add_url_rule('/delete_user', 'delete_user', handlers.delete_user, methods=['POST'])
app.add_url_rule('/edit_product', 'edit_product', handlers.edit_product)
app.add_url_rule('/get_products', 'get_products', handlers.get_products)
app.add_url_rule('/add_product', 'add_product', handlers.add_product, methods=['POST'])
app.add_url_rule('/delete_product', 'delete_product', handlers.delete_product, methods=['POST'])
app.add_url_rule('/select_product', 'select_product', handlers.select_product)
app.add_url_rule('/get_select_product_info', 'get_select_product_info', handlers.get_select_product_info)
app.add_url_rule('/select_order', 'select_order', handlers.select_order)
app.add_url_rule('/set_product_name', 'set_product_name', handlers.set_product_name, methods=['POST'])
app.add_url_rule('/logout', 'logout', handlers.logout, methods=['POST'])

if __name__ == '__main__':
    app.run(host='0.0.0.0')