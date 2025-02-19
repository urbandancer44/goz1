import psycopg2
from psycopg2.extras import RealDictCursor

class DatabaseManager:
    def __init__(self, app):
        self.app = app

    def get_db_connection(self):
        """Создает и возвращает подключение к базе данных."""
        return psycopg2.connect(
            host=self.app.config['DB_HOST'],
            database=self.app.config['DB_NAME'],
            user=self.app.config['DB_USER'],
            password=self.app.config['DB_PASS']
        )

    def execute_query(self, query, params=None):
        """
        Выполняет SELECT-запрос и возвращает результаты в виде списка словарей.
        :param query: SQL-запрос.
        :param params: Параметры запроса.
        :return: Список словарей с результатами запроса.
        """
        conn = self.get_db_connection()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(query, params or ())
                result = cur.fetchall()
                return result if result else []
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    def execute_insert(self, query, params):
        """
        Выполняет INSERT-запрос.
        :param query: SQL-запрос.
        :param params: Параметры запроса.
        """
        conn = self.get_db_connection()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(query, params)
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    def execute_update(self, query, params):
        """
        Выполняет UPDATE-запрос.
        :param query: SQL-запрос.
        :param params: Параметры запроса.
        """
        conn = self.get_db_connection()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(query, params)
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    def execute_delete(self, query, params):
        """
        Выполняет DELETE-запрос.
        :param query: SQL-запрос.
        :param params: Параметры запроса.
        """
        conn = self.get_db_connection()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(query, params)
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()
