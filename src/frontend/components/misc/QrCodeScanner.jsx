import { Stack, Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import jsQR from "jsqr";
import React from "react";
import { useRef, useEffect } from "react";
import Webcam from "react-webcam";

export function QrCodeScanner({onCode, onCancel}){

    const videoElement = useRef(null);
    const canvasElement = useRef(null);

    function paintAndProcess(){
        var canvas = canvasElement.getContext('2d');
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
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
            <Webcam ref={videoElement} audio={false} onUserMediaError={notify} videoConstraints={{facingMode:'environment'}} style={{width:'256px', height:'256px', objectFit:'cover', objectPosition:'center', borderRadius:'24px'}}/>
            <canvas ref={canvasElement} style={{display:'none'}}></canvas>
            <Button size="xl" radius="xl" onClick={onCancel}>Annulla</Button>
        </Stack>
    )
}