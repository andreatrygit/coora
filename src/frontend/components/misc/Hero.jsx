import React from "react";
import {Text} from "@mantine/core";

export function Hero(props){
    return(
        <Text
            component="span"
            align="center"
            variant="gradient"
            gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
            weight={700}
            style={{fontSize:'3.75rem'}}
            >{props.title}</Text>
    )
}