import dao.db_connector as DbConnector

def select (tableName, columns, conditions):
    sql = f"SELECT {columns} FROM {tableName} WHERE 1 = 1 "
    if len(conditions) > 0:
        sql = sql + conditions
    return DbConnector.dbconnect(sql, fetch_results=True)

def relatorio():
    sql = f"""
        SELECT disciplina.nome as Nome_Disciplina, 
       professor.nome as Docente, 
       aluno.nome as Discente, 
       media.matricula_aluno as Matricula, 
       COALESCE(media.media_aluno, 0) as Media, 
       COALESCE(falta.qtde_falta, 0) as Falta 
FROM disciplina 
JOIN professor ON disciplina.matricula_professor = professor.matricula 
JOIN media ON disciplina.id = media.codigo_disciplina 
JOIN aluno ON media.matricula_aluno = aluno.matricula 
LEFT JOIN falta ON media.matricula_aluno = falta.matricula_aluno 
                AND disciplina.id = falta.codigo_disciplina ;
        """
    return DbConnector.dbconnect(sql, fetch_results=True)

def insert(nome_Tabela, coluna, valores):
    quantidade_valores = len(valores)
    sql = f"INSERT INTO {nome_Tabela} ({coluna}) VALUES ({','.join(['%s'] * quantidade_valores)})"
    return DbConnector.dbconnect(sql, valores)

def obterUltimoId(tabela, campo):
    sql = f"SELECT MAX({campo}) as max FROM {tabela}"
    queryResult = DbConnector.dbconnect(sql, fetch_results=True)
    return queryResult[0][0]

def consultar_aluno(matricula_aluno):
  sql = f"""
    SELECT aluno.nome AS Nome_Aluno,
       aluno.dt_nascimento AS Data_Nascimento,
       disciplina.nome AS Nome_Disciplina,
       COALESCE(media.media_aluno, 0) AS Media,
       COALESCE(falta.qtde_falta, 0) AS Falta
FROM aluno
LEFT JOIN media ON aluno.matricula = media.matricula_aluno
LEFT JOIN disciplina ON disciplina.id = media.codigo_disciplina
LEFT JOIN falta ON aluno.matricula = falta.matricula_aluno
                AND disciplina.id = falta.codigo_disciplina
WHERE aluno.matricula = {matricula_aluno};
  """
  return DbConnector.dbconnect(sql, fetch_results=True)
