import os
import io
from flask import Flask, request, send_file, jsonify
import yt_dlp
from pydub import AudioSegment
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000", "expose_headers": ["X-Song-Title"]}})

@app.route('/download', methods=['POST'])
def download_audio():
    cookie_data = os.getenv("YT_COOKIES")
    print("YT_COOKIES:", cookie_data)  
    if cookie_data is None or cookie_data.strip() == "":
        return jsonify({"error": "YouTube cookies are missing or empty"}), 400

    cookies_file = "cookies.txt"
    if not os.path.exists(cookies_file) or os.stat(cookies_file).st_size == 0:
        with open(cookies_file, "w") as cookie_file:
            cookie_file.write(cookie_data)

    data = request.get_json()

    if 'url' not in data:
        return jsonify({"error": "URL is required"}), 400

    url = data['url']

    try:
        ydl_opts = {
            "format": "bestaudio/best",
            "outtmpl": "temp_audio.%(ext)s",
            "quiet": True,
            "cookiefile": cookies_file,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)

        title = info.get("title", "audio")
        file_path = f"temp_audio.{info['ext']}"

        if not os.path.exists(file_path):
            return jsonify({"error": "Download failed"}), 500

        audio = AudioSegment.from_file(file_path)
        mp3_io = io.BytesIO()
        audio.export(mp3_io, format="mp3")
        mp3_io.seek(0)

        os.remove(file_path)

        response = send_file(
            mp3_io,
            as_attachment=True,
            download_name=f"{title}.mp3",
            mimetype="audio/mpeg"
        )
        response.headers['X-Song-Title'] = title  

        return response

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)
