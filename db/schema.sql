USE b5w8fpklr409oa7q;

CREATE TABLE todos (
id INTEGER NOT NULL AUTO_INCREMENT,
description VARCHAR(255),
createdAt TIMESTAMP NOT NULL CURRENT_TIMESTAMP,
PRIMARY KEY(id)
);

CREATE TABLE users (
  id INTEGER NOT NULL AUTO_INCREMENT,
  email VARCHAR(50) NOT NULL, -- validate email format
  password VARCHAR(128), -- will be hashed
  firstName VARCHAR(25),
  lastName VARCHAR(50),
  location VARCHAR(50),
  aboutMe TEXT,
  imperial BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id)
);

CREATE TABLE categories (
  id INTEGER NOT NULL AUTO_INCREMENT,
  name VARCHAR(25),
  PRIMARY KEY (id)
);

CREATE TABLE recipes (
  id INTEGER NOT NULL AUTO_INCREMENT,
  title VARCHAR(128),
  source VARCHAR(128),
  description TEXT,
  prepTime INTEGER,
  cookTime INTEGER,
  ovenTempF INTEGER,
  ovenTempC INTEGER,
  numServings INTEGER,
  instructions TEXT,
  category1 INTEGER,
  category2 INTEGER,
  category3 INTEGER,
  public BOOLEAN DEFAULT TRUE,
  userID INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (userID) REFERENCES users(id),
  FOREIGN KEY (category1) REFERENCES categories(id),
  FOREIGN KEY (category2) REFERENCES categories(id),
  FOREIGN KEY (category3) REFERENCES categories(id)
);

CREATE TABLE ingredients (
  id INTEGER NOT NULL AUTO_INCREMENT,
  name VARCHAR(50),
  imperialQty INTEGER NOT NULL DEFAULT 1,
  imperialUnit VARCHAR(10),
  metricQty INTEGER NOT NULL DEFAULT 1,
  metricUnit VARCHAR(10),
  calories INTEGER,
  protein INTEGER,
  carbs INTEGER,
  fat INTEGER,
  recipeID INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (recipeID) REFERENCES recipes(id)
);