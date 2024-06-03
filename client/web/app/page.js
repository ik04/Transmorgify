"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

const page = () => {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [embedLink, setEmbedLink] = useState("");
  const [download, setDownload] = useState("");
  const [title, setTitle] = useState("");

  const resultRef = useRef(null);

  const isValidYouTubeLink = (url) => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    const youtubeMusicRegex = /^(https?:\/\/)?(music\.)?(youtube\.com)\/.+$/;
    return youtubeRegex.test(url) || youtubeMusicRegex.test(url);
  };
  const convertYouTubeMusicLink = (url) => {
    const urlObj = new URL(url);
    if (urlObj.hostname === "music.youtube.com") {
      urlObj.hostname = "youtube.com";
    }
    return urlObj.toString();
  };
  const callConvertEndpoint = async () => {
    const convertedLink = convertYouTubeMusicLink(link);
    const resp = await axios.post(
      `${process.env.NEXT_PUBLIC_PUBLIC_DOMAIN}/convert`,
      { link: convertedLink },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    console.log(resp.data);
    setDownload(resp.data.result.url);
    setTitle(resp.data.result.title);
  };

  const getYouTubeEmbedUrl = (url) => {
    const urlObj = new URL(url);
    if (urlObj.hostname === "youtu.be") {
      return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
    }
    const params = new URLSearchParams(urlObj.search);
    return `https://www.youtube.com/embed/${params.get("v")}`;
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
      toast.promise(callConvertEndpoint, {
        loading: "Morphing...",
        success: () => {
          setEmbedLink(getYouTubeEmbedUrl(link));
          setLoading(false);
          setTimeout(() => {
            resultRef.current.scrollIntoView({ behavior: "smooth" });
          }, 500);
          return `Video has been Morphed!`;
        },
        error: (error) => {
          setLoading(false);
          console.error(error);
          if (error.response && error.response.status === 404) {
            setLoading(true);
            return "Video not found!";
          } else {
            setLoading(true);
            return `${error.response.data.message}`;
          }
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-main">
      <div className="h-screen flex flex-col justify-center items-center md:space-y-16 space-y-4">
        <div className="title-and-slogan flex flex-col justify-center items-center space-y-3 md:space-y-10">
          <div className="title flex justify-center items-center gap-3">
            <Image
              src={"/assets/wave-2.svg"}
              className="skew-x-12 w-10 md:w-28"
              width={100}
              height={100}
            />
            <h1 className="md:text-stroke-xl text-stroke-base font-display md:text-[120px] text-2xl text-center text-main text-stroke-heliotrope uppercase tracking-widest">
              Transmorgify
            </h1>
            <Image
              src={"/assets/wave-2.svg"}
              className="-skew-x-12 w-10 md:w-28"
              width={100}
              height={100}
            />
          </div>
          <div className="slogan font-base text-mediumSlateBlue text-center md:text-5xl text-lg">
            “Morph your <span className="uppercase">links</span> into melody”
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#CF5FCD] via-[#CF5FCD] via-40% to-mediumSlateBlue md:h-28 md:w-[63%] w-[90%] rounded-full flex items-center px-3 md:px-5">
          <label htmlFor="link">
            <Image
              src={"/assets/link.svg"}
              className="md:mt-1 w-16 md:w-20"
              width={70}
              height={70}
            />
          </label>
          <input
            id="link"
            value={link}
            type="text"
            name="link"
            placeholder="Enter your Link here"
            className="bg-transparent w-full md:text-3xl px-2 text-sm focus:outline-none font-display font-bold placeholder:text-main placeholder:font-display placeholder:font-bold"
            onChange={(e) => setLink(e.target.value)}
          />
          <div
            onClick={convert}
            className="convert md:mb-2 flex items-center cursor-pointer"
          >
            <h2 className="text-stroke-base md:text-stroke-lg text-transparent text-stroke-main font-base text-sm md:text-3xl">
              Morph
            </h2>
            <Image
              src={"/assets/double-arrow.svg"}
              className="md:mt-1 w-14 md:w-20"
              width={70}
              height={70}
            />
          </div>
        </div>
        <div className="text-pinkMagenta capitalize text-center w-[80%] text-xs font-display md:text-lg font-light">
          Disclaimer: the site supports youtube and youtube music links only
        </div>
      </div>
      {loading && (
        <>
          <div
            ref={resultRef}
            className="h-screen flex flex-col items-center justify-center space-y-10"
          >
            <div className="title flex justify-center items-center">
              <Image
                src={"/assets/wave-1.svg"}
                className="skew-x-12 w-12 md:w-28"
                width={100}
                height={100}
              />
              <h1 className="uppercase bg-gradient-to-r from-mediumSlateBlue via-heliotrope to-heliotrope bg-clip-text text-transparent font-display md:text-6xl text-4xl">
                Results
              </h1>
              <Image
                src={"/assets/wave-1.svg"}
                className="-skew-x-12 w-12 md:w-28"
                width={100}
                height={100}
              />
            </div>
            <div className="bg-mediumSlateBlue bg-gradient-to-b from-mediumSlateBlue to-heliotrope md:h-[70%] md:w-[50%] w-[90%] rounded-lg flex flex-col items-center space-y-5 justify-center p-8">
              <iframe
                width="560"
                height="315"
                className="w-full h-full"
                src={embedLink}
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
              <div className="title text-main font-display capitalize text-center md:text-3xl text-xs mb-2">
                {title}
              </div>
              <div className="buttons flex space-x-5">
                <div
                  onClick={() => location.reload()}
                  className="capitalize text-main font-bold font-display rounded-lg py-2 px-4 md:text-3xl flex items-center space-x-2 cursor-pointer"
                >
                  <p>Redo</p>
                  <Image
                    src={"/assets/reload.svg"}
                    className="mt-1 w-5 md:w-10"
                    width={40}
                    height={40}
                  />
                </div>
                <Link
                  href={link}
                  target="_blank"
                  className="capitalize border-main text-main font-bold font-display border-2 rounded-lg py-1 px-4 md:text-3xl flex items-center justify-center md:space-x-2 space-x-1 cursor-pointer"
                >
                  <p>Visit</p>
                  <Image
                    src={"/assets/open-link.svg"}
                    className="w-5 md:w-12"
                    width={50}
                    height={50}
                  />
                </Link>
                <Link
                  href={download}
                  className="capitalize bg-main text-heliotrope border-main font-display border-2 rounded-lg md:py-1 px-4 md:px-3 text-xs
                   md:text-3xl flex items-center justify-center md:space-x-3 cursor-pointer"
                >
                  <p>Download mp3</p>
                  <Image
                    src={"/assets/download.svg"}
                    className="w-5 md:w-10"
                    width={50}
                    height={50}
                  />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="flex flex-row justify-around items-center md:items-center md:justify-between footer border-t-4 border-heliotrope md:h-60 md:px-20 py-7 px-5">
        <div className="Contributor flex items-center">
          <Image
            src={"/assets/footer-ghost.png"}
            className="hover:animate-pulse md:block hidden"
            width={200}
            height={200}
          />
          <div className="flex-col flex space-y-3">
            <h2 className="text-heliotrope text-center font-base uppercase md:text-3xl text-xl">
              Kanak
            </h2>
            <div className="links flex">
              <Link href={"https://github.com/kaaanaakk"} target="_blank">
                <Image
                  src={"/assets/github.svg"}
                  className="md:w-16 w-10"
                  width={60}
                  height={60}
                />
              </Link>
              <Link
                href={
                  "https://www.linkedin.com/in/kanak-shrivastava-5a71351a9/"
                }
                target="_blank"
              >
                <Image
                  src={"/assets/linkedin.svg"}
                  className="md:w-16 w-10"
                  width={60}
                  height={60}
                />
              </Link>
            </div>
          </div>
        </div>
        <h1 className="text-heliotrope font-display text-3xl md:block hidden">
          Made by
        </h1>
        <div className="Contributor md:flex-row-reverse flex items-center">
          <Image
            src={"/assets/footer-ghost.png"}
            className="hover:animate-pulse md:block hidden"
            width={200}
            height={200}
          />
          <div className="flex-col flex space-y-3">
            <h2 className="text-heliotrope text-center font-base uppercase ms:text-3xl text-xl">
              Ishaan
            </h2>
            <div className="links flex">
              <Link href={"https://github.com/ik04"} target="_blank">
                <Image
                  src={"/assets/github.svg"}
                  className="md:w-16 w-10"
                  width={60}
                  height={60}
                />
              </Link>
              <Link
                href={"https://www.linkedin.com/in/ishaan-khurana-398114212/"}
                target="_blank"
              >
                <Image
                  src={"/assets/linkedin.svg"}
                  className="md:w-16 w-10"
                  width={60}
                  height={60}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
/**
 * hiiiiiiii babyyy!!!!!! ure cuteee, and pretyy, and so handsome, 
and soo kind, and so smart,
 very goated frfr,and make me want to better person, anyways 
lyyyyy, good luck for today, have fun at the mall!!!!!!!! 
 * 
 * 
 */
