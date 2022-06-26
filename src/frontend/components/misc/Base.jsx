import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { kyPost } from "../../utils";
import { showNotification } from "@mantine/notifications";


export function Base(){
    useEffect(()=>{
        const message = "Questo sito utilizza alcuni cookie tecnici, solamente tecnici. Se non li desideri, interrompi la navigazione e rimuovili manualmente dalla cache di questo browser. Altrimenti, proseguendo la navigazione, accetti il loro uso."
        kyPost('/website/is-cookie-policy-set',
                ({value})=>{
                    if(value==='no'){
                        showNotification({title:"INFORMATIVA COOKIE", message:message, autoClose:false});
                    }
                },
                ()=>{});
    } 
    );
    return (
        <Outlet/>
    )
}