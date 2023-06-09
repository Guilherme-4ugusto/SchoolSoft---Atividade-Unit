from pydantic import BaseModel


class FaltaOut(BaseModel):
  codigo_disciplina: int
  matricula_aluno: int
  qtde_falta: int


class FaltaIn(BaseModel):
  codigo_disciplina: int
  matricula_aluno: int
  qtde_falta: int
