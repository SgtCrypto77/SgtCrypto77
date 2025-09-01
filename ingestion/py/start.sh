#!/usr/bin/env bash
set -euo pipefail
python3 -m pip install --upgrade pip
pip3 install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8081
