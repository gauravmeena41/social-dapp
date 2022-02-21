import { PhotographIcon, XCircleIcon } from "@heroicons/react/solid";
import { ethers } from "ethers";
import { useState } from "react";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { contractAddress } from "../config";
import Social from "../artifacts/contracts/Social.sol/Social.json";

const CreatePost = () => {
  const client = ipfsHttpClient("https://ipfs.infura.io:5001/");
  const [file, setFile] = useState("");
  const [desc, setDesc] = useState("");

  const createPost = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      let contract = new ethers.Contract(contractAddress, Social.abi, signer);

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

  console.log(file);

  return (
    <div className="mx-2 p-5 rounded-lg shadow w-[100%] md:w-[450px] bg-[#2F2F2F] ">
      <form
        className="flex items-center justify-between"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          className="border-2 border-gray-400 outline-none rounded-full px-2 py-1 bg-transparent"
          placeholder="What's on your mind?"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <label htmlFor="file" className="cursor-pointer">
          <PhotographIcon className="w-8 h-8 text-green-600" />
        </label>
        <input
          type="file"
          id="file"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          type="submit"
          className="bg-[#0466c8] text-white px-4 py-[2px] rounded-full font-semibold"
          onClick={createPost}
        >
          Post
        </button>
      </form>
      {file && (
        <div className="mt-4 relative">
          <img
            src={URL.createObjectURL(file)}
            alt=""
            className="w-full h-auto object-cover rounded-lg"
          />
          <XCircleIcon
            className="w-4 h-4 text-[#2f2f2f] absolute top-0 right-0 bg-white rounded-bl cursor-pointer"
            onClick={() => window.location.reload()}
          />
        </div>
      )}
    </div>
  );
};

export default CreatePost;
