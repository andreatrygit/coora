import { Stack, Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import jsQR from "jsqr";
import React from "react";
import { useState, useEffect } from "react";

export function QrCodeScanner({onCode, onCancel}){

    const [state,setState] = useState('cam_acquisition');

    function videoStart(){
        navigator.mediaDevices.getUserMedia({ video : { facingMode: { exact: 'environment' } } })
            .then(function(mediaStream) {document.getElementById('qr-code-scanner-video').srcObject = mediaStream; setState('cam_ok')})
            .catch(function(err) {showNotification({color:"yellow", title:"VIDEOCAMERA FRONTALE NON DISPONIBILE", message:err.message, autoClose:false}); setState('cam_ko')})
    }

    function videoStop(){
        const videoEl = document.getElementById('qr-code-scanner-video');
        videoEl.srcObject.getTracks().forEach((track) => track.stop()); 
        videoEl.srcObject=null
    }

    function paintAndProcess(){
        var canvasElement = document.getElementById('qr-code-scanner-canvas');
        var canvas = canvasElement.getContext('2d');
        var videoElement = document.getElementById('qr-code-scanner-video');
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
        if(state==='cam_acquisition'){videoStart()}
        return videoStop;
    })

    useEffect(()=>{
        if(state==='cam_ok'){startPaintAndProcess()}
        return stopPaintAndProcess;
    })



    return (
        <Stack align={"center"} justify={"center"}>
            <video id="qr-code-scanner-video" autoplay="true" playsinline="true" style={{width:'256px', height:'256px', objectFit:'cover', objectPosition:'center', borderRadius:'24px'}}></video>
            <canvas id="qr-code-scanner-canvas" style={{display:'none'}}></canvas>
            <Button size="xl" radius="xl" onClick={(event)=>{if(state!=='cam_acquisition'){onCancel()}}}>Annulla</Button>
        </Stack>
    )
}