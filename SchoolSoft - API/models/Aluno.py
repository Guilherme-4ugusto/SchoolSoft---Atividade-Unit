from datetime import date

from pydantic import BaseModel, validator

from typing import List

class AlunoOut(BaseModel):
  matricula: int
  nome: str
  dt_nascimento: date

class AlunoCompletOut(BaseModel):
  matricula: int
  nome: str
  dt_nascimento: date
  nome_disciplina: str
  media: float
  falta: int

class AlunosOut(BaseModel):
  alunos: List[AlunoOut]

class AlunoRelatorioOut(BaseModel):
  aluno_complet: List[AlunoCompletOut]

class AlunoIn(BaseModel):
  nome: str
  dt_nascimento: date
  
  @validator("dt_nascimento")
  def validarDataNascimeno(cls, v):
    if v > date.today():
      raise ValueError(
        "A data de nascimento não pode ser maior que a data atual.")
    return v
