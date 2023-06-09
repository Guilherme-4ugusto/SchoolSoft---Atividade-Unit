from pydantic import BaseModel

from typing import List


class DisciplinaOut(BaseModel):
  id: int
  nome: str
  matricula_professor : int


class DisciplinasOut(BaseModel):
  disciplinas: List[DisciplinaOut]


class DisciplinaIn(BaseModel):
  nome: str
  matricula_professor : int
