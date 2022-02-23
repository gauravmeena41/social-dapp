const { ethers } = require("hardhat");

describe("Social", function () {
  // it("Should create a post", async () => {
  //   const Social = await ethers.getContractFactory("Social");
  //   const social = await Social.deploy();
  //   await social.deployed();
  //   console.log("Social deployed", social.address);
  //   await social.createPost(
  //     "This is the first post.",
  //     "https://images.unsplash.com/photo-1645149837391-f548b61af03d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
  //   );
  //   // await social.createPost("This is the second post.");
  //   const posts = await social.fetchPosts();
  //   console.log(posts);
  // });
  // it("Should edit a post", async () => {
  //   const Social = await ethers.getContractFactory("Social");
  //   const social = await Social.deploy();
  //   await social.deployed();
  //   console.log("Social deployed", social.address);
  //   await social.createPost(
  //     "This is the first post.",
  //     "https://images.unsplash.com/photo-1645149837391-f548b61af03d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
  //   );
  //   await social.createPost(
  //     "This is the second post.",
  //     "https://images.unsplash.com/photo-1645149837391-f548b61af03d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
  //   );
  //   let posts = await social.fetchPosts();
  //   console.log(posts);
  //   await social.updatePost(1, "This is the updated first post.");
  //   posts = await social.fetchPosts();
  //   console.log(posts);
  // });
  // it("Should like a post", async () => {
  //   const Social = await ethers.getContractFactory("Social");
  //   const social = await Social.deploy();
  //   await social.deployed();
  //   console.log("Social deployed", social.address);
  //   posts = await social.fetchPosts();
  //   await social.createPost("This is the first post.", "dcdcsd");
  //   await social.createPost("This is the second post.", "scscs");
  //   let user = await social.fetchUser();
  //   await social.likePost(2);
  //   await social.likePost(1);
  //   await social.likePost(2);
  //   console.log(user[4][0]);
  //   posts = await social.fetchPosts();
  //   console.log(posts);
  // });
  // it("Should disLike a post", async () => {
  //   const Social = await ethers.getContractFactory("Social");
  //   const social = await Social.deploy();
  //   await social.deployed();
  //   console.log("Social deployed", social.address);
  //   posts = await social.fetchPosts();
  //   await social.createPost("This is the first post.", "dcdcsd");
  //   await social.createPost("This is the second post.", "dcdcsd");
  //   await social.disLikePost(2);
  //   await social.disLikePost(1);
  //   await social.disLikePost(2);
  //   posts = await social.fetchPosts();
  //   console.log(posts);
  // });
  // it("Should create a user", async () => {
  //   const Social = await ethers.getContractFactory("Social");
  //   const social = await Social.deploy();
  //   await social.deployed();
  //   console.log("Social deployed", social.address);
  //   await social.createUser();
  //   await social.createPost("This is the second post.", "scscs");
  //   await social.createPost("This is the second post.", "scscs");
  //   const posts = await social.fetchPosts();
  //   const user = await social.fetchUser();
  //   console.log(user);
  //   console.log(posts);
  // });
  // it("Should update the user", async () => {
  //   const Social = await ethers.getContractFactory("Social");
  //   const social = await Social.deploy();
  //   await social.deployed();
  //   console.log("Social deployed", social.address);
  //   await social.createUser();
  //   await social.updateUserCoverImage(
  //     "https://images.unsplash.com/photo-1645149837391-f548b61af03d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
  //   );
  //   const user = await social.fetchUser();
  //   console.log(user);
  // });
});
