import { ThumbDownIcon, ThumbUpIcon } from "@heroicons/react/solid";
import { ethers } from "ethers";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { contractAddress } from "../config";
import Social from "../artifacts/contracts/Social.sol/Social.json";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const Post = ({
  content,
  postId,
  likes,
  imageAddress,
  disLikes,
  author,
  setLoading,
}) => {
  const [postAuthor, setPostAuthor] = useState("");
  const user = useSelector((state) => state.user);

  const likePost = async (postId) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, Social.abi, signer);

    const likePost = await contract.likePost(postId);
    likePost.wait();
    setLoading(true);
  };

  const disLikePost = async (postId) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, Social.abi, signer);

    const likePost = await contract.disLikePost(postId);
    likePost.wait();
    setLoading(true);
  };

  const fetchPostUser = async (userAddress) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, Social.abi, signer);

    const user = await contract.fetchPostUser(userAddress);

    setPostAuthor(user);
  };

  useEffect(() => {
    fetchPostUser(author);
  }, [user]);

  return (
    <div className="shadow-base-shadow hover:shadow-medium-shadow bg-[#2F2F2F] rounded-lg w-[100%] md:w-[450px] mb-10">
      <div className="flex items-center justify-between p-4">
        <div className=" flex ">
          <Link href="/profile">
            <img
              src={
                postAuthor[2]
                  ? postAuthor[2]
                  : "https://cdn.dribbble.com/users/1577045/screenshots/4914645/media/5146d1dbf9146c4d12a7249e72065a58.png"
              }
              alt=""
              className="w-8 h-8 object-cover rounded-full mr-2 cursor-pointer shadow"
            />
          </Link>
          <h1 className="font-bold text-lg">
            {postAuthor[1] ? postAuthor[1] : "User"}
          </h1>
        </div>
        <div className="">
          <h1 className="text-xs">20-feburary-2022</h1>
        </div>
      </div>
      <div className="">
        <h1 className="text-xl font-semibold mx-4 my-2 ">{content}</h1>
        <img src={imageAddress} alt="" className="w-full h-auto object-cover" />
      </div>
      <div className="p-4 flex items-center justify-between">
        <div className="flex-1 flex">
          <div className="flex flex-col">
            <ThumbUpIcon
              onClick={() => likePost(postId)}
              className={`w-7 ${
                likes > 0 ? "text-[#2196f3]" : "text-gray-400"
              } hover:text-[#2196f3] cursor-pointer mr-2`}
            />
            <h1 className="ml-[10px] font-semibold text-lg">{likes}</h1>
          </div>
          <div>
            <ThumbDownIcon
              onClick={() => disLikePost(postId)}
              className={`w-7 ${
                disLikes > 0 ? "text-[#ff5a5f]" : "text-gray-400"
              } text-gray-400 hover:text-[#ff5a5f] cursor-pointer`}
            />
            <h1 className="ml-[10px] font-semibold text-lg">{disLikes}</h1>
          </div>
        </div>
        <div className="flex-1 text-right">
          <h1 className="font-bold text-md ">Comments</h1>
        </div>
      </div>
    </div>
  );
};

export default Post;
