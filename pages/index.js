import Head from "next/head";
import Feed from "../components/Feed";
import Friends from "../components/Friends";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="h-screen">
      <Head>
        <title>Social app</title>
      </Head>
      <Navbar />
      <div className="flex mt-16">
        <div className="flex-1 px-2 ">
          <Feed />
        </div>
        <div className="flex-1">
          <Friends />
        </div>
      </div>
    </div>
  );
}
