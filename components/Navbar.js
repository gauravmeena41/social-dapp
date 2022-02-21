import Link from "next/link";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../redux/index";
import { contractAddress } from "../config";
import Social from "../artifacts/contracts/Social.sol/Social.json";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SearchIcon } from "@heroicons/react/outline";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [searchId, setSearchId] = useState("");
  const router = useRouter();

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
      user = await contract.fetchUser();
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
      const currentUser = {
        userId: user[0],
        name: user[1],
        profileImg: user[2],
        coverImg: user[3],
        posts: user[4],
        friends: user[5],
      };
      addUser(currentUser);
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
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Search for people..."
          className="border-2 border-gray-400 rounded-full outline-none px-2 py-[3px] bg-transparent"
        />
        <Link href={`/search/${searchId}`}>
          <button className="absolute bg-gray-400  rounded-tr-full rounded-br-full top-[1.5px] right-[1px] px-2 py-[3.5px]">
            <SearchIcon className="w-6 h-6 " />
          </button>
        </Link>
      </div>
      <div>
        {user.length !== 0 ? (
          <Link
            href="/profile"
            onClick={() => removeUser()}
            className="font-semibold uppercase"
          >
            <div className="flex items-center space-x-2 cursor-pointer">
              <img
                src={
                  user.profileImg
                    ? user.profileImg
                    : "https://cdn.dribbble.com/users/1577045/screenshots/4914645/media/5146d1dbf9146c4d12a7249e72065a58.png"
                }
                alt=""
                className="w-8 h-8 object-cover rounded-full p-[2px] border-2 border-gray-400 "
              />
              <h1 className="font-semibold">
                {user.name ? user.name : "User"}
              </h1>
            </div>
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
