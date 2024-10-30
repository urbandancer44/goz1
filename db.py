import psycopg2


class DatabaseManager:
    def __init__(self, app):
        self.app = app

    def get_db_connection(self):
        return psycopg2.connect(
            host=self.app.config['DB_HOST'],
            database=self.app.config['DB_NAME'],
            user=self.app.config['DB_USER'],
            password=self.app.config['DB_PASS']
        )

    def execute_query(self, query, params=None):
        conn = self.get_db_connection()
        try:
            with conn.cursor() as cur:
                if params:
                    cur.execute(query, params)
                else:
                    cur.execute(query)
                conn.commit()
                return cur.fetchall()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    def execute_insert(self, query, params):
        conn = self.get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(query, params)
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    def execute_delete(self, query, params):
        conn = self.get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(query, params)
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()
