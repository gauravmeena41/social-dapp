import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import Social from "../../artifacts/contracts/Social.sol/Social.json";
import { contractAddress } from "../../config";
import Navbar from "../../components/Navbar";
import Link from "next/link";

const searchResult = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);

  const searchUser = async (userId) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, Social.abi, signer);

    try {
      const user = await contract.fetchSingleUser(userId);
      setUser(user);
    } catch (error) {
      console.log("not Found");
    }
  };

  useEffect(() => {
    searchUser(id);
  }, [id]);

  return (
    <>
      <Navbar />
      {user && (
        <Link href="/profile">
          <div className="flex justify-center cursor-pointer">
            <div
              className="mt-20 shadow-base-shadow hover:shadow-medium-shadow bg-[#2F2F2F]
            flex items-center space-x-10 sm:w-[500px] p-5 rounded-lg"
            >
              <div className="">
                <img
                  className="w-24 h-24 rounded-full object-cover p-[1px] border-2 border-gray-400"
                  src={
                    user && user[2] !== ""
                      ? user[2]
                      : "https://cdn.dribbble.com/users/1577045/screenshots/4914645/media/5146d1dbf9146c4d12a7249e72065a58.png"
                  }
                  alt=""
                />
              </div>
              <div className="flex flex-col items-center">
                <h1 className="text-white font-semibold text-2xl">
                  {user && user[1] !== "" ? user[1] : "User"}
                </h1>
                <div className="flex space-x-2">
                  <h1 className="font-semibold mt-1">
                    {user && user[3].length ? user[3].length : "No"} Posts
                  </h1>
                  <h1 className="font-semibold mt-1">
                    {user && user[4].length ? user[4].length : "No"} Friends
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

export default searchResult;
