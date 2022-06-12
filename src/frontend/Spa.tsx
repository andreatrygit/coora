import React from "react";
import { useState } from 'react';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';

import ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import {Home} from "./components/routes/_/Home";
import {NotFound} from "./components/misc/NotFound";

function Spa(){
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (

    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>

        <BrowserRouter>

          <Routes>
            
            <Route path='*' element={<NotFound />} />
            <Route path="/" element={<Home />}/>

          </Routes>

        </BrowserRouter>

      </MantineProvider>
    </ColorSchemeProvider>

  );
}

export default Spa