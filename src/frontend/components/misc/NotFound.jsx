import React from "react";
import { Center } from "@mantine/core";
import { Stack } from "@mantine/core";
import { Hero } from "./Hero";
import { Button } from "@mantine/core";
import { Link } from "react-router-dom";

export function NotFound(props){
    return(
        <Center style={{width:'100vw', height:'100vh'}}>
            <Stack align="center" justify="center" spacing="xs">
                <Hero title="Qui non c'è nulla" message="Ci dispiace veramente!"></Hero>
                <Button component={Link} to="/" size="xl" radius={"xl"}>Pagina Iniziale</Button>
            </Stack>
        </Center>
    )
}