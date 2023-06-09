import Header from "@/components/header";
import ProfessoresTable from "@/components/table"
import { AddUser } from 'react-iconly'
import React from "react";
import { Modal, Input, Button, Text } from "@nextui-org/react";
import { Spacer } from '@nextui-org/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns'

export default function Professores(){
    const [visible, setVisible] = React.useState(false);
    const [inputNome, setInputNome] = React.useState("");
    const [inputData, setInputData] = React.useState("");
    const [state, setState] = React.useState(1);
    const handler = () => setVisible(true);

    const actionToTriggerReload = () => {
        const newKey = state * 89; // this will make sure the key are never the same
        setState(newKey)
        console.log(state)
    }


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

    const closeHandler = () => {
        setVisible(false);
        console.log("closed");
    };

    const obterInputNome = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputNome(e.target.value);
    };

    const obterInputData = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputData(e.target.value);
    };

    async function postProfessor(){
        const nome = inputNome
        const dataNascimento = inputData;

        if(nome.length == 0){
            notify("O campo nome é obrigatorio!!", "error");
        } else if (dataNascimento.length == 0){
            notify("O campo data nascimento é obrigatorio!!", "error");
        } else {
            const dataNascimentoDate = new Date(inputData + ' 00:00:00');
            const dateAtual = new Date();
            if(dataNascimentoDate.getTime() > dateAtual.getTime()){
                notify("A data nascimento não pode ser maior que a data atual!!", "error");
            } else {
                let professor = {
                    nome: nome,
                    dt_nascimento: dataNascimento
                }
                const res = await fetch('http://127.0.0.1:8000/professor', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(professor),
                }).then((response) => response.json())
                  .catch(function(error){
                     notify(`Ocorreu um erro ao criar professores: ${error}`, "error");
                  })
                closeHandler()
                notify(`O professor ${res.nome} foi cadastrado com sucesso e recebeu a matricula ${res.matricula}!!`, "success");
                actionToTriggerReload()
            }
        }
    }

    return(
        <div className="App">
            <Header/>
            <div className="Box">
                <div className="RowTitle">
                    <h1 className="Title">Professores</h1>
                    <Button shadow color="primary" icon={<AddUser set="curved"/>} auto onPress={handler}>
                        Adicionar Professor
                    </Button>
                </div>
                <ProfessoresTable key={state}/>
            </div>
            <Modal
                closeButton
                aria-labelledby="modal-title"
                open={visible}
                onClose={closeHandler}
                blur
            >
                <Modal.Header>
                    <Text id="modal-title" size={18} b>
                        Novo Professor
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Input
                        clearable
                        required
                        helperText="Porfavor insira o nome do professor."
                        label="Nome"
                        placeholder="Nome do professor"
                        onBlur={obterInputNome}
                    />
                    <Spacer y={0.5} />
                    <Input 
                        required
                        width="186px" 
                        margim-top="10px"
                        label="Data Nascimento" 
                        type="date" 
                        onBlur={obterInputData}
                    />
                </Modal.Body>
                <Modal.Footer>
                <Button auto flat color="error" onPress={closeHandler}>
                    Cancelar
                </Button>
                <Button auto onPress={postProfessor}>
                    Adicionar
                </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer toastClassName='Toastify' />
        </div>
    )
}