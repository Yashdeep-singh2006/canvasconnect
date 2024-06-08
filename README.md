# CanvasConnect

CanvasConnect is a real-time collaborative whiteboard application where users can draw together on a shared canvas in real-time. It allows multiple users to collaborate on creative projects, brainstorm ideas, or simply have fun drawing together.

## Features

- Real-time Drawing: Draw on a shared canvas and see changes in real-time.
- User Cursors: See the cursors of other users to track their drawing activity.
- Chat Interface: Communicate with other users while drawing.
- User Authentication: Register and login to access the collaborative drawing features.
- Responsive Design: Works well on different devices and screen sizes.

## Technologies Used

- **Frontend:** React.js, HTML5 Canvas API, CSS3, Tailwind 
- **Backend:** Node.js, Express.js, Socket.IO
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/canvas-connect.git
   ```
2. Install dependencies:
   ```bash
   cd canvas-connect
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following environment variables:
     ```
     PORT=3000
     MONGODB_URI=your-mongodb-connection-string
     JWT_SECRET=your-secret-key
     ```
4. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Register a new account or login with existing credentials.
2. Create or join a drawing session.
3. Draw on the canvas and see changes in real-time.
4. Use the chat interface to communicate with other users.
5. Have fun drawing together!

## Contributing

Contributions are welcome! If you'd like to contribute to CanvasConnect, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Submit a pull request to the main repository.

Please ensure your code follows the project's coding standards and conventions. Thank you for contributing!

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

If you have any questions, suggestions, or feedback, feel free to contact me at [your-email@example.com].
