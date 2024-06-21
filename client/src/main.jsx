import React from 'react';
import ReactDom from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChainId, ThirdwebProvider} from '@thirdweb-dev/react';
import App from './App';
import './index.css';
import { StateContextProvider } from './context';
import { client } from './constants';
const root = ReactDom.createRoot(document.getElementById('root'));
// console.log(ChainId);

  
root.render(
    <ThirdwebProvider activeChain= {11155111} clientId= "d9645be90e76e6cbe5cbec979d06290a">
        
        <Router>
            <StateContextProvider>
                <App />
            </StateContextProvider>
        </Router>
    </ThirdwebProvider>
)