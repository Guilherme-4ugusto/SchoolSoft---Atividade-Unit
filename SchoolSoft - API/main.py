from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models.Professor as Professor
import models.Aluno as Aluno
import models.Diciplina as Disciplina
import models.Media as Media
import models.Falta as Falta
import models.Relatorio as Relatorio
import dao.dao as DAO

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/professor", response_model=Professor.ProfessorOut)
async def createProfessor(professor: Professor.ProfessorIn):
    DAO.insert("professor", "nome, dt_nascimento", (professor.nome, professor.dt_nascimento))
    matricula = DAO.obterUltimoId("professor", "matricula")
    queryResult = DAO.select("professor", "nome, matricula, dt_nascimento", f" and matricula = {matricula}")
    return {'matricula': queryResult[0][1], 'nome': queryResult[0][0], 'dt_nascimento': queryResult[0][2]}


@app.get("/professor/{matricula}", response_model=Professor.ProfessorOut)
async def retornaProfessor(matricula):
    queryResult = DAO.select("professor", "nome, matricula, dt_nascimento", f" and matricula = {matricula}")
    return {'matricula': queryResult[0][1], 'nome': queryResult[0][0], 'dt_nascimento': queryResult[0][2]}


@app.get("/professores", response_model=Professor.ProfessoresOut)
async def retornaProfessores():
    payload = []
    queryResult = DAO.select("professor", "nome, matricula, dt_nascimento", "")
    for result in queryResult:
        content = {'matricula': result[1], 'nome': result[0], 'dt_nascimento': result[2]}
        payload.append(content)
    return {'professores': payload}

@app.post("/aluno", response_model=Aluno.AlunoOut)
async def createAluno(aluno: Aluno.AlunoIn):
  DAO.insert("aluno", "nome, dt_nascimento", (aluno.nome, aluno.dt_nascimento))
  matricula = DAO.obterUltimoId("aluno", "matricula")
  queryResult = DAO.select("aluno", "nome, matricula, dt_nascimento",
                           f" and matricula = {matricula}")
  return {
    'matricula': queryResult[0][1],
    'nome': queryResult[0][0],
    'dt_nascimento': queryResult[0][2]
  }


@app.get("/aluno/{matricula}", response_model=Aluno.AlunoRelatorioOut)
async def retornaAluno(matricula):
  queryResult = DAO.consultar_aluno(matricula)
  payload = []
  for result in queryResult:
    content = {
      'matricula': matricula,
      'nome': result[0],
      'dt_nascimento': result[1],
      'nome_disciplina': result[2],
      'media': result[3],
      'falta': result[4]
    }
    payload.append(content)
  return {'aluno_complet': payload}

@app.get("/alunos", response_model=Aluno.AlunosOut)
async def retornaAlunos():
  payload = []
  queryResult = DAO.select("aluno", "nome, matricula, dt_nascimento", "")
  for result in queryResult:
    content = {
      'matricula': result[1],
      'nome': result[0],
      'dt_nascimento': result[2]
    }
    payload.append(content)
  return {'alunos': payload}

@app.post("/disciplina", response_model=Disciplina.DisciplinaOut)
async def createDisciplina(disciplina: Disciplina.DisciplinaIn):
  DAO.insert("disciplina", "nome, matricula_professor",
             (disciplina.nome, disciplina.matricula_professor))
  id = DAO.obterUltimoId("disciplina", "id")
  queryResult = DAO.select("disciplina", "id, nome, matricula_professor",
                           f" and id = {id}")
  return {
    'id': queryResult[0][0],
    'nome': queryResult[0][1],
    'matricula_professor': queryResult[0][2]
  }

@app.get("/disciplina/{id}", response_model=Disciplina.DisciplinaIn)
async def retornaDisciplina(id):
  queryResult = DAO.select("disciplina", "id, matricula_professor, nome",
                           f" and id = {id}")
  return {
    'id': queryResult[0][0],
    'matricula_professor': queryResult[0][1],
    'nome': queryResult[0][2]
  }

@app.get("/disciplinas", response_model=Disciplina.DisciplinasOut)
async def retornaDisciplinas():
  payload = []
  queryResult = DAO.select("disciplina", "id, nome, matricula_professor", "")
  for result in queryResult:
    content = {
      'id': result[0],
      'nome': result[1],
      'matricula_professor': result[2]
    }
    payload.append(content)
  return {'disciplinas': payload}

@app.post("/media", response_model=Media.MediaOut)
async def insertMedia(media: Media.MediaIn):
  DAO.insert(
    "media", "codigo_disciplina, matricula_aluno, media_aluno",
    (media.codigo_disciplina, media.matricula_aluno, media.media_aluno))
  queryResult = DAO.select(
    "media", "*",
    f"and matricula_aluno = {media.matricula_aluno}  and codigo_disciplina ={media.codigo_disciplina}"
  )
  return {
    'codigo_disciplina': queryResult[0][0],
    'matricula_aluno': queryResult[0][1],
    'media_aluno': queryResult[0][2]
  }

@app.post("/falta", response_model=Falta.FaltaOut)
async def insertFalta(falta: Falta.FaltaIn):
  DAO.insert(
    "falta", "codigo_disciplina, matricula_aluno, qtde_falta",
    (falta.codigo_disciplina, falta.matricula_aluno, falta.qtde_falta))
  queryResult = DAO.select(
    "falta", "*",
    f"and matricula_aluno = {falta.matricula_aluno}  and codigo_disciplina ={falta.codigo_disciplina}"
  )
  return {
    'codigo_disciplina': queryResult[0][0],
    'matricula_aluno': queryResult[0][1],
    'qtde_falta': queryResult[0][2]
  }

@app.get("/relatorio", response_model=Relatorio.RelatoriosOut)
async def selectRelatorio():
  payload = []
  queryResult = DAO.relatorio()
  for result in queryResult:
    content = {
    'Nome_Disciplina': result[0],
    'Doscente': result[1],
    'Discente': result[2],
    'Matricula': result[3],
    'Media': result[4],
    'Falta': result[5]
    }
    payload.append(content)
  return {'relatorios': payload}
