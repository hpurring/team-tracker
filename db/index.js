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

    // find all roles
    findAllRoles() {
        return this.connection.promise().query(
            'SELECT roles.id AS "Role ID", roles.title AS "Role Title", roles.salary AS "Salary", departments.name AS "Department" FROM roles LEFT JOIN departments on roles.department_id = departments.id GROUP BY roles.id'
         );
    }

    // find all departments
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

    // generate list of all employees
    employeeQuery() {
        return new Promise((resolve,reject) => {
            const employeesArr = [];
            connection.query('SELECT * FROM employees', (err, res) => {
                if (err) throw err;
                res.forEach(employees => {
                    let employeeName = employees.first_name + ' ' + employees.last_name;
                    employeesArr.push(employeeName);
                    return err ? reject(err) : resolve(employeesArr);
                })
            })
        })
    };

    // find the id of a specific employee
    employeeIdQuery = employee => {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM employees WHERE CONCAT(first_name, ' ', last_name)=?", [employee], async (err, res) => {
            if (err) throw err;
            return err ? reject(err) : resolve(res[0].id);
            });
        });
    };

    // generate list of all roles
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

    // generate list of all managers, including "none"
    managerQuery() {
        return new Promise((resolve, reject) => {
            const managerArr = ["None"];
            connection.query('SELECT employees.id, CONCAT(employees.first_name, " ", employees.last_name) AS employee, roles.title FROM employees RIGHT JOIN roles ON employees.role_id = roles.id WHERE employees.id IN (1,2,3,4,5,6)', (err, res) => {
              if (err) throw err;
              res.forEach(manager => {
                managerArr.push(manager.employee);
                return err ? reject(err) : resolve(managerArr);
                });
            });
        });
    };

    // generate list of all managers, excluding "none"
    currentManagerQuery() {
        return new Promise((resolve, reject) => {
            const managerArr = [];
            connection.query('SELECT employees.id, CONCAT(employees.first_name, " ", employees.last_name) AS employee, roles.title FROM employees RIGHT JOIN roles ON employees.role_id = roles.id WHERE employees.id IN (1,2,3,4,5,6)', (err, res) => {
                if (err) throw err;
                res.forEach(manager => {
                    managerArr.push(manager.employee);
                    return err ? reject(err) : resolve(managerArr);
                });
            });
        });
    };

    // return id of specific role
    roleIdQuery = role => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT roles.id FROM roles WHERE title=?', [role], (err, res) => {
              if (err) throw err;
              return err ? reject(err) : resolve(res[0].id);
            });
        });
    }

    // return id of specific manager
    managerIdQuery = manager => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM employees WHERE CONCAT(first_name, " ", last_name)=?', [manager], async (err, res) => {
                if (err) throw err;
                return err ? reject(err) : resolve(res[0].id);
              });
            });
          };

    // generate list of all departments
    departmentQuery() {
        return new Promise((resolve, reject) => {
            const deptArr = [];
            connection.query('SELECT * FROM departments', (err, res) => {
                if (err) throw err;
                res.forEach(departments => {
                    deptArr.push(departments.name);
                    return err ? reject(err) : resolve(deptArr);
                });
            });
        });
    };

    // return id of specific department
    departmentIdQuery = dept => {
        return new Promise((resolve, reject) => {
          connection.query('SELECT * FROM departments WHERE name=?', [dept], async (err, res) => {
            if (err) throw err;
            return err ? reject(err) : resolve(res[0].id);
          });
        })
    };
};


module.exports = new DB(connection);