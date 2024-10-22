# Vritant-Blog Management System
This is Blog Posting Website Where you can share your thoughts.

# Description
Developed a blog management application using Node.js, Express, MySQL, and REST APIs. The system allows Multiple users to register, log in, create, update, and delete blog posts, with user authentication and session handling. It also features blog post pagination for fetching limited sets of blogs to handle performance of the website.

# Key Features:
--- Multiple User registration and login system with UUID and password management.
--- CRUD operations for both User and Blog entities, enabling functionalities such as blog creation, update, and deletion.
--- A followers system to manage relationships between users.
--- Pagination for blog retrieval with limit and offset for improved performance.
--- MySQL database integration with tables for user, blog, and followers.
--- Utilized environment variables for sensitive information management with the dotenv package.

# Tech Stack:
--- Backend: Node.js, Express.js
--- Database: MySQL with mysql2 library
--- Environment Management: dotenv
--- Authentication: UUID-based user authentication and login validation
--- Routing & APIs: Implemented RESTful APIs for handling user registration, login, and blog operations.

# Challenges Overcome:
--- Implemented user validation to handle duplicate usernames or emails during registration.
--- Integrated pagination and limit-based querying for optimized blog retrieval and performance.
--- Integrated a login session for user.
