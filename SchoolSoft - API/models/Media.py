from pydantic import BaseModel


class MediaOut(BaseModel):
  codigo_disciplina: int
  matricula_aluno: int
  media_aluno: int


class MediaIn(BaseModel):
  codigo_disciplina: int
  matricula_aluno: int
  media_aluno: int
