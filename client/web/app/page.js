"use client";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "sonner";

const page = () => {
  const [link, setLink] = useState("");
  const convert = async () => {
    try {
      if (!link || link == "" || link !== undefined) {
        toast.error("Please Enter your Link!");
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
    <div>
      <input
        type="text"
        className="border border-black"
        onChange={(e) => setLink(e.target.value)}
      />
      <button onClick={convert}>Convert</button>
    </div>
  );
};

export default page;
