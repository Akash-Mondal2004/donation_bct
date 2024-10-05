import React, { useContext, createContext } from 'react';
import { useAddress, useContract, useContractWrite,useMetamask, useConnect, metamaskWallet } from '@thirdweb-dev/react';
import { ethers } from 'ethers';


const StateContext = createContext();
const { ethereum } = window;
export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0x332987d3bb6eC5205485aB9527BB8161eA6c2763');
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
  const address = useAddress();
  const  connect  = useMetamask();
  
  // const metamaskConfig = metamaskWallet();
  
  // const connectWallet = async () => {
  //   try {
  //     if (!ethereum) return alert('Please install Metamask')
  //     const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
  //     setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
  //   } catch (error) {
  //     reportError(error)
  //   }
  // }
  
  // const isWallectConnected = async () => {
  //   try {
  //     if (!ethereum) return alert('Please install Metamask')
  //     const accounts = await ethereum.request({ method: 'eth_accounts' })
  //     setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
  
  //     window.ethereum.on('chainChanged', (chainId) => {
  //       window.location.reload()
  //     })
  
  //     window.ethereum.on('accountsChanged', async () => {
  //       setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
  //       await isWallectConnected()
  //     })
  
  //     if (accounts.length) {
  //       setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
  //     } else {
  //       alert('Please connect wallet.')
  //       console.log('No accounts found.')
  //     }
  //   } catch (error) {
  //     reportError(error)
  //   }
  // }
  

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
        args: [
          address, // owner
          form.title, // title
          form.description, // description
          // ethers.utils.parseUnits(form.target, 18), // target in wei
          form.target,
          // Math.floor(new Date(form.deadline).getTime() / 1000), // deadline in seconds
          new Date(form.deadline).getTime(),
          form.image, // image URL
        ],
      });

      console.log("Contract call success", data);
    } catch (error) {
      console.error("Contract call failure", error);
    }
  };
  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns');

    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i
    }));
    
    return parsedCampaigns;
  }
  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }
  const donate = async (pId, amount) => {
    const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount)});

    return data;
  }

  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators', [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        getCampaigns,
        createCampaign: publishCampaign,
        getUserCampaigns,
        donate,
        getDonations
        // Other state and functions can be added here
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
