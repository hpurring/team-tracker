const connection = require('./connection');

class DB {
    constructor(connection) {
        this.connection = connection;
    }

    // find all employees except the given employee id
    findAllEmployees() {
        return this.connection.promise().query(
            'SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS departments, CONCAT(manager.id)'
        );
    }

    // find all employees except the given employee id
    findAllPossibleManagers(employeeId) {
        return this.connection.promise().query(
            'SELECT id, first_name, last_name FROM employee WHERE id != ?',
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
            'SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN deparmtnet on role.department_id = department.name',
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
            'SELECT department.id, department.name FROM department;'
        );
    }
    
    // view dept budgets
    viewDepartmentBudgets() {
        return this.connection.promise().query(
            'SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id'
        );
    }

    // create new dept
    createDepartment(department) {
        return this.connection.promise().query(
            'INSERT INTO department SET ?', department
        );
    }

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