import Header from "@/components/header";
import { Modal, Input, Button, Text } from "@nextui-org/react";
import { AddUser } from 'react-iconly'
import AlunosTable from "@/components/table"
import { ToastContainer, toast } from 'react-toastify';
import React from "react";
import { Spacer } from '@nextui-org/react';
import 'react-toastify/dist/ReactToastify.css';
import Footer from "@/components/footer";
import { useEffect, useState } from 'react';
import DropdownList from "react-widgets/DropdownList";
import "react-widgets/styles.css";

export default function Alunos(){
    const [visible, setVisible] = React.useState(false);
    const [visibleModalMedia, setVisibleModalMedia] = React.useState(false);
    const [visibleModalFalta, setVisibleModalFalta] = React.useState(false);
    const [inputAluno, setInputAluno] = React.useState("");
    const [inputDisciplina, setInputDisciplina] = React.useState("");
    const [inputMedia, setInputMedia] = React.useState("0");
    const [inputFalta, setInputFalta] = React.useState("0");
    const [inputNome, setInputNome] = React.useState("");
    const [inputData, setInputData] = React.useState("");
    const [state, setState] = React.useState(1);
    const [rows, setRows] = useState([]);
    const [rowsDisciplina, setRowsDisciplina] = useState([]);

    const handler = () => setVisible(true);
    const handlerModalMedia = () => setVisibleModalMedia(true);
    const handlerModalFalta = () => setVisibleModalFalta(true);

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

    const closeHandlerModalMedia = () => {
        setVisibleModalMedia(false);
        console.log("closed");
    };

    const closeHandlerModalFalta = () => {
        setVisibleModalFalta(false);
        console.log("closed");
    };

    const obterInputNome = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputNome(e.target.value);
    };

    const obterInputData = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputData(e.target.value);
    };

    const obterInputMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputMedia(e.target.value);
    };

    const obterInputFalta = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputFalta(e.target.value);
    };

    async function postMedia(){
        const mediaAluno = Number(inputMedia)
        const aluno = inputAluno.split("-");
        const disciplina = inputDisciplina.split("-");

        if(aluno[0] == null || aluno[0] == 'undefined' || aluno[0] == ''){
            notify("Um aluno deve ser vinculado a média!!", "error");
        } else if (disciplina[0] == null || disciplina[0] == 'undefined' || disciplina[0] == ''){
            notify("Uma disciplina deve ser vinculado a média!!", "error");
        } else {
            let media = {
                codigo_disciplina: disciplina[0],
                matricula_aluno: aluno[0],
                media_aluno: mediaAluno
            }
            const res = await fetch('http://127.0.0.1:8000/media', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(media),
            }).then((response) => response.json())
            .catch(function(error){
                notify(`Ocorreu um erro ao cadastrar a media: ${error}`, "error");
            })
            closeHandlerModalMedia()
            notify(`A media foi cadastrado com sucesso`, "success");
        }
    }

    async function postFaltas(){
        const faltasAluno = Number(inputFalta)
        const aluno = inputAluno.split("-");
        const disciplina = inputDisciplina.split("-");

        if(aluno[0] == null || aluno[0] == 'undefined' || aluno[0] == ''){
            notify("Um aluno deve ser vinculado as faltas!!", "error");
        } else if (disciplina[0] == null || disciplina[0] == 'undefined' || disciplina[0] == ''){
            notify("Uma disciplina deve ser vinculado as faltas!!", "error");
        } else {
            let media = {
                codigo_disciplina: disciplina[0],
                matricula_aluno: aluno[0],
                qtde_falta: faltasAluno
            }
            const res = await fetch('http://127.0.0.1:8000/falta', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(media),
            }).then((response) => response.json())
            .catch(function(error){
                notify(`Ocorreu um erro ao cadastrar as faltas: ${error}`, "error");
            })
            closeHandlerModalFalta()
            notify(`As faltas foram cadastradas com sucesso`, "success");
        }
    }

    async function postAlunos(){
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
                const res = await fetch('http://127.0.0.1:8000/aluno', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(professor),
                }).then((response) => response.json())
                  .catch(function(error){
                     notify(`Ocorreu um erro ao criar aluno: ${error}`, "error");
                  })
                  closeHandler()
                  notify(`O aluno ${res.nome} foi cadastrado com sucesso e recebeu a matricula ${res.matricula}!!`, "success");
                actionToTriggerReload()
            }
        }
    }


    useEffect(() => {
        async function getAlunos() {
          const data = await fetch('http://127.0.0.1:8000/alunos')
            .then((response) => response.json())
            .then((alunos) => alunos);
    
          const arrayAlunos = data.alunos;
          const newRows = arrayAlunos.map((aluno) =>
             `${aluno.matricula}-${aluno.nome}`
          );
          setRows(newRows);
        }

        async function getDisciplinas() {
            const data = await fetch('http://127.0.0.1:8000/disciplinas')
              .then((response) => response.json())
              .then((disciplinas) => disciplinas);
      
            const arrayDisciplinas = data.disciplinas;
            const newRows = arrayDisciplinas.map((disciplina) =>
              `${disciplina.id}-${disciplina.nome}`
            );
            setRowsDisciplina(newRows);
          }
    
        getAlunos()
        getDisciplinas()
      }, []);

    return(
        <div className="App">
            <Header/>
            <div className="Box">
                <div className="RowTitle">
                    <h1 className="Title">Alunos</h1>
                    <div className="RowButtons">
                        <Button shadow color="primary" icon={<AddUser set="curved"/>} auto onPress={handler}>
                            Adicionar Alunos
                        </Button>
                        <Spacer x={1} />
                        <Button shadow color="primary" icon={<AddUser set="curved"/>} auto onPress={handlerModalMedia}>
                            Adicionar Medias
                        </Button>
                        <Spacer x={1} />
                        <Button shadow color="primary" icon={<AddUser set="curved"/>} auto onPress={handlerModalFalta}>
                            Adicionar Faltas
                        </Button>    
                    </div>
                </div>
                <AlunosTable key={state}/>
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
                        Novo Aluno
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Input
                        clearable
                        required
                        helperText="Porfavor insira o nome do aluno."
                        label="Nome"
                        placeholder="Nome do aluno"
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
                <Button auto flat color="error" onPress={closeHandlerModalMedia}>
                    Cancelar
                </Button>
                <Button auto onPress={postAlunos}>
                    Adicionar
                </Button>
                </Modal.Footer>
            </Modal>
            <Modal
                closeButton
                aria-labelledby="modal-title"
                open={visibleModalMedia}
                onClose={closeHandlerModalMedia}
                blur
            >
                <Modal.Header>
                    <Text id="modal-title" size={18} b>
                        Adicionar Media
                    </Text>
                </Modal.Header>
                <Modal.Body>
                     <Input 
                        label="Media" 
                        type="number" 
                        defaultValue={0}
                        onBlur={obterInputMedia}
                    />
                    <DropdownList
                        defaultValue="Selecione o aluno"
                        data={rows}
                        onChange={(nextValue) =>  setInputAluno(nextValue)}
                    />
                    <DropdownList
                        defaultValue="Selecione a disciplina"
                        data={rowsDisciplina}
                        onChange={(nextValue) => setInputDisciplina(nextValue)}
                    />
                </Modal.Body>
                <Modal.Footer>
                <Button auto flat color="error" onPress={closeHandlerModalMedia}>
                    Cancelar
                </Button>
                <Button auto onPress={postMedia}>
                    Adicionar
                </Button>
                </Modal.Footer>
            </Modal>
            <Modal
                closeButton
                aria-labelledby="modal-title"
                open={visibleModalFalta}
                onClose={closeHandlerModalFalta}
                blur
            >
                <Modal.Header>
                    <Text id="modal-title" size={18} b>
                        Adicionar Faltas
                    </Text>
                </Modal.Header>
                <Modal.Body>
                     <Input 
                        label="Faltas" 
                        type="number" 
                        defaultValue={0}
                        onBlur={obterInputFalta}
                    />
                    <DropdownList
                        defaultValue="Selecione o aluno"
                        data={rows}
                        onChange={(nextValue) =>  setInputAluno(nextValue)}
                    />
                    <DropdownList
                        defaultValue="Selecione a disciplina"
                        data={rowsDisciplina}
                        onChange={(nextValue) => setInputDisciplina(nextValue)}
                    />
                </Modal.Body>
                <Modal.Footer>
                <Button auto flat color="error" onPress={closeHandlerModalFalta}>
                    Cancelar
                </Button>
                <Button auto onPress={postFaltas}>
                    Adicionar
                </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer toastClassName='Toastify' />
        </div>
    )
}