DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

-- Department tables --
CREATE TABLE department (
    -- department table has 2 columns, id & name --
    id INT AUTO_INCREMENT PRIMARY KEY, -- primary key for the table --
    name VARCHAR(255) NOT NULL -- hold the name of the department w/ 255 characters --
);

-- Role tables --
CREATE TABLE role (
    -- role have 4 columns, id, title, salary, department_id --
    id INT AUTO_INCREMENT PRIMARY KEY, -- primary key for the table --
    title VARCHAR(255) NOT NULL, -- hold the title of the role w/ 255 characters --
    salary DECIMAL(10,2) NOT NULL, -- hold the salary of the role w/ 10 digits & 2 decimals --
    department_id INT NOT NULL, -- hold the department id of the role --
    FOREIGN KEY (department_id) REFERENCES department(id) -- foreign key constraint to link the role to a department --
);

-- Employee tables --
CREATE TABLE employee (
    -- employee have 5 columns, id, first_name, last_name, role_id, manager_id --
    id INT AUTO_INCREMENT PRIMARY KEY, -- primary key for the table --
    first_name VARCHAR(255) NOT NULL, -- hold the first name of the employee w/ 255 characters --
    last_name VARCHAR(255) NOT NULL, -- hold the last name of the employee w/ 255 characters --
    role_id INT NOT NULL, -- hold the role id of the employee --
    manager_id INT NULL, -- hold the manager id of the employee; nullable because not all employees have a manager --
    FOREIGN KEY (role_id) REFERENCES role(id), -- foreign key constraint to link the employee to a role --
    FOREIGN KEY (manager_id) REFERENCES employee(id) -- foreign key constraint to link the employee to a manager --
);
