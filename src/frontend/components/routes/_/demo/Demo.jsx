import { Stack } from "@mantine/core";
import React from "react";
import { PinPad } from "../../../misc/PinPad";

export function Demo(){
    return(
        <Stack align={"center"} justify={"center"} style={{width:'100vw', minHeight:'100vh', padding:'0.5rem'}}>
            <PinPad onCancel={()=>console.log('cancelled')} onPin={(pin)=>console.log(pin)}/>
        </Stack>
    )
}