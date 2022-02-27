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
import { createAndFetchUser, fetchSingleUser, updateUser } from "../helper";
import { useRouter } from "next/router";
import Image from "next/image";

const Profile = ({ currentUserId }) => {
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
  const [currentUser, setCurrentUser] = useState({});

  const { addUser, removeUser } = bindActionCreators(actionCreators, dispatch);

  useEffect(async () => {
    try {
      const user = await fetchSingleUser(currentUserId);
      const currentUser = {
        userId: user[0],
        name: user[1],
        desc: user[2] !== "" ? user[2] : "User description",
        profileImg:
          user[3] !== ""
            ? user[3]
            : "https://cdn.dribbble.com/users/1577045/screenshots/4914645/media/5146d1dbf9146c4d12a7249e72065a58.png",
        coverImg:
          user[4] !== ""
            ? user[4]
            : "https://images.unsplash.com/photo-1623085684060-5de6da56a3e5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
        posts: user[5],
        friends: user[6],
      };
      setCurrentUser(currentUser);
    } catch (error) {}
  }, [currentUserId]);

  return (
    <div>
      <div className="relative flex justify-center items-center flex-col w-[100%]">
        <div className="w-full">
          <div className="w-[100%] h-[300px]">
            <img
              onClick={() =>
                currentUser.userId === user.userId &&
                setCoverCameraIcon(!coverCameraIcon)
              }
              src={
                currentUser.coverImg
                  ? currentUser.coverImg
                  : user.coverImg && !uploadingCover
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
                currentUser.userId === user.userId &&
                  (await updateUser(e.target.files[0], "cover"));
                let user = await createAndFetchUser();
                const currentUser = {
                  userId: user[0],
                  name: user[1],
                  desc: user[2],
                  profileImg: user[3],
                  coverImg: user[4],
                  posts: user[5],
                  friends: user[6],
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
            onClick={() =>
              currentUser.userId === user.userId && setProfileCameraIcon(true)
            }
            src={
              currentUser.profileImg
                ? currentUser.profileImg
                : user.profileImg && !uploadingProfile
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
                desc: user[2],
                profileImg: user[3],
                coverImg: user[4],
                posts: user[5],
                friends: user[6],
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
            onClick={() =>
              currentUser.userId === user.userId &&
              setChangeUsername(!changeUsername)
            }
            className=" text-2xl font-bold"
          >
            {currentUser.name ? currentUser.name : "User"}
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
                    desc: user[2],
                    profileImg: user[3],
                    coverImg: user[4],
                    posts: user[5],
                    friends: user[6],
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
            onClick={() =>
              currentUser.userId === user.userId && setChangeUserDesc(true)
            }
            className=" text-xs"
          >
            {currentUser.desc
              ? currentUser.desc
              : user.desc
              ? user.desc
              : "User description"}
          </p>
        ) : (
          <input
            onChange={(e) => setUserDesc(e.target.value)}
            value={userDesc}
            type="text"
            placeholder={user.desc ? user.desc : "User description"}
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
                  await updateUser("", "", "", userDesc);
                  let user = await createAndFetchUser();
                  const currentUser = {
                    userId: user[0],
                    name: user[1],
                    desc: user[2],
                    profileImg: user[3],
                    coverImg: user[4],
                    posts: user[5],
                    friends: user[6],
                  };
                  console.log(currentUser);
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
          <div
            className={`${
              currentUser.userId === user.userId ? "block" : "hidden"
            }`}
          >
            <CreatePost />
          </div>
          <Feed currentUserPosts={currentUser.posts} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
