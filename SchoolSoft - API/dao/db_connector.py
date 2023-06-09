import dotenv
import os
import mysql.connector
from mysql.connector import Error

dotenv.load_dotenv(dotenv.find_dotenv())

def dbconnect(query, valores=None, fetch_results=False):
    try:
        usr = os.getenv("DB_USER")
        pas = os.getenv("DB_PASSWORD")
        dbname = os.getenv("DB_NAME")
        host = os.getenv("DB_HOST")
        cnx = mysql.connector.connect(user=usr, password=pas, host=host, database=dbname)
        db_Info = cnx.get_server_info()
        print(f"Conectado com o banco de dados v{db_Info}")
        cursor = cnx.cursor()
        cursor.execute(query, valores)
    except Error as e:
        print(f"Erro ao conectar com o banco de dados: {e}")
    finally:
        if fetch_results:
            resultados = cursor.fetchall()
            cursor.close()
            cnx.close()
            print("A conexão com o banco de dados foi encerrada")
            return resultados
        else:
            cnx.commit()
            cursor.close()
            cnx.close()
            print("A conexão com o banco de dados foi encerrada")
