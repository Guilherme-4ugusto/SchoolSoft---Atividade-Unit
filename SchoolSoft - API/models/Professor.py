from datetime import date

from pydantic import BaseModel, validator

from typing import List

class ProfessorOut(BaseModel):
    matricula: int
    nome: str
    dt_nascimento: date

class ProfessoresOut(BaseModel):
    professores : List[ProfessorOut]

class ProfessorIn(BaseModel):
    nome: str
    dt_nascimento: date

    @validator("dt_nascimento")
    def validarDataNascimeno(cls, v):
        if v > date.today():
            raise ValueError("A data de nascimento não pode ser maior que a data atual.")
        return v
