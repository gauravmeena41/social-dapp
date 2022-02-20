import Link from "next/link";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../redux/index";
import { contractAddress } from "../config";
import Social from "../artifacts/contracts/Social.sol/Social.json";
import { useEffect } from "react";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { addUser, removeUser } = bindActionCreators(actionCreators, dispatch);

  const getWeb3Modal = async () => {
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

  const createAndFetchUser = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, Social.abi, signer);

    let user = await contract.fetchUser();

    if (user[0] === "0x0000000000000000000000000000000000000000") {
      user = await contract.createUser();
    } else {
      user = await contract.fetchUser();
    }
    return user;
  };

  const connect = async () => {
    try {
      const web3Modal = await getWeb3Modal();
      const connection = await web3Modal.connect();
      let user = await createAndFetchUser();
      addUser(user);
    } catch (error) {
      console.log("error:", error);
    }
  };

  return (
    <nav className="shadow bg-[#2F2F2F] flex items-center justify-around h-12 fixed z-[2] top-0 left-0 right-0">
      <div>
        <Link href="/">
          <a className="text-2xl font-bold">SOCIAL</a>
        </Link>
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder="Search for people..."
          className="border-2 border-gray-400 rounded-full outline-none px-2 py-[3px] bg-transparent"
        />
      </div>
      <div>
        {user.length > 0 ? (
          <Link
            href="profile"
            onClick={() => removeUser()}
            className="font-semibold uppercase"
          >
            <img
              src={
                user[2]
                  ? user[2]
                  : "https://cdn.dribbble.com/users/1577045/screenshots/4914645/media/5146d1dbf9146c4d12a7249e72065a58.png"
              }
              alt=""
              className="w-8 h-8 object-cover rounded-full p-[2px] border-2 border-gray-400 cursor-pointer"
            />
          </Link>
        ) : (
          <button onClick={connect} className="font-semibold uppercase">
            Log in
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
