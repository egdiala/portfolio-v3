#!/usr/bin/env bash
# Turns one Screen Studio export into the three files the site needs.
# Usage:   ./scripts/encode.sh <input-video> <name>
# Example: ./scripts/encode.sh ~/Desktop/area-recording.mp4 area-dashboard
# Output goes to public/videos by default. Override with OUT=some/folder.
set -euo pipefail

if [ $# -lt 2 ]; then
  echo "Usage: $0 <input-video> <name>"
  exit 1
fi

input="$1"
name="$2"
out="${OUT:-public/videos}"
filters="scale=1600:-2,fps=60"
mkdir -p "$out"

echo "→ MP4"
ffmpeg -y -loglevel error -stats -i "$input" -vf "$filters" -c:v libx264 -preset slow -crf 23 \
  -pix_fmt yuv420p -an -movflags +faststart "$out/$name.mp4"

echo "→ WebM"
ffmpeg -y -loglevel error -stats -i "$input" -vf "$filters" -c:v libvpx-vp9 -crf 34 -b:v 0 \
  -row-mt 1 -pix_fmt yuv420p -an "$out/$name.webm"

echo "→ Poster"
ffmpeg -y -loglevel error -i "$out/$name.mp4" -frames:v 1 -q:v 2 "$out/$name.jpg"

echo "Done:"
ls -lh "$out/$name".mp4 "$out/$name".webm "$out/$name".jpg