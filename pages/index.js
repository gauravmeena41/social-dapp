import Head from "next/head";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Feed from "../components/Feed";
import Navbar from "../components/Navbar";
import { createAndFetchUser } from "../helper";
import { actionCreators } from "../redux";

export default function Home() {
  const dispatch = useDispatch();

  const { addUser } = bindActionCreators(actionCreators, dispatch);

  useEffect(async () => {
    try {
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
      console.log("error:", error);
    }
  }, []);

  return (
    <div className="h-screen">
      <Head>
        <title>Social app</title>
      </Head>
      <Navbar />
      <div className="flex-1 flex items-center justify-center mt-24">
        <Feed />
      </div>
    </div>
  );
}
