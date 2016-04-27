# Webrtc server - forked from https://github.com/pchab/ProjectRTC

## WebRTC Live Streaming for android devices

- Node.js server
- [Android client](https://github.com/DangLienMinh/webrtc_client)

The signaling part is done with [socket.io](socket.io).
The client is an Android project.

## Install

It requires [node.js](http://nodejs.org/download/)
It also requires mongodb in order to save data such as user login/register information (https://www.mongodb.org/downloads)

* You need to start the mongo db first.
* git clone git@github.com:DangLienMinh/webrtc_server.git
* cd ProjectRTC/
* npm install
* npm start

The server will run on port 3000.
You can test it in the (Chrome or Firefox) browser at localhost:3000.

## Author

- [Minh Dang](mailto:danglienminh93@gmail.com)
