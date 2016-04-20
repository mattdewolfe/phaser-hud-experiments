## Run this file to compile audio fx files. This will iterate over all folders inside
## of the sprite folder and create matching audiosprites for each one.

## You may be required to change ownership of the file to your username.
## To do so, navigate to the containing folder in terminal and use the following command.
## 'chown username audio_compile.command'

## Running this file may require you to add the run as executable privilage to this file.
## To do so, navigate to the containing folder in terminal and use the following command.
## 'chmod u+x audio_compile.command'

#!/bin/bash
cd `dirname $0`
for d in sprite/*/; do audiosprite -c 1 -g 2 -r 44100 -e "mp3" -b 128 -o ${d:0:${#d}-1} "$d"*; done
for d in sprite/*/; do audiosprite -c 1 -g 2 -r 44100 -e "m4a,ogg" -b 48 -o ${d:0:${#d}-1} "$d"*; done
exit