import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Profile from "../components/Profile";

const profile = () => {
  const user = useSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    Object.keys(user).length <= 0 && router.push("/");
  }, []);

  return (
    <div className="flex justify-center">
      <Navbar />
      <div className="w-[100%] lg:w-[70%]">
        <Profile />
      </div>
    </div>
  );
};

export default profile;
