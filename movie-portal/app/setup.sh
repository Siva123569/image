#!/bin/bash
set -e
sudo apt update -y
sudo apt install -y python3 python3-pip
pip3 install -r /home/azureuser/movie-portal/app/requirements.txt
nohup python3 /home/azureuser/movie-portal/app/app.py > app.log 2>&1 &
