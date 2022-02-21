import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Feed from "../components/Feed";
import Friends from "../components/Friends";
import { contractAddress } from "../config";
import CreatePost from "./CreatePost";
import Social from "../artifacts/contracts/Social.sol/Social.json";
import { useState } from "react";
import { CameraIcon, PencilAltIcon, PencilIcon } from "@heroicons/react/solid";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { actionCreators } from "../redux/index";
import { bindActionCreators } from "redux";

const Profile = () => {
  const [userName, setUserName] = useState("");
  const [profileCameraIcon, setProfileCameraIcon] = useState(false);
  const [coverCameraIcon, setCoverCameraIcon] = useState(false);
  const [pencilIcon, setPencilIcon] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const client = ipfsHttpClient("https://ipfs.infura.io:5001/");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { addUser, removeUser } = bindActionCreators(actionCreators, dispatch);

  const updateUser = async (file, action) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, Social.abi, signer);

    let user = await contract.fetchUser();
    if (file && action === "profile") {
      setUploadingProfile(true);
      const added = await client.add(file, {
        progress: (prog) => console.log("Received:", prog),
      });

      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      await contract.updateUserImage(url);
      user = await contract.fetchUser();
      const currentUser = {
        userId: user[0],
        name: user[1],
        profileImg: user[2],
        coverImg: user[3],
        posts: user[4],
        friends: user[5],
      };
      addUser(currentUser);
      setUploadingProfile(false);
    } else if (userName) {
      userName && (await contract.updateUserName(userName));
      user = await contract.fetchUser();
      const currentUser = {
        userId: user[0],
        name: user[1],
        profileImg: user[2],
        coverImg: user[3],
        posts: user[4],
        friends: user[5],
      };
      addUser(currentUser);
    } else if (file && action === "cover") {
      setUploadingCover(true);
      const added = await client.add(file, {
        progress: (prog) => console.log("Received:", prog),
      });

      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      await contract.updateUserCoverImage(url);
      user = await contract.fetchUser();
      const currentUser = {
        userId: user[0],
        name: user[1],
        profileImg: user[2],
        coverImg: user[3],
        posts: user[4],
        friends: user[5],
      };
      addUser(currentUser);
      setUploadingCover(false);
    }

    setUserName("");
    setPencilIcon(false);
  };

  return (
    <div>
      <div className="relative flex justify-center items-center flex-col">
        <div className="w-full">
          <img
            onClick={() => setCoverCameraIcon(!coverCameraIcon)}
            className="w-full h-[300px] object-cover origin-bottom"
            src={
              user.coverImg && !uploadingCover
                ? user.coverImg
                : user.coverImg && uploadingCover
                ? "/loading.gif"
                : "https://images.unsplash.com/photo-1623085684060-5de6da56a3e5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            }
            alt=""
          />
          <label
            onMouseLeave={() => setCoverCameraIcon(false)}
            className={`${
              coverCameraIcon ? "inline-flex" : "hidden"
            } cursor-pointer absolute top-0 w-full h-[300px] flex justify-center bg-[#272727] bg-opacity-50 `}
            htmlFor="coverImg"
          >
            <CameraIcon className="w-40 cursor-pointer" />
          </label>
          <input
            onChange={(e) => {
              updateUser(e.target.files[0], "cover");
            }}
            className="hidden"
            type="file"
            id="coverImg"
          />
        </div>

        <img
          onClick={() => setProfileCameraIcon(!profileCameraIcon)}
          className="w-40 h-40 rounded-full bg-[#272727]  object-cover absolute bottom-[-80px] border-4 border-[#202020] shadow-base-shadow "
          src={
            user.profileImg && !uploadingProfile
              ? user.profileImg
              : (user.profileImg && uploadingProfile) ||
                (!user.profileImg && uploadingProfile)
              ? "/loading.gif"
              : "https://cdn.dribbble.com/users/1577045/screenshots/4914645/media/5146d1dbf9146c4d12a7249e72065a58.png"
          }
          alt=""
        />
        <label
          onMouseLeave={() => setProfileCameraIcon(false)}
          className={`${
            profileCameraIcon ? "inline-flex" : "hidden"
          } cursor-pointer absolute -bottom-[75px] bg-[#272727] bg-opacity-50 rounded-full p-9`}
          htmlFor="profileImg"
        >
          <CameraIcon className="w-20 h-20" />
        </label>
        <input
          onChange={(e) => {
            updateUser(e.target.files[0], "profile");
          }}
          className="hidden"
          type="file"
          id="profileImg"
        />
      </div>
      <div className="mt-24 flex flex-col items-center">
        {!pencilIcon ? (
          <h1
            onClick={() => setPencilIcon(!pencilIcon)}
            className=" text-2xl font-bold"
          >
            {user.name ? user.name : "User"}
          </h1>
        ) : (
          <input
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            type="text"
            placeholder={user.name ? user.name : "User"}
            className="bg-transparent border-2 border-gray-400 px-2 rounded-full"
          />
        )}
        {pencilIcon && (
          <div className="flex my-1">
            <button
              onClick={() => setPencilIcon(false)}
              className="text-sm bg-gray-600 px-2 py-[2px] font-semibold rounded-full mt-1 ml-2 "
            >
              Cancel
            </button>
            <button
              onClick={() => {
                userName && updateUser();
              }}
              className="text-sm bg-gray-600 px-2 py-[2px] font-semibold rounded-full mt-1 ml-2 "
            >
              Change
            </button>
          </div>
        )}
        <p className="text-gray-400 text-sm">Web Developer</p>
      </div>
      <div className="flex mt-10 ">
        <div className="flex-1 px-2 flex flex-col items-center border-r-2 border-[#272727] ">
          <CreatePost />
          <Feed />
        </div>
        <div className="flex-1">
          <Friends />
        </div>
      </div>
    </div>
  );
};

export default Profile;
