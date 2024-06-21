import React, { useContext, createContext } from 'react';
import { useAddress, useContract, useContractWrite, useConnect, metamaskWallet } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0x65045B1d95348aAF14698F83BfDAb439B40eAe26');
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
  const address = useAddress();
  const { connect } = useConnect();
  
  const metamaskConfig = metamaskWallet();
  
  const connectToMetamask = async () => {
    const wallet = await connect(walletConfig, connectOptions);
  };

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
        connectToMetamask,
        createCampaign: publishCampaign,
        // Other state and functions can be added here
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
