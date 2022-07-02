import { Button, Stack } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import React from "react";
import {useState, useEffect} from "react";
import { isValideSharedDeviceQrCode, isValidQrCode, isValidTimeClockQrCode } from "../../../../utils";
import { Text } from "@mantine/core";
import { QrCodeScanner } from "../../../misc/QrCodeScanner";
import { Key, Qrcode } from "tabler-icons-react";
import { Link } from "react-router-dom";
import {PinPad} from "../../../misc/PinPad"

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
            if(isValideSharedDeviceQrCode(qrCode)){
                if(state==='shared-device-login-1'){
                    setState('shared-device-login-2');
                }
                else{
                    showNotification({title:'QRCODE DA POSTAZIONE CONDIVISA.', message:'Stai scansionando un codice da postazione fissa anziché da timbratore.', color:'yellow', autoClose:false});
                    setQrCode('');
                }
            }
        }
    })

    return(
        <Stack align={"center"} justify={"center"} style={{width:'100vw', minHeight:'100vh', padding:'0.5rem'}}>
            {state==='start' &&
                <>
                    <Button onClick={()=>setState('time-clocking')} leftIcon={<Key/>} size={'lg'} radius={"xl"} color={"violet"}>ENTRARE</Button>
                    <Button leftIcon={<Qrcode/>} size={'lg'} radius={"xl"} color={"indigo"}>TIMBRARE</Button>
                    <Button leftIcon={<Qrcode/>} size={'lg'} radius={"xl"}>POSTAZIONE</Button>
                    <Button component={Link} to="/" size="lg" radius={"xl"} variant={"outline"}>Annulla</Button>
                </>
            }
            {state==='time-clocking' &&
                <>
                    <PinPad onCancel={()=>setState('start')}/>
                </>
            }
        </Stack>
    )
}