import React from "react";
import {Center} from "@mantine/core";
import {Hero} from "../../misc/Hero";


export function Home(props){
    return(
        <Center style={{width:'100vw', height:'100vh'}}>
            <Hero title="Coora" message="La piattaforma Open Source per la cura delle persone."></Hero>
        </Center>
    )
}