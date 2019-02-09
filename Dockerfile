FROM node:lts-slim
RUN useradd app
WORKDIR /home/app
ADD . /home/app
RUN npm install