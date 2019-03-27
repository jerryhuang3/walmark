INSERT INTO users (username, full_name, password, email, avatar)
  VALUES ('test', 'john doe', '12345678', 'email@gmail.com', 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/95/95ae316cfe54f9a7cfef3a4e550d2708cb13f522_full.jpg');
INSERT INTO users (username, full_name, password, email, avatar)
  VALUES('test1', 'jane doe', '12345678', 'jane@email.com', 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/95/95ae316cfe54f9a7cfef3a4e550d2708cb13f522_full.jpg');

INSERT INTO topics (name)
  VALUES('math');
INSERT INTO topics (name)
  VALUES('programming');


INSERT INTO boards (user_id, title) VALUES (1, 'First board');
INSERT INTO boards (user_id, title) VALUES (2, 'Second board');


INSERT INTO links (user_id, topic_id, url, title, description) VALUES (1, 1, 'https://www.khanacademy.org/math', 'khan math', 'hello world');
INSERT INTO links (user_id, topic_id, url, title, description) VALUES (1, 2, 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', 'js mdn', '1+1');
INSERT INTO links (user_id, topic_id, url, title, description) VALUES (2, 2, 'https://github.com/airbnb/javascript', 'javascript style guide', 'es6');

INSERT INTO comments (user_id, link_id, text) VALUES (1, 1, 'cool');
INSERT INTO comments (user_id, link_id, text) VALUES (2, 2, 'not cool');
