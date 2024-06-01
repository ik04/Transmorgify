"use client";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

const page = () => {
  const [link, setLink] = useState("");

  const isValidYouTubeLink = (url) => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  };

  const convert = async () => {
    try {
      if (link === "" || link === null) {
        toast.warning("Please Enter your Link!");
        return;
      }

      if (!isValidYouTubeLink(link)) {
        toast.error("Please Enter a valid YouTube link!");
        return;
      }

      const resp = await axios.post(
        `${process.env.NEXT_PUBLIC_PUBLIC_DOMAIN}/convert`,
        { link }
      );
      console.log(resp);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="">
      <div className="h-screen bg-main flex flex-col space-y-3 justify-center items-center">
        <div className="title flex justify-center items-center gap-3">
          <Image src={"/assets/wave-2.svg"} width={100} height={100} />
          <h1 className="text-stroke-xl font-display md:text-[120px] text-center text-main text-stroke-heliotrope uppercase tracking-widest">
            Transmorgify
          </h1>
          <Image src={"/assets/wave-2.svg"} width={100} height={100} />
        </div>
        <div className="slogan font-base text-mediumSlateBlue text-center md:text-5xl">
          “Morph your <span className="font-display uppercase">links</span> into
          melody”
        </div>
        <div className="bg-gradient-to-br  from-[#CF5FCD] via-[#CF5FCD] via-40% to-mediumSlateBlue md:h-28 md:w-[63%] rounded-full flex items-center px-5">
          <label htmlFor="link">
            <Image
              src={"/assets/link.svg"}
              className="mt-1"
              width={70}
              height={70}
            />
          </label>
          <input
            id="link"
            type="text"
            name="link"
            placeholder="Enter your Link here"
            className="bg-transparent w-full md:text-3xl px-2 focus:outline-none font-display placeholder:text-main placeholder:font-display placeholder:font-bold"
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
