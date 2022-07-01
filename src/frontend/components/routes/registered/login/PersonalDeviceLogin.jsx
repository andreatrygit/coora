import { Stack } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {React, useState, useEffect} from "react";
import { isValidQrCode, isValidTimeClockQrCode } from "../../../../utils";
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
            if(state==='shared-device-login-2'){
                doSharedDeviceLogin();
            }
        }
    })

    useEffect(()=>{
        if(qrCode){
            if(!isValidQrCode(qrCode)){
                showNotification({title:'QRCODE NON VALIDO.', message:'Stai scansionando un codice non creato da noi.', color:'yellow', autoClose:false});
                setQrCode('');
            }
            if(isValidTimeClockQrCode(qrCode)){
                if(state==='time-clocking'){
                    setState('start');
                    doTimeClock()
                }
                else{
                    showNotification({title:'QRCODE DA TIMBRATORE.', message:'Stai scansionando un codice da timbratore anziché da postazione condivisa.', color:'yellow', autoClose:false});
                    setQrCode('');
                }
            }
        }
    })

    return(
        <Stack align={"center"} justify={"center"} style={{width:'100vw', minHeight:'100vh', padding:'0.5rem'}}>
            
        </Stack>
    )
}