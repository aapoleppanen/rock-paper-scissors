# My solution for the Reaktor pre-assignment 2022.

Web application that displays the results of rock-paper-scissors matches in real-time.

## Live demo available at:
https://rps-reaktor.herokuapp.com/

# About

Technologies used:
Backend: Node, Express, Redis, MongoDB
Frontend: React, Theme-UI (a lightweight library used to style the front-end)

The challenge in this project was to build a web app capable of handling a relatively large amounts of historical data concerning rock-paper-scissor match results, while serving real-time data to the client. I solved this problem by importing the historical data to a MongoDB database, where I could handle each player as a separate document with historical data attached. For the real-time data I used Redis as a cache, wanting to try it since I had never used it before. The back-end listens to a Websocket and processes events as they come in. The back-end also acts as a websocket server to the client and sends processed the processed requests onward to the client. Recent events are kept in the Redis cache and periodically saved in bulk to the Mongo backend. When the client requests data about a certain player, the cached games are added to the response so that data is always up to date.

## Usage

To start the app run:

```sh
npm start
```
In the /rps-backend/ directory



