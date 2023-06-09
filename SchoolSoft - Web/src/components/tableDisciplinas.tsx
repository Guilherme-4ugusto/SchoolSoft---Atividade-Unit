import { Table} from "@nextui-org/react";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns'

export default function TableBody() {
  const [rows, setRows] = useState([]);
  const router = useRouter();

    interface Data {
      id: number;
      nome: string;
      matricula_professor: number;
    }
    
    function createData(
        id: number,
        nome: string,
        matricula_professor: number,
    ): Data {
      return {
        id,
        nome,
        matricula_professor,
      };
    }
    
    useEffect(() => {
      async function getDisciplinas() {
        const data = await fetch('http://127.0.0.1:8000/disciplinas')
          .then((response) => response.json())
          .then((disciplinas) => disciplinas);
  
        const arrayDisciplinas = data.disciplinas;
        const newRows = arrayDisciplinas.map((disciplina: Data) =>
          createData(disciplina.id, disciplina.nome, disciplina.matricula_professor)
        );
        setRows(newRows);
      }
      getDisciplinas();
    }, []);

    return(
      <Table
          bordered
          shadow={false}
          color="primary"
          aria-label="Example pagination  table"
          css={{
            height: "auto",
            minWidth: "100%"
          }}
        >
          <Table.Header>
            <Table.Column>Cod. Materia</Table.Column>
            <Table.Column>Nome</Table.Column>
            <Table.Column>Matricula Professor</Table.Column>
          </Table.Header>
          <Table.Body>
            {rows.map((row, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell>{row.id}</Table.Cell>
                  <Table.Cell>{row.nome}</Table.Cell>
                  <Table.Cell>{row.matricula_professor}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
          <Table.Pagination
            shadow
            noMargin
            align="center"
            rowsPerPage={10}
            onPageChange={(page) => console.log({ page })}
            color={"primary"}
          />
        </Table>
    )
}