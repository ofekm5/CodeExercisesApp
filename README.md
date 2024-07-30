
# CodeExercisesApp

## Overview

`CodeExercisesApp` is an online coding web application designed for collaborative code exercises. Users can choose a code block to work on, and real-time updates are shared with all users in the same code block. The app distinguishes between mentors and students, allowing mentors to view the code in read-only mode while students can edit it.

## Features

- **Lobby Page**: Displays a list of code blocks for users to choose from.
- **Code Block Page**: Allows users to view and edit code blocks in real-time. The first user in a code block is designated as the mentor, and subsequent users are students.
- **Real-Time Collaboration**: Changes made by any student are broadcast to all other users in the same code block using WebSockets.
- **Role-Based Views**: Mentors have a read-only view of the code, while students can edit the code.
- **Dynamic User Count**: Displays the number of students currently viewing a code block.
- **Success Indicator**: Shows a smiley face when the student enters the correct solution.

## Technologies Used

- **Frontend**: Next.js, React, TypeScript, MUI (Material-UI)
- **Backend**: Express.js, MongoDB, WebSocket (ws)
- **Editor**: Monaco Editor

## Prerequisites

- Node.js (>=14.x)
- Docker

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ofekm5/CodeExercisesApp.git
cd CodeExercisesApp
```

### 2. Set Up the Backend

1. Navigate to the `Backend` directory:

   ```bash
   cd Backend
   ```

2. Create a `.env` file with the following content:

   ```env
   MONGO_URI=mongodb://mongo:27017/mydb
   PORT=5000
   ```

3. Build and run the backend services using Docker Compose:

   ```bash
   docker-compose up --build
   ```

### 3. Set Up the Frontend

1. Navigate to the `frontend` directory:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the Next.js development server:

   ```bash
   npm run dev
   ```

### 4. Access the Application

Open your browser and navigate to `http://localhost:3000` to access the CodeExercisesApp.

## Project Structure

```plaintext
CodeExercisesApp/
├── Backend/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── src/
│   │   ├── controllers/
│   │   │   └── codeBlockController.ts
│   │   ├── models/
│   │   │   └── codeBlock.ts
│   │   ├── routes/
│   │   │   └── codeBlockRoutes.ts
│   │   ├── socket/
│   │   │   └── socket.ts
│   │   ├── server.ts
│   │   └── ...
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── Lobby.tsx
│   │   │   └── CodeBlock.tsx
│   │   ├── pages/
│   │   │   ├── _app.tsx
│   │   │   └── index.tsx
│   │   └── styles/
│   │       └── globals.css
│   ├── public/
│   ├── package.json
│   └── ...
└── README.md
```

## Usage

### Lobby Page

- Visit the lobby page to see a list of available code blocks.
- Click on a code block to join and start working on it.

### Code Block Page

- The first user to join a code block is designated as the mentor (read-only view).
- Subsequent users are students and can edit the code.
- Changes are updated in real-time for all users in the code block.
- If the student types the correct solution, a smiley face will appear.
- The number of students in the code block is displayed at the bottom.

## Contribution

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
