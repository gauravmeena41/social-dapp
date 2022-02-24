import { ThumbDownIcon, ThumbUpIcon } from "@heroicons/react/outline";
import { ethers } from "ethers";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { contractAddress } from "../config";
import Social from "../artifacts/contracts/Social.sol/Social.json";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { likePost, disLikePost } from "../helper";
import moment from "moment";
import Image from "next/image";

const Post = ({
  content,
  postId,
  likes,
  imageAddress,
  disLikes,
  author,
  postTime,
}) => {
  const [postAuthor, setPostAuthor] = useState("");

  const fetchPostUser = async (userAddress) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, Social.abi, signer);

    const user = await contract.fetchSingleUser(userAddress);

    const currentUser = {
      userId: user[0],
      name: user[1],
      profileImg: user[2],
      coverImg: user[3],
      posts: user[4],
      friends: user[5],
    };

    setPostAuthor(currentUser);
  };

  useEffect(() => {
    fetchPostUser(author);
  }, []);

  return (
    <div className="shadow-base-shadow hover:shadow-medium-shadow bg-[#242526] rounded-lg w-[100%] mb-10">
      <div className="flex items-center justify-between p-2 pt-4 md:p-4 border-b border-[#4a4e69]">
        <div className=" flex ">
          <Link href="/profile">
            <div className="mr-2">
              <Image
                src={
                  postAuthor.profileImg
                    ? postAuthor.profileImg
                    : "https://cdn.dribbble.com/users/1577045/screenshots/4914645/media/5146d1dbf9146c4d12a7249e72065a58.png"
                }
                // layout="fill"
                width={"28px"}
                height={"28px"}
                className=" object-cover rounded-full cursor-pointer shadow"
              />
            </div>
          </Link>
          <h1 className="font-semibold text-lg ">
            {postAuthor.name ? postAuthor.name : "User"}
          </h1>
        </div>
        <div>
          <h1 className="text-sm hidden sm:inline-flex">
            {moment(postTime.toNumber() * 1000).format("LLL")}
          </h1>
        </div>
      </div>
      <div className="">
        <h1 className="text-lg mx-4 my-2 ">{content}</h1>
        <div className="w-[100%] h-auto">
          <Image
            src={imageAddress}
            width={400}
            height={250}
            className="object-cover"
          />
        </div>
        {/* <img src={imageAddress} alt="" className="w-full h-auto object-cover" /> */}
      </div>
      <div className="p-2 flex items-center justify-between space-x-1">
        <div
          onClick={async () => {
            await likePost(postId);
            window.location.reload();
          }}
          className="flex items-center justify-center w-full hover:bg-[#3A3B3C] p-2
          rounded-lg cursor-pointer transition duration-200"
        >
          <ThumbUpIcon
            className={`w-5 ${
              likes > 0 ? "text-[#4292FF]" : "text-gray-400"
            }  `}
          />
          <h1 className="ml-[10px]  text-xs ">Like</h1>
        </div>
        <div
          onClick={() => disLikePost(postId)}
          className="flex items-center justify-center w-full hover:bg-[#3A3B3C] p-2 rounded-lg cursor-pointer transition duration-200"
        >
          <ThumbDownIcon
            className={`w-5 ${
              disLikes > 0 ? "text-[#ff6d72]" : "text-gray-400"
            } text-gray-400`}
          />
          <h1 className="ml-[10px]  text-xs ">Dislike</h1>
        </div>
      </div>
    </div>
  );
};

export default Post;
