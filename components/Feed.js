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

    user.posts
      ? router.asPath === "/"
        ? setPosts(posts)
        : setPosts(user.posts)
      : setPosts([]);

    !posts && setPosts([]);
  };

  useEffect(() => {
    setLoading(true);
    fetchPost();
    setLoading(false);
  }, [loading, user]);

  return (
    <div className="pt-10  pb-16 md:px-0 flex flex-col items-center h-screen overflow-y-scroll scrollbar-hide">
      {posts ? (
        posts?.map((post) => (
          <Post
            key={post.postId._hex}
            postId={post.postId.toNumber()}
            likes={post.likes.length}
            disLikes={post.disLikes.length}
            content={post.content}
            imageAddress={post.imageAddress}
            author={post.author}
            setLoading={setLoading}
          />
        ))
      ) : (
        <h1 className="text-3xl font-semibold">Are you lost?</h1>
      )}
    </div>
  );
};

export default Feed;
