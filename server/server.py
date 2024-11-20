import os
import io
from flask import Flask, request, send_file, jsonify
import yt_dlp
from pydub import AudioSegment
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://transmorgify.vercel.app", "expose_headers": ["X-Song-Title"]}})

@app.route('/download', methods=['POST'])
def download_audio():
    data = request.get_json()

    if 'url' not in data:
        return jsonify({"error": "URL is required"}), 400

    url = data['url']

    try:
        # yt-dlp options for downloading audio only
        ydl_opts = {
            "format": "bestaudio/best",
            "outtmpl": "temp_audio.%(ext)s",  # Save as temporary file
            "quiet": True,
        }

        # Download audio
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)

        # Extract title and file path
        title = info.get("title", "audio")
        file_path = f"temp_audio.{info['ext']}"

        if not os.path.exists(file_path):
            return jsonify({"error": "Download failed"}), 500

        # Convert downloaded file to MP3 using pydub
        audio = AudioSegment.from_file(file_path)
        mp3_io = io.BytesIO()
        audio.export(mp3_io, format="mp3")
        mp3_io.seek(0)

        # Clean up temporary file
        os.remove(file_path)

        # Create response with MP3 file
        response = send_file(
            mp3_io,
            as_attachment=True,
            download_name=f"{title}.mp3",
            mimetype="audio/mpeg"
        )
        response.headers['X-Song-Title'] = title  # Expose the title in headers

        return response

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)
