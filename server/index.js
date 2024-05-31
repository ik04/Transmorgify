const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 8000;
const axios = require("axios");
const cors = require("cors");
const ConvertLink = require("./validation/ConvertLink");
const { ZodError } = require("zod");

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.get("/healthcheck", (req, res) => {
  res.status(200).json({ message: "Hello from Transmorgify ~IK" });
});
app.post("/convert", async (req, res) => {
  console.log(req.body);
  try {
    const link = req.body.link;
    if (!link) {
      res.status(400).json({ error: "Link is required!" });
    }
    const validated = ConvertLink.parse({ link });

    const options = {
      method: "GET",
      url: "https://youtube-mp315.p.rapidapi.com/",
      params: {
        url: validated.link,
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": "youtube-mp315.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    console.log(response.data);
    res.status(200).json({
      message: "Converted successfully!",
      result: response.data.result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      // Handle Zod validation error
      console.error("Validation error:", error.errors);
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Server error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.listen(PORT, () => console.log("Server Started"));
