const connection = require('./connection');


class DB {
    constructor(connection) {
        this.connection = connection;
    }

    // find all employees 
    findAllEmployees() {
        return this.connection.promise().query(
            'SELECT employees.id AS "Employee ID", first_name AS "First Name", last_name AS "Last Name", roles.title AS "Role", roles.salary AS "Salary", departments.name AS "Department", manager_id AS "Manager ID" FROM employees LEFT JOIN roles on employees.role_id = roles.id LEFT JOIN departments on roles.department_id = departments.id GROUP BY employees.id'
        );
    }

    // find all employees except the given employee id
    findAllPossibleManagers(employeeId) {
        return this.connection.promise().query(
            'SELECT id, first_name, last_name FROM employees WHERE id != ?',
            employeeId
        );
    }

    // create a new employee
    createEmployee(employee) {
        return this.connection.promise().query('INSERT INTO employee SET ?', employee);
    }

    // remove an employee with the given id
    removeEmployee(employeeId) {
        return this.connection.promise().query(
            'DELETE FROM employee WHERE id = ?',
            employeeId
        );
    }

    // update the employee's role
    updateEmployeeRole(employeeId, roleId) {
        return this.connection.promise().query(
            'UPDATE employee SET role_id = ? WHERE id = ?',
            employeeId
        );
    }

    // update employee's manager
    updateEmployeeManager(employeeID, managerId) {
        return this.connection.promise().query(
            "UPDATE employee SET manager_id = ? WHERE ID = ?",
            [managerId, employeeID]
        );
    }
    
    // find all roles
    findAllRoles() {
        return this.connection.promise().query(
            'SELECT employees.role_id AS "Role ID", roles.title AS "Role Title", roles.salary AS "Salary", departments.name AS "Department" FROM employees LEFT JOIN roles on employees.role_id = roles.id LEFT JOIN departments on roles.department_id = departments.id GROUP BY employees.id'
         );
    }

    // create new role
    createRole(role) {
        return this.connection.promise().query(
            'INSERT INTO role SET ?', role
        );
    }

    // remove a role
    removeRole(roleId) {
        return this.connection.promise().query(
            'DELETE FROM role WHERE id = ?', roleId
        );
    }

    // view all departments
    findAllDepartments() {
        return this.connection.promise().query(
            'SELECT id, name FROM departments;'
        );
    }
    
    // view dept budgets
    viewDepartmentBudgets() {
        return this.connection.promise().query(
            'SELECT departments.name AS "Department", SUM(roles.salary) AS "Budget Per Dept" FROM employees LEFT JOIN roles on employees.role_id = roles.id LEFT JOIN departments on roles.department_id = departments.id GROUP BY departments.name'
        );
    }

    // create new dept
    createDepartment() {
        prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'What is the name of the new department?'
            },
        ]).then(answer => {
            db.query('INSERT INTO department SET ?',  
                { 
                    name: answer.departmentName,
                },
            (err, res) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                } else {
                    console.log(`${res.affectedRows} department has been added`);
                    findAllDepartments();
                }
            });
        });
    };

    // remove a dept
    removeDepartment(departmentId) {
        return this.connection.promise().query(
            'DELETE FROM department WHERE id = ?', departmentId
        );
    }

    // find all employees in a given dept; join with roles to display employees' role titles
    findAllEmployeesByDepartment(departmentId) {
        return this.connection.promise().query(
            'SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on department.id = role.department.id',
            departmentId
        )
    }

    // find all employees by manager and join with departments and roles to display titles and department names
    findAllEmployeesByManager(managerId) {
        return this.connection.promise().query(
            'SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role on deparmtent.id = role.department_id',
            managerId
        );
    }
}

module.exports = new DB(connection);