-- drops database with the same name if it exists
DROP DATABASE IF EXISTS employees_db;

-- creates database of the name dropped above
CREATE DATABASE employees_db;

-- uses databse created above
USE employees_db;

-- creates table with columns and attributes
CREATE TABLE department (
    --column id which holds numbers and increment and is a primary key
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- holds up to 30 characters and cannot be null
    name VARCHAR(30) NOT NULL
);

-- creates table with columns and attributes
CREATE TABLE role (
    --column id which holds numbers and increment and is a primary key
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- holds up to 30 characters and cannot be null
    title VARCHAR(30) NOT NULL,
    -- holds numbers that are not null
    salary DECIMAL NOT NULL,
    -- ties in role table with department table
    department_id INT,
    -- references the primary key in department table
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    --column id which holds numbers and increment and is a primary key
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- holds up to 30 characters and cannot be null
    first_name VARCHAR(30) NOT NULL,
    -- holds up to 30 characters and cannot be null
    last_name VARCHAR(30) NOT NULL,
     -- ties in employee table with role table
    role_id INT,
    -- references the primary key in role table
    FOREIGN KEY (role_id) REFERENCES role(id),
    -- self-references employee id
    manager_id INT,
    -- manager id is the same as employee id of the manager
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);