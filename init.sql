CREATE DATABASE db;

USE db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(12) NOT NULL
);

INSERT INTO users (id, username, password, phone) VALUES (1, 'root', 'root', '');

CREATE TABLE movies (
  id INT AUTO_INCREMENT PRIMARY KEY, 
  title VARCHAR(255) NOT NULL,
  datetime DATETIME NOT NULL
);

CREATE TABLE booked (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  seat CHAR(3) NOT NULL
);
