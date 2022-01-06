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
            'DELETE FROM departments WHERE id = ?', departmentId
        );
    }

    // find all employees in a given dept; join with roles to display employees' role titles
    findAllEmployeesByDepartment(departmentId) {
        return this.connection.promise().query(
            'SELECT employees.id, employees.first_name, employees.last_name, roles.title FROM employees LEFT JOIN roles on employees.role_id = roles.id LEFT JOIN departments on departments.id = roles.department.id',
            departmentId
        )
    }

    // find all employees by manager and join with departments and roles to display titles and department names
    findAllEmployeesByManager(managerId) {
        return this.connection.promise().query(
            'SELECT employees.id, employees.first_name, employees.last_name, departments.name AS department, roles.title FROM employees LEFT JOIN roles on departments.id = roles.department_id',
            managerId
        );
    }

    roleQuery() {
        return new Promise((resolve, reject) => {
          const roleArr = [];
          connection.query("SELECT * FROM roles", (err, res) => {
            if (err) throw err;
            res.forEach(roles => {
              roleArr.push(roles.title);
              return err ? reject(err) : resolve(roleArr);
            });
          });
        });
    };

    managerQuery() {
        return new Promise((resolve, reject) => {
            const managerArr = ["None"];
            connection.query('SELECT employees.id, CONCAT(employees.first_name, " ", employees.last_name) AS "Employee", roles.title FROM employees RIGHT JOIN roles ON employees.role_id = roles.id WHERE employees.id IN (1,2,3,4,5,6)', (err, res) => {
              if (err) throw err;
              res.forEach(manager => {
                managerArr.push(manager.title);
                return err ? reject(err) : resolve(managerArr);
                });
            });
        });
    };

    roleIdQuery() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT roles.id FROM roles', (err, res) => {
              if (err) throw err;
              return err ? reject(err) : resolve(res[0].id);
            });
        });
    }

    managerIdQuery() {
        return new Promise((resolve, reject) => {
          connection.query('SELECT employees.id, CONCAT(first_name, " ", last_name) AS "Employee" FROM employees WHERE employees.id IN (1,2,3,4,5,6)', (err, res) => {
            if (err) throw err;
            return err ? reject(err) : resolve(res[0].id);
          });
        });
    };

};


module.exports = new DB(connection);