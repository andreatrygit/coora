import React from "react";
import { useState } from 'react';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

import ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import {NotFound} from "./components/misc/NotFound";
import { Base } from "./components/misc/Base";
import {Home} from "./components/routes/_/Home";
import { Demo } from "./components/routes/_/demo/Demo";

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
                <Route path="demo" element={<Demo/>}/>
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