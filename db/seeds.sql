INSERT INTO departments (name)
VALUES
    ('Operations'),
    ('Communications'),
    ('Development'),
    ('Human Resources');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Director of Operations', 80000, 1),
    ('Director of Communications', 80000, 2),
    ('Director of Development', 80000, 3),
    ('Director of HR', 80000, 4);

    
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Harry', 'Potter', 1, 1),
    ('Ron', 'Weasley', 2, 2),
    ('Hermione', 'Granger', 3, 3),
    ('Draco', 'Malfoy', 4, 4);