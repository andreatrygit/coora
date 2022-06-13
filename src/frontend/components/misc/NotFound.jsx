import React from "react";
import { Center } from "@mantine/core";
import { Stack } from "@mantine/core";
import { Hero } from "./Hero";
import { Link} from "react-router-dom";
import { Button } from "@mantine/core";

export function NotFound(props){
    return(
        <Center style={{width:'100vw', height:'100vh'}}>
            <Stack align="center" justify="center" spacing="xs">
                <Hero title="Qui non c'è nulla" message="Ci dispiace veramente!"></Hero>
                <Link to={"/"}><Button size="xl" radius={"xl"}>Torna a casa..</Button></Link>
            </Stack>
        </Center>
    )
}