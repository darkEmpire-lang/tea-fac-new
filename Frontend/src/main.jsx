import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import './index.css'
import { NotificationProvider } from "./context/NotificationContext";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/theme"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
    <NotificationProvider>
    <ChakraProvider  theme={theme}> 
      <App />
     </ChakraProvider>
    </NotificationProvider>
  </BrowserRouter>
);
