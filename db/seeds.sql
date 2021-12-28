INSERT INTO department (name)
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

    
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Hilary', 'Purrington', 1, 1),
    ('Sarah', 'Jones', 2, 2),
    ('Max', 'Rico', 3, 3),
    ('Becky', 'Brice', 4, 4);