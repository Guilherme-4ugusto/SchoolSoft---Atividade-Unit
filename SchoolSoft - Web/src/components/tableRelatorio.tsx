import { Table} from "@nextui-org/react";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns'
import { Modal, Input, Button, Text } from "@nextui-org/react";

export default function TableBody() {
  const [rows, setRows] = useState([]);
  const router = useRouter();

    interface Data {
        Nome_Disciplina: string,
        Doscente: string,
        Discente: string,
        Matricula: number,
        Media: number,
        Falta: number
    }
    
    function createData(
        Nome_Disciplina: string,
        Doscente: string,
        Discente: string,
        Matricula: number,
        Media: number,
        Falta: number
    ): Data {
      return {
        Nome_Disciplina,
        Doscente,
        Discente,
        Matricula,
        Media,
        Falta
      };
    }
    

    useEffect(() => {
        async function getRelatorio() {
            const data = await fetch('http://127.0.0.1:8000/relatorio')
              .then((response) => response.json())
              .then((relatorios) => relatorios);
              const arrayRelatorio = data.relatorios;
              const newRows = arrayRelatorio.map((relatorio) =>
                createData(relatorio.Nome_Disciplina, relatorio.Doscente, relatorio.Discente, relatorio.Matricula, relatorio.Media, relatorio.Falta)
              );
            setRows(newRows)
        }
        getRelatorio();
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
            <Table.Column>Disciplina</Table.Column>
            <Table.Column>Doscente</Table.Column>
            <Table.Column>Discente </Table.Column>
            <Table.Column>Matricula do discente</Table.Column>
            <Table.Column>Media</Table.Column>
            <Table.Column>Faltas</Table.Column>
          </Table.Header>
          <Table.Body>
            {rows.map((row, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell>{row.Nome_Disciplina}</Table.Cell>
                  <Table.Cell>{row.Doscente}</Table.Cell>
                  <Table.Cell>{row.Discente}</Table.Cell>
                  <Table.Cell>{row.Matricula}</Table.Cell>
                  <Table.Cell>{row.Media}</Table.Cell>
                  <Table.Cell>{row.Falta}</Table.Cell>
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
