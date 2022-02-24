import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../redux/index";
import { useState } from "react";
import Image from "next/image";
import { SearchIcon } from "@heroicons/react/outline";
import { createAndFetchUser, getWeb3Modal } from "../helper";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [searchId, setSearchId] = useState("");

  const { addUser, removeUser } = bindActionCreators(actionCreators, dispatch);

  const connect = async () => {
    try {
      const web3Modal = await getWeb3Modal();
      await web3Modal.connect();
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
      console.log("error:", error);
    }
  };

  return (
    <nav className="shadow bg-[#242526] flex items-center justify-around h-12 fixed z-[2] top-0 left-0 right-0">
      <div className="flex-1 flex justify-center">
        <Link href="/">
          <a className="text-2xl font-bold">SOCIAL</a>
        </Link>
      </div>
      <div className="flex-1 relative flex items-center">
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Search for people..."
          className="w-full rounded-full outline-none px-2 py-[3px] bg-[#3A3B3C] hover:bg-[#4E4F50]"
        />
        <Link href={`/search/${searchId}`}>
          <button className="absolute rounded-tr-full rounded-br-full top-1 right-2">
            <SearchIcon className="w-[1.3rem] h-[1.3rem] " />
          </button>
        </Link>
      </div>
      <div className="flex-1 flex justify-center">
        {Object.keys(user).length > 0 ? (
          <Link
            href="/profile"
            onClick={() => removeUser()}
            className="font-semibold uppercase"
          >
            <div className="flex items-center space-x-2 cursor-pointer">
              <Image
                src={
                  user.profileImg
                    ? user.profileImg
                    : "https://cdn.dribbble.com/users/1577045/screenshots/4914645/media/5146d1dbf9146c4d12a7249e72065a58.png"
                }
                width={"32px"}
                height={"32px"}
                className="rounded-full object-cover"
              />
              <h1 className="font-semibold">
                {user.name ? user.name : "User"}
              </h1>
            </div>
          </Link>
        ) : (
          <button onClick={connect} className="font-semibold uppercase">
            Log in
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
