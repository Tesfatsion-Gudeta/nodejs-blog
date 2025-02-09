# Node.js Blog App

A simple blog application built with Node.js, Express.js, MongoDB, and JWT authentication. This app allows users to create, read, update, and delete blog posts. It also includes features like user authentication, comment system, likes, and shares.

## Features
- **Blog Management:** read, create(admin only) ,update(admin only), and delete(admin only) blog posts.
- **User Authentication:** Secure login and registration using JWT.
- **Admin Panel:** Admins can manage all posts.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (using Mongoose)
- **Authentication:** JSON Web Tokens (JWT)
- **Other Libraries/Tools:** bcrypt

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or remote instance)

### Steps to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Tesfatsion-Gudeta/blog-app.git
   cd blog-app
   
2.Install dependencies:
```bash
npm install
```
3.Create a .env file in the root directory and add your environment variables:
```
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret_key
```
4.Start the server:
```
npm start
```
Your app will be running at http://localhost:5000.


## note:

- **POST** `/register`: Register a new admin user(you need to uncomment the register form in the admin/index.ejs first in order to add a new admin).


