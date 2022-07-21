import { Button, Stack } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import React from "react";
import {useState, useEffect} from "react";
import { isValidSharedDeviceQrCode, isValidQrCode, isValidTimeClockQrCode } from "../../../../utils";
import { Text } from "@mantine/core";
import { QrCodeScanner } from "../../../misc/QrCodeScanner";
import { Key, Qrcode } from "tabler-icons-react";
import { Link } from "react-router-dom";
import {PinPad} from "../../../misc/PinPad"

export function PersonalDeviceLogin(){
    const [pin,setPin] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [state,setState] = useState('start');

    function doTimeClock(){showNotification({title:'TIMECLOK QRCODE IS', message:qrCode})}
    function doPersonalLogin(){showNotification({title:'PIN IS', message:pin})}
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
            }
            else{
                showNotification({title:'QRCODE DA TIMBRATORE.', message:'Stai scansionando un codice da timbratore anziché da postazione condivisa.', color:'yellow', autoClose:false});
                setQrCode('');
            }

            if(isValidSharedDeviceQrCode(qrCode)){
                if(state==='shared-device-login-1'){
                    setState('shared-device-login-2');
                }
                
            }
            else{
                showNotification({title:'QRCODE DA POSTAZIONE CONDIVISA.', message:'Stai scansionando un codice da postazione fissa anziché da timbratore.', color:'yellow', autoClose:false});
                setQrCode('');
            }
        }
    })

    return(
        <Stack align={"center"} justify={"center"} style={{width:'100vw', minHeight:'100vh', padding:'0.5rem'}}>
            {state==='start' &&
                <>
                    <Button onClick={()=>setState('personal-login')} leftIcon={<Key/>} size={'lg'} radius={"xl"} color={"violet"}>ENTRARE</Button>
                    <Button onClick={()=>setState('time-clocking')} leftIcon={<Qrcode/>} size={'lg'} radius={"xl"} color={"indigo"}>TIMBRARE</Button>
                    <Button leftIcon={<Qrcode/>} size={'lg'} radius={"xl"}>POSTAZIONE</Button>
                    <Button component={Link} to="/" size="lg" radius={"xl"} variant={"outline"}>Annulla</Button>
                </>
            }
            {state==='personal-login' &&
                <PinPad onCancel={()=>{
                                        setPin('');
                                        setQrCode('');
                                        setState('start');
                                        }}
                        onPin={(p)=>setPin(p)}
                        message='DIGITA PIN PER ENTRARE'/>
            }
            {state==='time-clocking' &&
                <QrCodeScanner onCancel={()=>{
                                                setQrCode('');
                                                setState('start');
                                            }}
                                onCode={(c)=>{setQrCode(c)}}
                                message={'SCANSIONA TIMBRATORE'}/>
            }
        </Stack>
    )
}