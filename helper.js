import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { contractAddress } from "./config";
import Social from "./artifacts/contracts/Social.sol/Social.json";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/");

export const getWeb3Modal = async () => {
  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: false,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
        },
      },
    },
  });
  return web3Modal;
};

export const getContract = async () => {
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, Social.abi, signer);
    return contract;
  } catch (error) {
    console.log(error);
  }
};

export const createAndFetchUser = async () => {
  try {
    const contract = await getContract();

    let user = await contract.fetchUser();

    if (user[0] === "0x0000000000000000000000000000000000000000") {
      user = await contract.createUser();
      user = await contract.fetchUser();
    } else {
      user = await contract.fetchUser();
    }
    return user;
  } catch (error) {
    console.log(error);
  }
};

export const createPost = async (desc, file) => {
  try {
    const contract = await getContract();
    const added = await client.add(file, {
      progress: (prog) => console.log("Received:", prog),
    });

    const url = `https://ipfs.infura.io/ipfs/${added.path}`;

    let transaction = await contract.createPost(desc, url);
    await transaction.wait();
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const likePost = async (postId) => {
  try {
    const contract = await getContract();
    const likePost = await contract.likePost(postId);
    likePost.wait();
  } catch (error) {
    console.log(error);
  }
};

export const disLikePost = async (postId) => {
  try {
    const contract = await getContract();
    const disLikePost = await contract.disLikePost(postId);
    disLikePost.wait();
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (file = "", action = "", userName = "") => {
  try {
    const contract = await getContract();
    if (file && action === "profile") {
      const added = await client.add(file, {
        progress: (prog) => console.log("Received:", prog),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      await contract.updateUserImage(url);
    } else if (userName !== "") {
      await contract.updateUserName(userName);
    } else if (file && action === "cover") {
      const added = await client.add(file, {
        progress: (prog) => console.log("Received:", prog),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      await contract.updateUserCoverImage(url);
    }
  } catch (error) {
    console.log(error);
  }
};
