-- deletes database if already exists and creates database
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

-- department name
CREATE TABLE department (
  id INT AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,

  PRIMARY KEY (id)
);


-- role
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  department_id INT NOT NULL,

  PRIMARY KEY (id),
  FOREIGN KEY (department_id)
    REFERENCES department(id)
);

-- employee
CREATE TABLE employee (
  id INT AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,

  PRIMARY KEY (id),
  FOREIGN KEY (role_id)
   REFERENCES role (id),
  FOREIGN KEY (manager_id)
   REFERENCES employee (id)
);

