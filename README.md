# Club Anonymous

A minimalist message board application where registered users can post anonymous messages. Built using Node.js, Express, and PostgreSQL, with full user authentication, session handling, and privilege-based access control.

[Visit Page](https://members-only-production-98b8.up.railway.app/)

## Features

- User registration and login using Passport.js
- Sessions stored securely in PostgreSQL using `connect-pg-simple`
- Role-based access: users can upgrade to "super" members via secret password
- Post author and creation time visibility with user membership status

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: Passport.js (Local Strategy)
- **Session Management**: express-session, connect-pg-simple
- **Templating**: EJS