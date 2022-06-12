import React from "react";
import { useViewportSize } from '@mantine/hooks';
import {Center} from "@mantine/core";
import {Hero} from "../../misc/Hero";


export function Home(props){
    const { height, width } = useViewportSize();
    
    return(
        <Center style={{width:width, height:height}}>
            <Hero title="Coora"></Hero>
        </Center>
    )
}