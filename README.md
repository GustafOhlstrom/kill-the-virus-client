## Kill The Virus (Client)

The client version of a 2 player game that test each players reaction time. The players will face off for 10 rounds and each round they need to kill (click) the virus as fast as possible.

Live site at: http://kill-the-virus.gustafohlstrom.se/  
Project by Gustaf Ohlström

### Tech

The project was built using the [create-react-app](https://create-react-app.dev/) and communcates with the [server](https://github.com/GustafOhlstrom/kill-the-virus-server) using Socket.io.

All Tech:
* React
* `Socket.io`
* SCSS
* HTML
* JSX (JavaScript)

### Installation

1. Clone repository to local machine using: https://github.com/GustafOhlstrom/kill-the-virus-client.git
2. Run npm install
3. Setup server - two ways 
    * Clone and install [server repository](https://github.com/GustafOhlstrom/kill-the-virus-server) by following its `README.md` (Recommended for development)
    * Use the server already up and running and linked in first row of ComponentDidMount() in App.js (Do nothing)
4. Start client
   * npm start - run app in development mode
   * npm build - build react app for production, saves in build folder
    

### Server

Server git repository can be found at: https://github.com/GustafOhlstrom/kill-the-virus-server
