# GuiltDrop Project

GuiltDrop is a web application that allows users to post content and engage with others through comments. The application utilizes Supabase for backend services, including database management and user authentication.

## Features

- **User Authentication**: Users can sign up and log in to the application.
- **Post Creation**: Users can create posts that can be commented on by others.
- **Commenting System**: Users can add comments to posts, view existing comments, and see user avatars and usernames associated with each comment.
- **Responsive Design**: The application is designed to be user-friendly and responsive across different devices.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A superset of JavaScript that adds static types.
- **Supabase**: An open-source Firebase alternative that provides a backend as a service.
- **Tailwind CSS**: A utility-first CSS framework for styling the application.

## Project Structure

```
guiltdrop
├── src
│   ├── components
│   │   ├── common
│   │   │   └── UserAvatar.tsx
│   │   ├── posts
│   │   │   ├── PostComments.tsx
│   │   │   └── ShowComments.tsx
│   └── lib
│       └── supabase
│           └── supabaseClient.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/guiltdrop.git
   ```
2. Navigate to the project directory:
   ```
   cd guiltdrop
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the development server:
   ```
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.