import { Stack, Button, Badge } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import jsQR from "jsqr";
import React from "react";
import { useRef, useEffect } from "react";
import Webcam from "react-webcam";

export function QrCodeScanner({onCode, onCancel, message}){

    function paintAndProcess(){
        const canvasElement = document.getElementById('qr-code-scanner-canvas');
        const videoElement = document.getElementsByTagName('video')[0]; //just one video tag admitted thus!!
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        var canvas = canvasElement.getContext('2d');
        canvas.drawImage(videoElement,0,0,canvasElement.width,canvasElement.height);
        var imageData = null;
        var code = null;
        if (canvasElement.width > 0 && canvasElement.height > 0) {
            imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
            });
        }
        if(code?.data){onCode(code.data)}
    }

    let intervalHandle;
    function startPaintAndProcess(){
        intervalHandle = setInterval(paintAndProcess,500)
    }
    function stopPaintAndProcess(){
        if(intervalHandle){clearInterval(intervalHandle);intervalHandle=null;}
    }

    useEffect(()=>{
        startPaintAndProcess()
        return stopPaintAndProcess;
    })

    function notify(){
        showNotification({title:'VIDEOCAMERA NON DISPONIBILE', message:'Ci dispiace, prova a concedere i privilegi necessari.', color:'yellow', autoClose:false})
    }

    return (
        <Stack align={"center"} justify={"center"}>
            <Badge size="xl" radius="xl">{message}</Badge>
            <Webcam audio={false} onUserMediaError={notify} videoConstraints={{facingMode:{exact:'environment'}}} style={{width:'256px', height:'256px', objectFit:'cover', objectPosition:'center', borderRadius:'24px'}}/>
            <canvas id='qr-code-scanner-canvas' style={{display:'none'}}></canvas>
            <Button variant="outline" size="lg" radius="xl" onClick={onCancel}>Annulla</Button>
        </Stack>
    )
}