import {
  DotsVerticalIcon,
  MenuIcon,
  ThumbDownIcon,
  ThumbUpIcon,
} from "@heroicons/react/outline";
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
import CreatePost from "../components/CreatePost";

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
  const [editPost, setEditPost] = useState(false);

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
  }, [author]);

  return (
    <>
      {editPost ? (
        <div
          className={`${
            editPost ? "inline-flex" : "hidden"
          } flex flex-col items-center`}
        >
          <CreatePost
            postId={postId}
            content={content}
            editPost={editPost}
            setEditPost={setEditPost}
          />
          <button
            onClick={() => setEditPost(false)}
            className="bg-red-500 px-8 py-1 font-bold rounded-lg shadow-base-shadow hover:shadow-medium-shadow"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="shadow-base-shadow hover:shadow-medium-shadow bg-[#242526] rounded-lg">
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
                    alt=""
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
              <h1 className="text-sm">
                <span className="sm:hidden">
                  {moment(postTime.toNumber() * 1000).format("LLL")}
                </span>
                <span className="hidden sm:inline-block">
                  {moment(postTime.toNumber() * 1000).format("LL")}
                </span>
              </h1>
            </div>
            <div>
              <DotsVerticalIcon
                className="w-6 h-6 cursor-pointer"
                onClick={() => setEditPost(true)}
              />
            </div>
          </div>

          <div className="">
            <h1 className="text-lg mx-4 my-2 ">{content}</h1>
            {/* <div className="w-[100%] h-auto">
          <Image
            src={imageAddress}
            alt=""
            width={550}
            height={250}
            className="object-cover"
          />
        </div> */}
            <img
              src={imageAddress}
              alt=""
              className="w-[450px] h-auto object-cover"
            />
          </div>
          <div className="p-2 flex items-center justify-between space-x-1">
            <div
              onClick={async () => {
                try {
                  await likePost(postId);
                  window.location.reload();
                } catch (error) {
                  console.log(error);
                }
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
              onClick={async () => {
                try {
                  await disLikePost(postId);
                  window.location.reload();
                } catch (error) {
                  console.log(error);
                }
              }}
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
      )}
    </>
  );
};

export default Post;
