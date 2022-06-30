import React from "react";
import { useState } from 'react';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

import ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import {NotFound} from "./components/misc/NotFound";
import { Base } from "./components/misc/Base";
import {Home} from "./components/routes/Home";
import { Registered } from "./components/routes/registered/Registered";
import {Login} from "./components/routes/registered/login/Login";

function Spa(){
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (

    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <NotificationsProvider>

          <BrowserRouter>

            <Routes>
              
              <Route path="/" element={<Base />}>
                <Route index element={<Home/>}/>
                <Route path="registered" element={<Registered/>}>
                  <Route index element={<NotFound/>}/>
                  <Route path="login" element={<Login/>}/>
                </Route>  
                <Route path='*' element={<NotFound />} />
              </Route>

            </Routes>

          </BrowserRouter>

        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>

  );
}

export default Spa