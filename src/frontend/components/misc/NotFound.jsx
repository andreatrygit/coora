import React from "react";
import { Center } from "@mantine/core";
import { Stack } from "@mantine/core";
import { Hero } from "./Hero";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export function NotFound(props){
    let navigate = useNavigate();
    function goHome(){navigate("/")}
    return(
        <Center style={{width:'100vw', height:'100vh'}}>
            <Stack align="center" justify="center" spacing="xs">
                <Hero title="Qui non c'è nulla" message="Ci dispiace veramente!"></Hero>
                <Button size="xl" radius={"xl"} onClick={goHome}>Pagina Iniziale</Button>
            </Stack>
        </Center>
    )
}