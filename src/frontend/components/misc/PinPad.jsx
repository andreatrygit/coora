import React from "react";
import { Badge, Button, Center, Grid, Stack } from "@mantine/core";
import { useState, useEffect } from "react";


export function PinPad({onPin,onCancel}){
    const [pin, setPin] = useState('');
    let resetHandle;
    useEffect(()=>{
        if(pin){
            if(resetHandle){
                clearTimeout(resetHandle);
                resetHandle=null;
            }
            if(pin.length<5){
                resetHandle=setTimeout(()=>{setPin('')},3000)
            }
            else{
                onPin(pin)
            }
        }
        return ()=>{if(resetHandle){clearTimeout(resetHandle);resetHandle=null;}}
    })
    
    

    return(
        <Stack align="center" justify="center">
            <Badge size="xl" radius="xl">{'• '.repeat(pin.length)}</Badge>
            <Grid columns={3} gutter={"xs"} style={{width:'256px'}}>
                <Grid.Col span={1}><Center><Button size="xl" radius="xl" onClick={event=>setPin(pin+'1')}>1</Button></Center></Grid.Col>
                <Grid.Col span={1}><Center><Button size="xl" radius="xl" onClick={event=>setPin(pin+'2')}>2</Button></Center></Grid.Col>
                <Grid.Col span={1}><Center><Button size="xl" radius="xl" onClick={event=>setPin(pin+'3')}>3</Button></Center></Grid.Col>
                <Grid.Col span={1}><Center><Button size="xl" radius="xl" onClick={event=>setPin(pin+'4')}>4</Button></Center></Grid.Col>
                <Grid.Col span={1}><Center><Button size="xl" radius="xl" onClick={event=>setPin(pin+'5')}>5</Button></Center></Grid.Col>
                <Grid.Col span={1}><Center><Button size="xl" radius="xl" onClick={event=>setPin(pin+'6')}>6</Button></Center></Grid.Col>
                <Grid.Col span={1}><Center><Button size="xl" radius="xl" onClick={event=>setPin(pin+'7')}>7</Button></Center></Grid.Col>
                <Grid.Col span={1}><Center><Button size="xl" radius="xl" onClick={event=>setPin(pin+'8')}>8</Button></Center></Grid.Col>
                <Grid.Col span={1}><Center><Button size="xl" radius="xl" onClick={event=>setPin(pin+'9')}>9</Button></Center></Grid.Col>
                <Grid.Col span={1} offset={1}><Center><Button size="xl" radius="xl" onClick={event=>setPin(pin+'0')}>0</Button></Center></Grid.Col>
            </Grid>
            <Button size="xl" radius="xl" onClick={onCancel}>Annulla</Button>
        </Stack>
    )
}