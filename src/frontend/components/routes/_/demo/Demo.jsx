import { QRCodeSVG } from "qrcode.react";
import React from "react";
import { Center } from "@mantine/core";

export function Demo(){
    return(
        <Center style={{width:'100vw', height:'100vh'}}>
            <QRCodeSVG value="abracadabra" level="M" size="256"/>
        </Center>
    )
}