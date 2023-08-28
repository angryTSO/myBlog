CCREATE TABLE users (
  uid INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  email VARCHAR(255),
  email_verified BOOLEAN,
  date_created DATE,
  last_login DATE
);

CREATE TABLE posts (
  pid INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  body TEXT,
  search_vector TEXT,
  user_id INT,
  author VARCHAR(255),
  date_created TIMESTAMP,
  like_user_id JSON DEFAULT JSON_ARRAY(),
  likes INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(uid),
  FOREIGN KEY (author) REFERENCES users(username)
);

CREATE TABLE comments (
  cid INT AUTO_INCREMENT PRIMARY KEY,
  comment VARCHAR(255),
  author VARCHAR(255),
  user_id INT,
  post_id INT,
  date_created TIMESTAMP,
  FOREIGN KEY (author) REFERENCES users(username),
  FOREIGN KEY (user_id) REFERENCES users(uid),
  FOREIGN KEY (post_id) REFERENCES posts(pid)
);

CREATE TABLE messages (
  mid INT AUTO_INCREMENT PRIMARY KEY,
  message_sender VARCHAR(255),
  message_to VARCHAR(255),
  message_title VARCHAR(255),
  message_body VARCHAR(255),
  date_created TIMESTAMP,
  FOREIGN KEY (message_sender) REFERENCES users(username),
  FOREIGN KEY (message_to) REFERENCES users(username)
);
