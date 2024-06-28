import React from 'react';
import {Route,Routes} from 'react-router-dom';
import {Home,CreateCampaign,CampaignDetails,Profile} from './pages';
import {Navbar,Sidebar} from './components'
// import { ConnectButton } from '@thirdweb-dev/react';
import { client } from './constants';
import { createWallet, inAppWallet } from "thirdweb/wallets";
 
// const wallets = [
//   inAppWallet(),
//   createWallet("io.metamask"),
//   createWallet("com.coinbase.wallet"),
//   createWallet("me.rainbow"),
// ];

const App = () => {
  return (
    <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar />   
      </div>

      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        {/* <ConnectButton client={"d9645be90e76e6cbe5cbec979d06290a"}/> */}
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/profile' element={<Profile />}/>
          <Route path='/create-campaign' element={<CreateCampaign />}/>
          <Route path='/campaign-details/:id' element={<CampaignDetails />}/>
        </Routes>
      </div>
    </div>
  );
};

export default App;