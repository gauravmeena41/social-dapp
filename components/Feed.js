import React, { useEffect, useState } from "react";
import Post from "./Post";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getContract } from "../helper";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const user = useSelector((state) => state.user);
  const router = useRouter();

  const fetchPost = async () => {
    try {
      const contract = await getContract();

      let posts = await contract.fetchPosts();

      router.asPath === "/" && Object.keys(user).length > 0
        ? setPosts(posts)
        : router.asPath === "/profile"
        ? setPosts(user.posts)
        : setPosts([]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [Object.keys(user).length > 0]);

  return (
    <div
      className={`pb-16 md:px-0 ${
        posts?.length > 0
          ? `grid  ${
              router.asPath === "/profile"
                ? "md:grid-cols-2"
                : "sm:grid-cols-2 lg:grid-cols-3"
            } gap-5`
          : "flex"
      } overflow-scroll scrollbar-hide mx-5`}
    >
      {posts?.length > 0 ? (
        posts?.map((post) => (
          <Post
            key={post.postId._hex}
            postId={post.postId.toNumber()}
            likes={post.likes.length}
            disLikes={post.disLikes.length}
            content={post.content}
            imageAddress={post.imageAddress}
            author={post.author}
            postTime={post.postTime}
          />
        ))
      ) : (
        <div>
          <h1 className="text-3xl place-self-center font-semibold">
            Are you lost?
          </h1>
        </div>
      )}
    </div>
  );
};

export default Feed;
