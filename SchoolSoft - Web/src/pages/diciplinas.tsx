import Header from "@/components/header";
import { Modal, Input, Button, Text } from "@nextui-org/react";
import { Plus } from 'react-iconly'
import DisciplinasTable from "@/components/tableDisciplinas"
import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Spacer } from '@nextui-org/react';
import "react-widgets/styles.css";
import DropdownList from "react-widgets/DropdownList";
import { useEffect, useState } from 'react';
import { format } from 'date-fns'

export default function Diciplinas(){
    const [visible, setVisible] = React.useState(false);
    const [inputNome, setInputNome] = React.useState("");
    const [inputProfessor, setInputProfessor] = React.useState("");
    const [rows, setRows] = useState([]);
    const [state, setState] = React.useState(1);

    const actionToTriggerReload = () => {
        const newKey = state * 89; // this will make sure the key are never the same
        setState(newKey)
        console.log(state)
    }

    const map1 = new Map();

    const handler = () => setVisible(true);
    const closeHandler = () => {
        setVisible(false);
        console.log("closed");
    };

    const obterInputNome = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputNome(e.target.value);
        console.log(inputProfessor)
    };

    function notify(mensage, status) {
        if(status == 'error'){
            toast.error(mensage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
                hideProgressBar: false
            });
        } else if(status == 'success') {
            toast.success(mensage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 6000,
                hideProgressBar: false
            });
        }
    }

    useEffect(() => {
        async function getProfessores() {
            const data = await fetch('http://127.0.0.1:8000/professores')
              .then((response) => response.json())
              .then((professores) => professores);
      
              const arrayProfessores = data.professores;
              arrayProfessores.map((professor) =>
                map1.set(professor.matricula,professor.nome)
              );
              const newRows = arrayProfessores.map((professor) =>
                    `${professor.matricula}-${professor.nome}`
              );
            setRows(newRows)
        }
        getProfessores();
      }, []);

    async function postDisciplinas(){
        const nome = inputNome
        const professor = inputProfessor.split("-") 

        if(nome.length == 0){
            notify("O campo nome é obrigatorio!!", "error");
        } else if (professor[0] == null || professor[0] == 'undefined' || professor[0] == ''){
            notify("O vinculo do professor a materia é obrigatorio!!", "error");
        } else {
            console.log(professor[0])
            let disciplina = {
                nome: nome,
                matricula_professor: professor[0]
            }
            const res = await fetch('http://127.0.0.1:8000/disciplina', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(disciplina),
            }).then((response) => response.json())
            .catch(function(error){
                notify(`Ocorreu um erro ao criar professor: ${error}`, "error");
            })
            closeHandler()
            notify(`A ${res.nome} foi cadastrado com sucesso e recebeu o código ${res.id}!!`, "success");
            actionToTriggerReload()
        }
    } 

    return(
        <div className="App">
            <Header/>
            <div className="Box">
                <div className="RowTitle">
                    <h1 className="Title">Diciplinas</h1>
                    <Button shadow color="primary" icon={<Plus set="curved"/>} auto onPress={handler}>
                        Adicionar Diciplinas
                    </Button>
                </div>
                <DisciplinasTable key={state}/>
            </div>
            <Modal
                closeButton
                aria-labelledby="modal-title"
                open={visible}
                onClose={closeHandler}
                blur
                className="ModalDisciplinas"
            >
                <Modal.Header>
                    <Text id="modal-title" size={18} b>
                        Nova Materia
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Input
                        clearable
                        required
                        helperText="Porfavor insira o nome da materia."
                        label="Nome"
                        placeholder="Nome da materia"
                        onBlur={obterInputNome}
                    />
                    <Spacer y={0.5} />
                    <DropdownList
                        defaultValue="Selecione o professor"
                        data={rows}
                        onChange={(nextValue) => setInputProfessor(nextValue)}
                    />
                </Modal.Body>
                <Modal.Footer>
                <Button auto flat color="error" onPress={closeHandler}>
                    Cancelar
                </Button>
                <Button auto onPress={postDisciplinas}>
                    Adicionar
                </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer toastClassName='Toastify' />
        </div>  
    )
}