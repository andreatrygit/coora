import React from "react";
import {Center} from "@mantine/core";
import { Stack } from "@mantine/core";
import {Hero} from "../misc/Hero";
import { Link} from "react-router-dom";
import { Button } from "@mantine/core";

export function Home(props){
    return(
        <Center style={{width:'100vw', height:'100vh'}}>
            <Stack align="center" justify="center" spacing="xs">
                <Hero title="Coora" message="La piattaforma Open Source per la cura delle persone."></Hero>
                <Button component={Link} to="/registered/login" size="lg" radius={"xl"} variant={'gradient'} gradient={{from:'indigo', to:'cyan'}}>Entra</Button>
            </Stack>
        </Center>
    )
}