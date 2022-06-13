import React from "react";
import { Stack } from "@mantine/core";
import {Text} from "@mantine/core";

export function Hero(props){
    return(
        <Stack align="center" justify="center" spacing="xs">
            <Text
                component="div"
                align="center"
                variant="gradient"
                gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
                weight={700}
                style={{fontSize:'3.75rem', wordBreak:'normal'}}
                >{props.title}</Text>
            <Text 
                component="div"
                align="center"
                color="dimmed"
                weight={400}
                style={{fontSize:'2rem', wordBreak:'normal'}}
                >{props.message}</Text>
        </Stack>
    )
}