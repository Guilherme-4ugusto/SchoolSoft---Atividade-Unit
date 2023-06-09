import { Table} from "@nextui-org/react";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns'
import { Modal, Input, Button, Text } from "@nextui-org/react";

export default function TableBody() {
  const [rows, setRows] = useState([]);
  const router = useRouter();

    interface Data {
      nome: string;
      matricula: number;
      dt_nascimento: string;
    }
    
    function createData(
      nome: string,
      matricula: number,
      dt_nascimento: string,
    ): Data {
      return {
        nome,
        matricula,
        dt_nascimento,
      };
    }
    
    useEffect(() => {
      async function getProfessores() {
        const data = await fetch('http://127.0.0.1:8000/professores')
          .then((response) => response.json())
          .then((professores) => professores);
  
        const arrayProfessores = data.professores;
        const newRows = arrayProfessores.map((professor: Data) =>
          createData(professor.nome, professor.matricula, format(new Date(professor.dt_nascimento), 'dd/MM/yyyy'))
        );
        setRows(newRows);
      }

      async function getAlunos() {
        const data = await fetch('http://127.0.0.1:8000/alunos')
          .then((response) => response.json())
          .then((alunos) => alunos);
  
        const arrayAlunos = data.alunos;
        const newRows = arrayAlunos.map((aluno: Data) =>
          createData(aluno.nome, aluno.matricula, format(new Date(aluno.dt_nascimento), 'dd/MM/yyyy'))
        );
        setRows(newRows);
      }
  
      router.asPath === '/professores' ? getProfessores() : getAlunos();
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
            <Table.Column>Nome</Table.Column>
            <Table.Column>Matricula</Table.Column>
            <Table.Column>Data Nascimento</Table.Column>
          </Table.Header>
          <Table.Body>
            {rows.map((row, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell>{row.nome}</Table.Cell>
                  <Table.Cell>{row.matricula}</Table.Cell>
                  <Table.Cell>{row.dt_nascimento}</Table.Cell>
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
