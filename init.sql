CREATE DATABASE ajaxdb;

USE ajaxdb;

CREATE TABLE countries (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE alloys (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE currencies (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  country INT NOT NULL,
  alloy INT NOT NULL,
  year INT NOT NULL,
  identifier VARCHAR(10) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (country) REFERENCES countries(id),
  FOREIGN KEY (alloy) REFERENCES alloys(id)
);

INSERT INTO countries (name) VALUES ('Albania'), ('Algieria'), ('Australia'), ('Barbados'), ('Belgia'), ('Belize'), ('Bermudy'), ('Bhutan'), ('Boliwia');
INSERT INTO alloys (name) VALUES ('aluminium'), ('aluminium-bronze'), ('bronze'), ('copper plated zinc'), ('copper-nickel'), ('gold'), ('nickel bonded steel'), ('nickel clad steel'), ('silver'), ('stainless steel'), ('zinc');