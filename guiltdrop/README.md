# GuiltDrop Project

GuiltDrop is a social media application that allows users to post content and engage with others through comments. This README provides an overview of the project structure, setup instructions, and usage guidelines.

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

## Components

- **UserAvatar**: Displays a user's avatar image and name.
- **PostComments**: Manages the display and submission of comments for a specific post, including fetching comments from a Supabase database.
- **ShowComments**: Displays the list of comments in a dialog box format.

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd guiltdrop
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure Supabase:
   - Create a Supabase project and set up the database schema as required.
   - Update the Supabase client configuration in `src/lib/supabase/supabaseClient.ts` with your project URL and API key.

4. Run the application:
   ```
   npm start
   ```

## Usage

- Users can create posts and view them in the application.
- Comments can be added to each post, and users can view existing comments.
- The `ShowComments` component provides a dialog interface for viewing comments.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.