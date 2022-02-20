import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Feed from "../components/Feed";
import Friends from "../components/Friends";
import { contractAddress } from "../config";
import CreatePost from "./CreatePost";
import Social from "../artifacts/contracts/Social.sol/Social.json";
import { useEffect, useState } from "react";
import { CameraIcon, PencilAltIcon, PencilIcon } from "@heroicons/react/solid";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { actionCreators } from "../redux/index";
import { bindActionCreators } from "redux";

const Profile = () => {
  const [profileImg, setProfileImg] = useState(null);
  const [userName, setUserName] = useState("");
  const [cameraIcon, setCameraIcon] = useState(false);
  const [pencilIcon, setPencilIcon] = useState(false);
  const [loading, setLoading] = useState(false);
  const client = ipfsHttpClient("https://ipfs.infura.io:5001/");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { addUser, removeUser } = bindActionCreators(actionCreators, dispatch);

  const updateUser = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, Social.abi, signer);

    if (profileImg) {
      setLoading(true);
      const added = await client.add(profileImg, {
        progress: (prog) => console.log("Received:", prog),
      });

      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      await contract.updateUserImage(url);
      setLoading(false);
    } else if (userName) {
      userName && (await contract.updateUserName(userName));
    }

    const user = await contract.fetchUser();
    addUser(user);

    setProfileImg(null);
    setUserName("");
    setPencilIcon(false);
  };

  return (
    <div>
      <div className="relative flex justify-center items-center flex-col">
        <img
          className="w-full h-[300px] object-cover"
          src="https://images.unsplash.com/photo-1623085684060-5de6da56a3e5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          alt=""
        />
        <img
          onClick={() => setCameraIcon(!cameraIcon)}
          className="w-40 h-40 rounded-full bg-[#272727]  object-cover absolute bottom-[-80px] border-4 border-[#202020] shadow-base-shadow "
          src={
            user[2] && !loading
              ? user[2]
              : user[2] && loading
              ? "/loading.gif"
              : "https://cdn.dribbble.com/users/1577045/screenshots/4914645/media/5146d1dbf9146c4d12a7249e72065a58.png"
          }
          alt=""
        />
        <label
          onMouseLeave={() => setCameraIcon(false)}
          onClick={() => profileImg && updateUser()}
          className={`${
            cameraIcon ? "inline-flex" : "hidden"
          } cursor-pointer absolute -bottom-[75px] bg-[#272727] bg-opacity-50 rounded-full p-9`}
          htmlFor="profileImg"
        >
          <CameraIcon className="w-20 h-20" />
        </label>
        <input
          onChange={(e) => {
            setProfileImg(e.target.files[0]);
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
            {user[1] ? user[1] : "User"}
          </h1>
        ) : (
          <input
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            type="text"
            placeholder={user[1] ? user[1] : "User"}
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
