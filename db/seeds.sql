INSERT INTO departments (name)
VALUES
    ('Operations'),
    ('Communications'),
    ('Development'),
    ('Human Resources'),
    ('General Counsel'),
    ('Information Technology');
    

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Director of Operations', 80000, 1),
    ('Director of Communications', 80000, 2),
    ('Director of Development', 80000, 3),
    ('Director of HR', 80000, 4),
    ('General Counsel', 80000, 5),
    ('Director of IT', 80000, 6),
    ('Operations Manager', 60000, 1),
    ('Marketing Manager', 60000, 2),
    ('Development Associate', 60000, 3),
    ('HR Generalist', 60000, 4),
    ('Paralegal', 60000, 5),
    ('Helpdesk Manager', 60000, 6);

    
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Harry', 'Potter', 1, 1),
    ('Ron', 'Weasley', 2, 2),
    ('Hermione', 'Granger', 3, 3),
    ('Draco', 'Malfoy', 4, 4),
    ('Lavender', 'Brown', 5, 5),
    ('Seamus', 'Finnigan', 6, 6),
    ('Parvati', 'Patil', 7, 1),
    ('Susan', 'Bones', 8, 2),
    ('Millicent', 'Bulstrode', 9, 3),
    ('Blaise', 'Zabini', 10, 4),
    ('Ginny', 'Weasley', 11, 5),
    ('Colin', 'Creevy', 12, 6);