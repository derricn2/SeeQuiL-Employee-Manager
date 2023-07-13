INSERT INTO department (name)
VALUES ('Sales'),
       ('Marketing'),
       ('Engineering');

INSERT INTO role (title, salary, department_id)
VALUES ('Manager', 80000.00, 1),
       ('Salesperson', 50000.00, 1),
       ('Engineer', 60000.00, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL), 
       ('Jane', 'Smith', 2, 1),
       ('Mike', 'Johnson', 3, 1);
