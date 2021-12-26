DROP DATABASE IF EXISTS department;
DROP DATABASE IF EXISTS roles;
DROP DATABASE IF EXISTS employee;

CREATE DATABASE  department (
    id INTEGER PRIMARY KEY,
    name VARCHAR(30)
);

CREATE DATABASE roles (
    id INTEGER PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INTEGER
);

CREATE DATABASE employee (
    id INTEGER PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER,
    manager_id INTEGER
);