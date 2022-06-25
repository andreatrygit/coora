import React from "react";
import { assign, createMachine } from "xstate";
import { send } from "xstate/lib/actions";
import { useMachine } from "@xstate/react";
import { Badge, Button, Grid, Stack } from "@mantine/core";

const pinPadMachine = createMachine({
    id: "pinPadMachine",
    context:{
            timeoutHandle:null,
            pin:''
        },
    initial: "start",
    states:{
        start:{
            entry:['reset'],
            on:{
                DIGIT:'one',
                CANCEL:'cancelled'
            }
        },
        one:{
            entry:['addDigit','start'],
            on:{
                RESET:'start',
                DIGIT:'two',
                CANCEL:'cancelled'
            }
        },
        two:{
            entry:['stop','addDigit','start'],
            on:{
                RESET:'start',
                DIGIT:'three',
                CANCEL:'cancelled'
            }
        },
        three:{
            entry:['stop','addDigit','start'],
            on:{
                RESET:'start',
                DIGIT:'four',
                CANCEL:'cancelled'
            }
        },
        four:{
            entry:['stop','addDigit','start'],
            on:{
                RESET:'start',
                DIGIT:'five',
                CANCEL:'cancelled'
            }
        },
        five:{
            entry:['stop','addDigit','deliver'],
            type:'final'
        },
        cancelled:{
            entry:['stop','exit'],
            type:'final'
        }
    }
},
{
    actions:{
        start:(context,event)=>{assign({startTimeout:(context,event)=>{context.timeoutHandle=setTimeout(()=>{send('RESET')},3000)}})},
        stop:(context,event)=>{assign({stopTimeout:(context,event)=>{if(context.timeoutHandle){clearTimeout(context.timeoutHandle);context.timeoutHandle=null}}})},
        reset:(context,event)=>{assign({reset:(context,event)=>{context.pin=''}})},
        addDigit:(context,event)=>{assign({addDigit:(context,event)=>{context.pin = context.pin + event.digit}});console.log(context.pin)},
        deliver:(context,event)=>{onPin(context.pin)},
        exit:(context,event)=>{onCancel()}
    }
})

export function PinPad({onPin,onCancel}){
    const [state, send] = useMachine(pinPadMachine);

    return(
        <Stack align="center" justify="center">
            <Badge size="xl" radius="xl">{state.context.pin}</Badge>
            <Grid>
                <Grid.Col span={4}><Button size="xl" radius="xl" onClick={event=>send({type:'DIGIT',digit:'1'})}>1</Button></Grid.Col>
                <Grid.Col span={4}><Button size="xl" radius="xl" onClick={event=>send({type:'DIGIT',digit:'2'})}>2</Button></Grid.Col>
                <Grid.Col span={4}><Button size="xl" radius="xl" onClick={event=>send({type:'DIGIT',digit:'3'})}>3</Button></Grid.Col>
                <Grid.Col span={4}><Button size="xl" radius="xl" onClick={event=>send({type:'DIGIT',digit:'4'})}>4</Button></Grid.Col>
                <Grid.Col span={4}><Button size="xl" radius="xl" onClick={event=>send({type:'DIGIT',digit:'5'})}>5</Button></Grid.Col>
                <Grid.Col span={4}><Button size="xl" radius="xl" onClick={event=>send({type:'DIGIT',digit:'6'})}>6</Button></Grid.Col>
                <Grid.Col span={4}><Button size="xl" radius="xl" onClick={event=>send({type:'DIGIT',digit:'7'})}>7</Button></Grid.Col>
                <Grid.Col span={4}><Button size="xl" radius="xl" onClick={event=>send({type:'DIGIT',digit:'8'})}>8</Button></Grid.Col>
                <Grid.Col span={4}><Button size="xl" radius="xl" onClick={event=>send({type:'DIGIT',digit:'9'})}>9</Button></Grid.Col>
                <Grid.Col span={4} offset={4}><Button size="xl" radius="xl" onClick={event=>send({type:'DIGIT',digit:'0'})}>0</Button></Grid.Col>
            </Grid>
            <Button size="xl" radius="xl" onClick={event=>send('CANCEL')}>Annulla</Button>
        </Stack>
    )
}