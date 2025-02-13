# MockInt

MockInt is a mock interview platform designed to enhance interview preparation through real-time collaboration and communication. Built with the MERN stack, socket.io, and peerjs, MockInt offers a seamless and interactive interview experience.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Learnings](#learnings)
- [Contributing](#contributing)


## Features

- User authentication and authorization
- Start or join an interview using a room ID
- One-on-one audio and video calls with peerjs
- Collaborative text editor and code editor
- Real-time communication using socket.io

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Frontend:** React, Tailwind CSS
- **Real-time Communication:** socket.io, peerjs

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/manthankhawse/Interview-Platform.git
    cd Interview-Platform
    ```

2. Install backend dependencies:
    ```sh
    cd backend
    npm install
    ```

3. Install frontend dependencies:
    ```sh
    cd ../frontend
    npm install
    ```

4. Set up environment variables:

    Create a `.env` file in the `backend` directory and add the following:
    ```
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    ```

5. Start the backend server:
    ```sh
    cd backend
    npm start
    ```

6. Start the frontend server:
    ```sh
    cd ../frontend
    npm run dev
    ```

## Usage

1. Sign up or log in to your account.
2. Choose to start an interview or join an interview.
3. If starting an interview, share the generated room ID with the interviewer.
4. If joining an interview, enter the room ID shared by the interviewee.
5. Once connected, use the audio and video call feature for communication, and collaborate using the text editor and code editor.

## Learnings

- **Real-time Communication:** Implemented efficient and reliable communication between browsers using socket.io, which facilitated real-time data exchange and client connectivity.
- **WebRTC Simplification:** Simplified WebRTC integration with peerjs, enabling smooth and accessible audio and video communication.
- **Collaborative Tools:** Developed collaborative text and code editors to enhance the interview experience, allowing real-time editing and sharing of information.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any features, bug fixes, or enhancements.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request
