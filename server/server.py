import os
import io
from flask import Flask, request, send_file, jsonify
from pytubefix import YouTube
from pytubefix.cli import on_progress
from pydub import AudioSegment

app = Flask(__name__)

@app.route('/download', methods=['POST'])
def download_audio():
    data = request.get_json()

    if 'url' not in data:
        return jsonify({"error": "URL is required"}), 400

    url = data['url']

    try:
        yt = YouTube(url, on_progress_callback=on_progress)
        print(f"Title: {yt.title}")

        audio_stream = yt.streams.filter(only_audio=True).first()

        if not audio_stream:
            return jsonify({"error": "No audio stream available"}), 404

        temp_audio_file = audio_stream.download(filename="temp_audio")

        audio = AudioSegment.from_file(temp_audio_file)

        mp3_io = io.BytesIO()
        audio.export(mp3_io, format="mp3")
        mp3_io.seek(0)

        os.remove(temp_audio_file)

        return send_file(mp3_io, as_attachment=True, download_name=f"{yt.title}.mp3", mimetype="audio/mpeg")

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=8000)
