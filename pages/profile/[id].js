import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import Profile from "../../components/Profile";

const userProfile = () => {
  const user = useSelector((state) => state.user);
  const router = useRouter();
  const { id: currentUserId } = router.query;

  useEffect(() => {
    Object.keys(user).length <= 0 && router.push("/");
  }, []);

  return (
    <div className="flex justify-center">
      <Navbar />
      <div className="w-[100%] lg:w-[70%]">
        <Profile currentUserId={currentUserId} />
      </div>
    </div>
  );
};

export default userProfile;
