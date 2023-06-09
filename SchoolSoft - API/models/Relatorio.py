from pydantic import BaseModel
from typing import List

class RelatorioOut(BaseModel):
  Nome_Disciplina: str
  Doscente: str
  Discente: str
  Matricula: int
  Media: float
  Falta: int

class RelatoriosOut(BaseModel):
  relatorios: List[RelatorioOut]

class RelatorioIn(BaseModel):
  id: int
