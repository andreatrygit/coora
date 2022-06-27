import { Stack } from "@mantine/core";
import React from "react";
import { QrCodeScanner } from "../../../misc/QrCodeScanner";

export function Demo(){
    return(
        <Stack align={"center"} justify={"center"} style={{width:'100vw', minHeight:'100vh', padding:'0.5rem'}}>
            <QrCodeScanner onCancel={()=>console.log('cancelled')} onCode={(code)=>console.log(code)}/>
        </Stack>
    )
}