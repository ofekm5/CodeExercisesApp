
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
