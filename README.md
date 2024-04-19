# Posts API

Welcome to Posts API, a backend service designed to manage blog posts and user authentication - A School of Engineering Backend Engineering assessment project at [AltSchool Africa](https://altschoolafrica.com).

### Features

- User registration and authentication.
- Blog post creation, update, and deletion.
- Fetching single or multiple blog posts.
- Robust error handling and security features.

### Quick Start

To get started with this application, follow the setup instructions below:

1. **Clone the repository**

```bash
git clone https://github.com/holabayor/altschool-posts.git
```

2. **Navigate to the project directory**

```bash
cd altschool-posts
```

3. **Create a .env file**

```plaintext
PORT=8000
MONGODB_URI='your mongodb uri here'
JWT_SECRET_KEY=yourSecretKey
```

4. **Install dependencies**

```bash
npm install
```

5. **Start the application**

```bash
npm start
```

6. **Running Test**

```bash
npm test
```

### API Endpoints

| Methods | Endpoint             | Protected | Description               |
| ------- | -------------------- | --------- | ------------------------- |
| POST    | `/api/auth/register` | No        | Registers a new           |
| POST    | `/api/auth/login`    | No        | Logs in a user            |
| GET     | `/api/posts`         | No        | Retrieves all posts       |
| POST    | `/api/posts`         | Yes       | Create a new post         |
| GET     | `/api/posts/:id`     | No        | Retrieves a specific post |
| PATCH   | `/api/posts/:id`     | Yes       | Edit a specific post      |
| DELETE  | `/api/posts/:id`     | Yes       | Deletes a specific post   |

Live Demo: [Live demo](https://altschool-posts.onrender.com/api/posts)

### Author

- **Liasu Aanuoluwapo** [Github](https://github.com/holabayor)
