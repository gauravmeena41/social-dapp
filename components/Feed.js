import React, { useEffect, useState } from "react";
import Post from "./Post";
import Web3Modal from "web3modal";
import Social from "../artifacts/contracts/Social.sol/Social.json";
import { contractAddress } from "../config";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const router = useRouter();

  const fetchPost = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(contractAddress, Social.abi, signer);

    let posts = await contract.fetchPosts();

    router.asPath === "/" ? setPosts(posts) : setPosts(user[3]);
  };

  useEffect(() => {
    fetchPost();
  }, [loading]);

  return (
    <div className="pt-10  pb-16 md:px-0 flex flex-col items-center h-screen overflow-y-scroll scrollbar-hide">
      {posts?.map((post) => (
        <Post
          key={post.postId._hex}
          postId={post.postId.toNumber()}
          likes={post.likes.length}
          disLikes={post.disLikes.length}
          content={post[2]}
          imageAddress={post.imageAddress}
          author={post.author}
          setLoading={setLoading}
        />
      ))}
    </div>
  );
};

export default Feed;
