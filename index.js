const { prompt } = require("inquirer");
const { updateEmployeeManager } = require("./db");
const db = require('./db');
require('console.table');

init();

function init() {
    // const logoText = logo({ name: "Employee Manager "}).render();

    // console.log(logoTest);

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
                addDepartment();
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
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            console.log('\n');
            console.table(employees);
        })
        .then(() => loadMainPrompts());
}

function viewEmployeesByDepartment() {
    db.findAllDepartments()
    .then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id
        }));

        prompt([
            {
                type: 'list',
                name: 'departmentId',
                message: "Which department's employees would you like to see?",
                choices: departmentChoices
            }
        ])
            .then(res => db.findAllEmployeesByDepartment(res.departmentId))
            .then(([rows]) => {
                let employees = rows;
                // unfinished
            })
    })
}

function viewEmployeesByManager() {

};

function addEmployee() {

};

function removeEmployee() {

};

function updateEmployeeRole() {

};

function updateEmployeeManager() {

};

function viewRoles() {

};

function addRole() {

};

function removeRole() {

};

function viewDepartments() {

};

function addDepartment() {
    prompt([
        {
            type: 'input',
            name: 'Department',
            message: 'What is the name of the new department?'
        }
    ]).then(({Department}) =>{
        console.log(Department);
    })
};

function removeDepartment() {

};

function viewBudget() {

};

function quit() {

};

// View all employees that belong to a department