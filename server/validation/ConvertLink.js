const { z } = require("zod");

const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

const ConvertLink = z.object({
  link: z
    .string()
    .regex(youtubeRegex, { message: "Please enter a valid YouTube link" }),
});

module.exports = ConvertLink;
