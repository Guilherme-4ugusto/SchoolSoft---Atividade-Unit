import Header from "@/components/header";
import { Modal, Input, Button, Text } from "@nextui-org/react";
import { Plus } from 'react-iconly'
import DisciplinasTable from "@/components/tableDisciplinas"
import RelatorioTable from "@/components/tableRelatorio"
import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Spacer } from '@nextui-org/react';
import "react-widgets/styles.css";
import DropdownList from "react-widgets/DropdownList";
import { useEffect, useState } from 'react';
import { format } from 'date-fns'

export default function Diciplinas(){

    return(
        <div className="App">
            <Header/>
            <div className="Box">
                <div className="RowTitle">
                    <h1 className="Title">Relatorio</h1>
                </div>
                <RelatorioTable/>
            </div>
        </div>  
    )
}