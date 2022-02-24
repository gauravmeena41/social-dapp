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
import { createAndFetchUser, updateUser } from "../helper";
import { useRouter } from "next/router";
import Image from "next/image";

const Profile = () => {
  const [userName, setUserName] = useState("");
  const [profileCameraIcon, setProfileCameraIcon] = useState(false);
  const [coverCameraIcon, setCoverCameraIcon] = useState(false);
  const [pencilIcon, setPencilIcon] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user);

  const { addUser, removeUser } = bindActionCreators(actionCreators, dispatch);

  return (
    <div>
      <div className="relative flex justify-center items-center flex-col">
        <div className="w-full">
          <div className="w-[100%] h-[300px]">
            <Image
              onClick={() => setCoverCameraIcon(!coverCameraIcon)}
              src={
                user.coverImg && !uploadingCover
                  ? user.coverImg
                  : user.coverImg && uploadingCover
                  ? "/loading.gif"
                  : "https://images.unsplash.com/photo-1623085684060-5de6da56a3e5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
              }
              alt=""
              layout="fill"
              className="object-cover"
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
              router.push("/");
            }}
            className="hidden"
            type="file"
            id="coverImg"
          />
        </div>

        <div className="w-40 h-40 rounded-full bg-[#272727]  absolute bottom-[-80px] border-4 border-[#202020] shadow-base-shadow">
          <Image
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
            layout="fill"
            className="object-cover rounded-full"
          />
        </div>

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
          onChange={async (e) => {
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
            router.push("/");
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
              onClick={async () => {
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
                router.push("/");
                setPencilIcon(false);
                setUserName("");
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
