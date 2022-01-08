const { prompt } = require("inquirer");
const { updateEmployeeManager, roleIdQuery, managerIdQuery } = require("./db");
const db = require('./db');
const logo = require('asciiart-logo');
const { load } = require("dotenv");
require('console.table');
const connection = require('./db/connection');


init();

function init() {
    const logoText = logo({ name: "Team Tracker"}).render();

    console.log(logoText);

    loadMainPrompts();
}

function loadMainPrompts() {
    prompt([{
        type: 'list',
        name: 'choices',
        choices: ['View all employees','View all employees by department','View all employees by manager','Add employee','Remove employee','Update employee role','Update employee manager','View all roles', 'Add role','Remove role','View all departments','Add department','Remove department', 'View total utilized budget by department','Quit']
    }])
    .then(res => {
        let choice = res.choices;
        console.log(choice);
        switch(choice) {
            case "View all employees":
                viewEmployees();
                break;
            case 'View all employees by department':
                viewEmployeesByDepartment();
                break;
            case 'View all employees by manager':
                viewEmployeesByManager();
                break;
            case 'Add employee':
                addEmployee();
                break;
            case 'Remove employee':
                removeEmployee();
                break;
            case 'Update employee role':
                updateEmployeeRole();
                break;
            case 'Update employee manager':
                updateEmployeeManager();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'Add role':
                addRole();
                break;
            case 'Remove role':
                removeRole();
                break;
            case 'View all departments':
                viewDepartments();
                break;
            case 'Add department':
                createDepartment();
                break;
            case 'Remove department':
                removeDepartment();
                break;
            case 'View total utilized budget by department':
                viewBudget();
                break;
            case 'Quit':
                quit();
                break;       
        }
    })
};

// view all employees

function viewEmployees() {
    console.log("Viewing employees");
    db.findAllEmployees()
        .then(([rows]) => {
            let employee = rows;
            console.log('\n');
            console.table(employee);
        })
        .then(() => loadMainPrompts());
}

// async function viewEmployeesByDepartment() {
//     const departmentChoices = await db.departmentQuery;
//         prompt([
//             {
//                 type: 'list',
//                 name: 'department',
//                 message: "Which department's employees would you like to see?",
//                 choices: departmentChoices
//             }
//         ])
    
// };

async function viewEmployeesByManager() {
    const managers = await db.currentManagerQuery;
        prompt([
            {
                type: 'list',
                name: 'managers',
                message: "Which manager's direct reports would you like to see?",
                choices: managers
            }
        ])
        .then(async answer => {
            const managerId = await db.managerIdQuery(answer.manager);
            if (managerId === null) {
                connection.query("SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS employees FROM employees WHERE manager_id is null", (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    loadMainPrompts();
                })
            } else {
                connection.query("SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS employees FROM employees WHERE manager_id=?", [managerId], (err, res) => {
                    if (err) throw err;
                    if (res.length < 1) {
                        console.log("No employees to show.")
                        loadMainPrompts();
                    } else {
                        console.table(res);
                        loadMainPrompts();
                    }
                })
            }
        });
}

async function addEmployee() {
    var roleChoices = await db.roleQuery();
    var managerChoices = await db.managerQuery();
    prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?"
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?"
        },
        {
            type: 'list',
            name: 'roleId',
            choices: roleChoices,
            message: "What is their role?"
        },
        {
            type: "list",
            name: "manager",
            message: "Please select the employee's manager: ",
            choices: managerChoices
        }
    ]).then( async answer => {
        console.log("You've added " + answer.firstName + " " + answer.lastName + " as " + answer.roleId + " with " + answer.manager + " as their manager.");
        const firstName = answer.firstName;
        const lastName = answer.lastName;
        const roleId = await db.roleIdQuery(answer.role);
        const managerId = answer.manager === "None" ? null : await db.managerIdQuery(answer.manager);
        const query = connection.query("INSERT INTO employees SET ?",
            {
                first_name: firstName,
                last_name: lastName,
                role_id: roleId,
                manager_id: managerId
            }, (err, res) => {
                if (err) throw err;
                loadMainPrompts();
            });
    });
};

// function removeEmployee() {

// };

async function updateEmployeeRole() {
    var employeeChoices = await db.employeeQuery;
    var roleChoices = await db.roleQuery;
    prompt([
        {
            type: 'list',
            name: 'employee',
            choices: employeeChoices,
            message: "Which employee would you like to update?"
        },
        {
            type: 'list',
            name: 'role',
            choices: roleChoices,
            message: "What is the updated employee's new role?"
        }
    ])
    .then(async answer => {
        console.log(answer.employee + "'s role has been updated to " + answer.role + '.');
        const employeeId = await db.employeeIdQuery(answer.employee);
        const newRoleId = await db.roleIdQuery(answer.role);
        const query = connection.query('UPDATE employees SET ? WHERE id=?',
            [{
                role_id: newRoleId
            },
                employeeId], (err, res) => {
                    if (err) throw err;
                    loadMainPrompts();
            });
    });
};

// function updateEmployeeManager() {

// };

function viewRoles() {
    console.log("Viewing all roles");
    db.findAllRoles()
        .then(([rows]) => {
            let roles = rows;
            console.log('\n');
            console.table(roles);
        })
        .then(() => loadMainPrompts());
};

async function addRole() {
    var departmentChoices = await db.departmentQuery();
    prompt([
        {
            type: 'input',
            name: 'title',
            message: "What is the title of the new role?"
        },
        {
            type: 'input',
            name: 'salary',
            message: "What is the new role's salary?"
        },
        {
            type: 'list',
            name: 'department',
            choices: departmentChoices,
            message: "To which department does this role belong?"
        }
    ]).then( async answer => {
        console.log("You've added " + answer.title + " with a salary of " + answer.salary + " to the " + answer.department + ".");
        const title = answer.title;
        const salary = answer.salary;
        const departmentId = await db.departmentIdQuery(answer.department);
        const query = connection.query("INSERT INTO roles SET ?",
            {
                title: title,
                salary: salary,
                department_id: departmentId
            }, (err, res) => {
                if (err) throw err;
                loadMainPrompts();
            });
    });
};


// function removeRole() {

// };

function viewDepartments() {
    console.log("Viewing all departments");
    db.findAllDepartments()
        .then(([rows]) => {
            let departments = rows;
            console.log('\n');
            console.table(departments);
        })
        .then(() => loadMainPrompts());

};

// create new dept
function createDepartment() {
    prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'What is the name of the new department?'
        },
    ]).then(answer => {
        console.log("You've added " + answer.departmentName + ".");
        const newDept = answer.departmentName;
        const query = connection.query("INSERT INTO departments SET ?",
            {
                name: newDept
            }, (err, res) => {
                if (err) throw err;
                loadMainPrompts();
            })
    });
};

// function removeDepartment() {

// };

function viewBudget() {
    console.log("Viewing budget");
    db.viewDepartmentBudgets()
        .then(([rows]) => {
            let budget = rows;
            console.log('\n');
            console.table(budget);
        })
        .then(() => loadMainPrompts());
};

// View all employees that belong to a department

// function quit() {

// };



