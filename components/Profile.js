import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Feed from "../components/Feed";
import { contractAddress } from "../config";
import CreatePost from "./CreatePost";
import Social from "../artifacts/contracts/Social.sol/Social.json";
import { useEffect, useState } from "react";
import {
  CameraIcon,
  PencilAltIcon,
  changeUsername,
} from "@heroicons/react/solid";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { actionCreators } from "../redux/index";
import { bindActionCreators } from "redux";
import { createAndFetchUser, updateUser } from "../helper";
import { useRouter } from "next/router";
import Image from "next/image";

const Profile = () => {
  const [userName, setUserName] = useState("");
  const [userDesc, setUserDesc] = useState("");
  const [profileCameraIcon, setProfileCameraIcon] = useState(false);
  const [coverCameraIcon, setCoverCameraIcon] = useState(false);
  const [changeUsername, setChangeUsername] = useState(false);
  const [changeUserDesc, setChangeUserDesc] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user);

  const { addUser, removeUser } = bindActionCreators(actionCreators, dispatch);

  return (
    <div>
      <div className="relative flex justify-center items-center flex-col w-[100%]">
        <div className="w-full">
          <div className="w-[100%] h-[300px]">
            <img
              onClick={() => setCoverCameraIcon(!coverCameraIcon)}
              src={
                user.coverImg && !uploadingCover
                  ? user.coverImg
                  : user.coverImg && uploadingCover
                  ? "/loading.gif"
                  : "https://images.unsplash.com/photo-1623085684060-5de6da56a3e5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
              }
              alt=""
              // layout="fill"
              className="object-cover w-full h-full"
            />
          </div>

          <label
            onMouseLeave={() => setCoverCameraIcon(false)}
            className={`${
              coverCameraIcon ? "inline-flex" : "hidden"
            } cursor-pointer absolute top-0 w-full h-[300px] flex justify-center bg-[#242526] bg-opacity-50`}
            htmlFor="coverImg"
          >
            <CameraIcon className="w-40 cursor-pointer" />
          </label>
          <input
            onChange={async (e) => {
              try {
                await updateUser(e.target.files[0], "cover");
                let user = await createAndFetchUser();
                const currentUser = {
                  userId: user[0],
                  name: user[1],
                  profileImg: user[2],
                  coverImg: user[3],
                  posts: user[4],
                  friends: user[5],
                };
                addUser(currentUser);
              } catch (error) {
                console.log(error);
              }
              router.push("/");
            }}
            className="hidden"
            type="file"
            id="coverImg"
          />
        </div>

        <div className="w-40 h-40 rounded-full bg-[#272727]  absolute bottom-[-80px] border-[3px] border-[#202020] shadow-base-shadow">
          <img
            onClick={() => setProfileCameraIcon(!profileCameraIcon)}
            src={
              user.profileImg && !uploadingProfile
                ? user.profileImg
                : (user.profileImg && uploadingProfile) ||
                  (!user.profileImg && uploadingProfile)
                ? "/loading.gif"
                : "https://cdn.dribbble.com/users/1577045/screenshots/4914645/media/5146d1dbf9146c4d12a7249e72065a58.png"
            }
            alt=""
            className=" w-40 h-40 object-cover rounded-full"
          />
        </div>

        <label
          onMouseLeave={() => setProfileCameraIcon(false)}
          className={`${
            profileCameraIcon ? "inline-flex" : "hidden"
          } cursor-pointer absolute -bottom-[86px] bg-[#272727] bg-opacity-50 rounded-full p-9`}
          htmlFor="profileImg"
        >
          <CameraIcon className="w-[90px] h-[90px]" />
        </label>
        <input
          onChange={async (e) => {
            try {
              setUploadingProfile(true);
              await updateUser(e.target.files[0], "profile");
              setUploadingProfile(false);
              let user = await createAndFetchUser();
              const currentUser = {
                userId: user[0],
                name: user[1],
                profileImg: user[2],
                coverImg: user[3],
                posts: user[4],
                friends: user[5],
              };
              addUser(currentUser);
            } catch (error) {
              console.log(error);
            }
            router.push("/");
          }}
          className="hidden"
          type="file"
          id="profileImg"
        />
      </div>
      <div className="mt-24 flex flex-col items-center">
        {!changeUsername ? (
          <h1
            onClick={() => setChangeUsername(!changeUsername)}
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
        {changeUsername && (
          <div className="flex my-1">
            <button
              onClick={() => setChangeUsername(false)}
              className="text-sm bg-gray-600 px-2 py-[2px] font-semibold rounded-full mt-1 ml-2 "
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  await updateUser("", "", userName);
                  let user = await createAndFetchUser();
                  const currentUser = {
                    userId: user[0],
                    name: user[1],
                    profileImg: user[2],
                    coverImg: user[3],
                    posts: user[4],
                    friends: user[5],
                  };
                  addUser(currentUser);
                  setChangeUsername(false);
                  setUserName("");
                } catch (error) {
                  console.log(error);
                }
                router.push("/");
              }}
              className="text-sm bg-gray-600 px-2 py-[2px] font-semibold rounded-full mt-1 ml-2 "
            >
              Change
            </button>
          </div>
        )}
        {!changeUserDesc ? (
          <p
            onClick={() => setChangeUserDesc(!changeUserDesc)}
            className=" text-xs"
          >
            {user.desc ? user.desc : "User description"}
          </p>
        ) : (
          <input
            onChange={(e) => setUserName(e.target.value)}
            value={userDesc}
            type="text"
            placeholder={user.desc ? user.desc : "User"}
            className="bg-transparent border-2 border-gray-400 px-2 rounded-full"
          />
        )}
        {changeUserDesc && (
          <div className="flex my-1">
            <button
              onClick={() => setChangeUserDesc(false)}
              className="text-sm bg-gray-600 px-2 py-[2px] font-semibold rounded-full mt-1 ml-2 "
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  await updateUser("", "", userDesc);
                  let user = await createAndFetchUser();
                  const currentUser = {
                    userId: user[0],
                    name: user[1],
                    profileImg: user[2],
                    coverImg: user[3],
                    posts: user[4],
                    friends: user[5],
                  };
                  addUser(currentUser);
                  setChangeUsername(false);
                  setUserName("");
                } catch (error) {
                  console.log(error);
                }
                router.push("/");
              }}
              className="text-sm bg-gray-600 px-2 py-[2px] font-semibold rounded-full mt-1 ml-2 "
            >
              Change
            </button>
          </div>
        )}
      </div>
      <div className="flex mt-10 ">
        <div className="flex-1 px-2 flex flex-col items-center ">
          <CreatePost />
          <Feed />
        </div>
      </div>
    </div>
  );
};

export default Profile;
