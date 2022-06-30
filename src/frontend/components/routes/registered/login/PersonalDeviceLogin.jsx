import { Stack } from "@mantine/core";
import {React, useState, useEffect} from "react";
import { QrCodeScanner } from "../../../misc/QrCodeScanner";

export function PersonalDeviceLogin(){
    const [pin,setPin] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [state,setState] = useState('start');

    function doTimeClock(){}
    function doPersonalLogin(){}
    function doSharedDeviceLogin(){}

    useEffect(()=>{
        if(pin){
            if(state==='personal-login'){
                doPersonalLogin();
            }
            if(state==='shared-device-login'){
                doSharedDeviceLogin();
            }
        }
    })

    useEffect(()=>{
        
    })

    return(
        <Stack align={"center"} justify={"center"} style={{width:'100vw', minHeight:'100vh', padding:'0.5rem'}}>
            
        </Stack>
    )
}