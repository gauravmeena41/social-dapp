//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/utils/Counters.sol";

contract Social {
  address private owner;

  using Counters for Counters.Counter;
  Counters.Counter private _postIds;

  struct User {
    address user;
    string name;
    string desc;
    string imageAddress;
    string coverImageAddress;
    Post[] posts;
    string[] friends;
  }

  struct Post {
    uint256 postId;
    address author;
    string content;
    string imageAddress;
    address[] likes;
    address[] disLikes;
    uint256 postTime;
  }

  mapping(address => User) private users;
  mapping(uint256 => Post) private idToPost;

  event PostCreated(
    uint256 postId,
    address indexed author,
    string indexed content
  );
  event PostUpdated(
    uint256 postId,
    address indexed author,
    string indexed content
  );

  event PostLiked(uint256 postId, address indexed liker);
  event PostDisLiked(uint256 postId, address indexed disLiker);

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  constructor() {
    owner = msg.sender;
  }

  function createUser() external {
    User storage user = users[msg.sender];
    user.user = msg.sender;
  }

  function updateUserImage(string memory _imageAddress) external {
    User storage user = users[msg.sender];
    user.imageAddress = _imageAddress;
  }

  function updateUserCoverImage(string memory _coverImage) external {
    User storage user = users[msg.sender];
    user.coverImageAddress = _coverImage;
  }

  function updateUserName(string memory _name) external {
    User storage user = users[msg.sender];
    user.name = _name;
  }

  function updateUserDesc(string memory _desc) external {
    User storage user = users[msg.sender];
    user.desc = _desc;
  }

  function fetchUser()
    external
    view
    returns (
      address,
      string memory,
      string memory,
      string memory,
      string memory,
      Post[] memory,
      string[] memory
    )
  {
    return (
      users[msg.sender].user,
      users[msg.sender].name,
      users[msg.sender].desc,
      users[msg.sender].imageAddress,
      users[msg.sender].coverImageAddress,
      users[msg.sender].posts,
      users[msg.sender].friends
    );
  }

  function fetchSingleUser(address _user)
    external
    view
    returns (
      address,
      string memory,
      string memory,
      string memory,
      string memory,
      Post[] memory,
      string[] memory
    )
  {
    return (
      users[_user].user,
      users[_user].name,
      users[_user].desc,
      users[_user].imageAddress,
      users[_user].coverImageAddress,
      users[_user].posts,
      users[_user].friends
    );
  }

  function createPost(string memory _content, string memory _imageAddress)
    external
  {
    require(bytes(_content).length > 0, "Content can't be empty.");
    _postIds.increment();
    uint256 postId = _postIds.current();
    Post storage post = idToPost[postId];

    post.postId = postId;
    post.author = msg.sender;
    post.content = _content;
    post.imageAddress = _imageAddress;
    post.postTime = block.timestamp;

    idToPost[postId] = post;

    emit PostCreated(postId, msg.sender, _content);

    User storage user = users[msg.sender];
    user.posts.push(post);
  }

  function updatePost(uint256 _postId, string memory _content) external {
    require(
      msg.sender == idToPost[_postId].author,
      "Only the author can edit the post."
    );
    require(bytes(_content).length > 0, "Content can't be empty.");

    Post storage post = idToPost[_postId];
    post.content = _content;
    idToPost[_postId] = post;

    emit PostUpdated(_postId, msg.sender, _content);
  }

  function likePost(uint256 _postId) external {
    require(
      _postId > 0 && _postId <= _postIds.current(),
      "Post does not exist."
    );
    Post storage post = idToPost[_postId];

    post.likes.push(msg.sender);

    emit PostLiked(_postId, msg.sender);
  }

  function disLikePost(uint256 _postId) external {
    require(
      _postId > 0 && _postId <= _postIds.current(),
      "Post does not exist."
    );
    Post storage post = idToPost[_postId];
    post.disLikes.push(msg.sender);
    emit PostDisLiked(_postId, msg.sender);
  }

  function fetchPosts() external view returns (Post[] memory) {
    uint256 itemCount = _postIds.current();
    uint256 currentIndex = 0;

    Post[] memory posts = new Post[](itemCount);

    for (uint256 i = itemCount; i > 0; i--) {
      Post storage currentItem = idToPost[i];
      posts[currentIndex] = currentItem;
      currentIndex++;
    }
    return posts.length > 0 ? posts : new Post[](0);
  }
}
