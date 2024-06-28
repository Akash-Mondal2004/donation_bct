import React, { useContext, createContext } from 'react';
import { useAddress, useContract, useContractWrite, useConnect, metamaskWallet } from '@thirdweb-dev/react';
import { ethers } from 'ethers';


const StateContext = createContext();
const { ethereum } = window;
export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0x65045B1d95348aAF14698F83BfDAb439B40eAe26');
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
  const address = useAddress();
  const { connect } = useConnect();
  
  const metamaskConfig = metamaskWallet();
  
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert('Please install Metamask')
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
    } catch (error) {
      reportError(error)
    }
  }
  
  const isWallectConnected = async () => {
    try {
      if (!ethereum) return alert('Please install Metamask')
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
  
      window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload()
      })
  
      window.ethereum.on('accountsChanged', async () => {
        setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
        await isWallectConnected()
      })
  
      if (accounts.length) {
        setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
      } else {
        alert('Please connect wallet.')
        console.log('No accounts found.')
      }
    } catch (error) {
      reportError(error)
    }
  }
  

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
        args: [
          address, // owner
          form.title, // title
          form.description, // description
          ethers.utils.parseUnits(form.target, 18), // target in wei
          Math.floor(new Date(form.deadline).getTime() / 1000), // deadline in seconds
          form.image, // image URL
        ],
      });

      console.log("Contract call success", data);
    } catch (error) {
      console.error("Contract call failure", error);
    }
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        // connectToMetamask,
        connectWallet,
        createCampaign: publishCampaign,
        // Other state and functions can be added here
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
