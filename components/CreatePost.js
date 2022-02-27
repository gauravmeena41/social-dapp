import { PhotographIcon, XCircleIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { createPost, updatePost } from "../helper";
import { useRouter } from "next/router";
import Image from "next/image";

const CreatePost = ({ postId, content = "", editPost, setEditPost }) => {
  const [file, setFile] = useState("");
  const [desc, setDesc] = useState(content);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  console.log(desc, postId, content);

  return (
    <div className="mx-2 my-5  p-5 rounded-lg shadow bg-[#242526] w-[450px] ">
      <form
        className="flex items-center justify-between"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          className="bg-[#3A3B3C] hover:bg-[#4E4F50] outline-none rounded-full px-2 py-1"
          placeholder="What's on your mind?"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <label htmlFor="file" className="cursor-pointer">
          <PhotographIcon className="w-8 h-8 text-green-600" />
        </label>
        <input
          type="file"
          id="file"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          type="submit"
          className="bg-[#0466c8] text-white px-4 py-[2px] rounded-full font-semibold"
          onClick={async () => {
            setLoading(true);
            try {
              editPost
                ? await updatePost(postId, desc)
                : await createPost(desc, file, postId);
            } catch (error) {
              console.log(error);
            }
            setLoading(false);
            editPost && setEditPost(false);
            router.push("/");
          }}
        >
          Post
        </button>
      </form>
      {file && (
        <div className="mt-4 relative flex justify-center">
          <div className="w-full h-[250px] ">
            <Image
              src={URL.createObjectURL(file)}
              alt=""
              layout="fill"
              className="object-cover rounded-lg"
            />
          </div>
          <XCircleIcon className="w-4 h-4 text-[#2f2f2f] absolute top-0 right-0 bg-white rounded-bl cursor-pointer" />
          {/* <img
            className={`absolute top-0 h-24 ${
              loading ? "inline-flex" : "hidden"
            }`}
            src="/loading.gif"
            alt=""
          /> */}
        </div>
      )}
    </div>
  );
};

export default CreatePost;
