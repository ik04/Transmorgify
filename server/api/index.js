const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 8000;
const axios = require("axios");
const cors = require("cors");
const ConvertLink = require("../validation/ConvertLink");
const { ZodError } = require("zod");
const VideoNotFoundException = require("../Exceptions/VideoNotFoundException");
const allowCors = require("../utils/AllowCors");

app.use(
  cors({
    credentials: false,
    methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
    allowedHeaders: "Content-Type",
  })
);

app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from Transmorgify ~IK" });
});

app.post("/convert", async (req, res) => {
  try {
    console.log("Received request:", req.body);
    const link = req.body.link;
    if (!link) {
      return res.status(400).json({ error: "Link is required!" });
    }

    const validated = ConvertLink.parse({ link });

    const options = {
      method: "GET",
      url: "https://youtube-mp315.p.rapidapi.com/",
      params: { url: validated.link },
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": "youtube-mp315.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    console.log("API response:", response.data);
    const video = response.data.result[0];

    if (!video || !video.title) {
      throw new VideoNotFoundException("YouTube Video Not Found");
    }

    return res.status(200).json({
      message: "Converted successfully!",
      result: video,
    });
  } catch (error) {
    console.error("Error during /convert endpoint processing:", error);

    if (error instanceof ZodError) {
      console.error("Validation error:", error.errors);
      return res.status(400).json({ error: error.errors[0].message });
    }
    if (error instanceof VideoNotFoundException || error.code == 404) {
      return res.status(404).json({ error: "YouTube Video Not Found" });
    } else {
      return res.status(500).json({ message: "Server Error" });
    }
  }
});

app.post("/convert-V2", async (req, res) => {
  try {
    console.log("Received request:", req.body);
    const link = req.body.link;
    if (!link) {
      return res.status(400).json({ error: "Link is required!" });
    }

    const validated = ConvertLink.parse({ link });

    const options = {
      method: "GET",
      url: "https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/custom/",
      params: {
        url: validated.link,
        quality: "320",
      },
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": "youtube-mp3-downloader2.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    console.log("API response:", response.data);

    return res.status(200).json({
      message: "Converted successfully!",
      result: response.data,
    });
  } catch (error) {
    console.error("Error during /convert endpoint processing:", error);

    if (error instanceof ZodError) {
      console.error("Validation error:", error.errors);
      return res.status(400).json({ error: error.errors[0].message });
    }
    if (error instanceof VideoNotFoundException || error.code == 404) {
      return res.status(404).json({ error: "YouTube Video Not Found" });
    } else {
      return res.status(500).json({ message: "Server Error" });
    }
  }
});

app.listen(PORT, () => console.log("Server Started"));
