const consoleTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    post: 3306,
    user: 'root',
    password: 'rootroot',
    database: 'employees_db',
});

connection.connect(err => {
    if (err) throw err;
    init();
});

console.log(`
╔═══╗─────╔╗──────────────╔═╗╔═╗
║╔══╝─────║║──────────────║║╚╝║║
║╚══╦╗╔╦══╣║╔══╦╗─╔╦══╦══╗║╔╗╔╗╠══╦═╗╔══╦══╦══╦═╗
║╔══╣╚╝║╔╗║║║╔╗║║─║║║═╣║═╣║║║║║║╔╗║╔╗╣╔╗║╔╗║║═╣╔╝
║╚══╣║║║╚╝║╚╣╚╝║╚═╝║║═╣║═╣║║║║║║╔╗║║║║╔╗║╚╝║║═╣║
╚═══╩╩╩╣╔═╩═╩══╩═╗╔╩══╩══╝╚╝╚╝╚╩╝╚╩╝╚╩╝╚╩═╗╠══╩╝
───────║║──────╔═╝║─────────────────────╔═╝║
───────╚╝──────╚══╝─────────────────────╚══╝`);

function init() {
    inquirer.prompt([
        {
            name: 'mainMenu',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View All Departments', 
                'View All Roles', 'View All Employees', 
                'Add a Department', 'Add a Role', 'Add an Employee', 
                'Update an Employee Role', 
                'Quit'
            ]
        }
    ]).then(response => {
        switch (response.mainMenu) {
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add a Department':
                addADepartment();
                break;
            case 'Add a Role':
                addARole();
                break;
            case 'Add an Employee':
                addAnEmployee();
                break;
            case 'Update an Employee Role':
                updateAnEmployeeRole();
                break;
            case 'Quit':
                connection.end();
                return;
            default:
                break;
        }
    })
};

function viewAllDepartments() {
    const sqlString=`
    SELECT *
    FROM department`

    connection.query(sqlString, (err, data) => {
        if(err) throw err;
        console.log("\n")
        console.table(data)
        console.log("\n")
        init()
    })
};

function viewAllRoles() {
    const sqlString=`
    SELECT *
    FROM role`

    connection.query(sqlString, (err, data) => {
        if(err) throw err;
        console.log("\n")
        console.table(data)
        console.log("\n")
        init()
    })
};

function viewAllEmployees() {
    const sqlString=`
    SELECT *
    FROM employee`

    connection.query(sqlString, (err, data) => {
        if(err) throw err;
        console.log("\n")
        console.table(data)
        console.log("\n")
        init()
    })
};

function addADepartment() {
    inquirer.prompt([
        {
            name: 'depName',
            message: 'What is the name of the department?'
            
        }
    ]).then(answer => {
        const sqlString=`
        INSERT INTO department(name)
        VALUES (?)`
        
        connection.query(sqlString, [answer.depName], (err, data) => {
            if(err) throw err;
            init()
        })
    }) 
};

function addARole() {
    const sqlString = `
    SELECT *
    FROM department;`

    connection.query(sqlString, (err, data) =>{
        if(err) throw err;
        let departments = data.map(department => ({name: department.name, value: department.id }));
        inquirer.prompt([
            {
                name: 'roleTitle',
                message: 'What is the name of the role?'
            
            },
            {
                name: 'roleSalary',
                message: 'What is the salary of the role?'
            },
            {
                name: 'roleDepartment',
                message: 'Which department does the role belong to?',
                type: 'list',
                choices: departments
            }
        ]).then(answer => {
            const sqlString=`
            INSERT INTO role
            SET ?`
        
            connection.query(sqlString, 
                {
                    title: answer.roleTitle, 
                    salary: answer.roleSalary, 
                    department_id: answer.roleDepartment
                }, 
                (err, data) => {
                if(err) throw err;
                init()
            })
        }) 
    })
};

function addAnEmployee() {
    const sqlString1 = `
    SELECT *
    FROM role;`

    const sqlString2 =`
    SELECT * 
    FROM employee`

    connection.query(sqlString1, (err, data) =>{
        if(err) throw err;
        let roles = data.map(role => ({name: role.title, value: role.id }));
        connection.query(sqlString2, (err, data) => {
            if(err) throw err;
            let employees = data.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.id}));
            inquirer.prompt([
                {
                    name: 'empFirstName',
                    message: 'What is the employee\'s first name?'
            
                },
                {
                    name: 'empLastName',
                    message: 'What is the employee\'s last name?'
                },
                {
                    name: 'empRole',
                    message: 'What is the employee\'s role?',
                    type: 'list',
                    choices: roles
                },
                {
                    name: 'empManager',
                    message: 'Who is the employee\'s manager?',
                    type: 'list',
                    choices: employees

                }
            ]).then(answer => {
                const sqlString=`
                INSERT INTO employee
                SET ?`
        
                connection.query(sqlString, 
                    {
                        first_name: answer.empFirstName,
                        last_name: answer.empLastName,
                        role_id: answer.empRole,
                        manager_id: answer.empManager
                    }, 
                    (err, data) => {
                    if(err) throw err;
                    init()
                })
            }) 
        })
    })
};

function updateAnEmployeeRole() {
    const sqlString1 = `
    SELECT *
    FROM role`

    const sqlString2 = `
    SELECT *
    FROM employee`

    connection.query(sqlString1, (err, data) => {
        if(err) throw err;
        let roles = data.map(role => ({name: role.title, value: role.id }));
        connection.query(sqlString2, (err, data) => {
            if(err) throw err;
            let employees = data.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.id }));
            inquirer.prompt([
                {
                    name: 'employees',
                    message: 'Which employee\'s role do you want to update?',
                    type: 'list',
                    choices: employees
                },
                {
                    name: 'updatedRole',
                    message: 'Which role do you want to assign the selected employee?',
                    type: 'list',
                    choices: roles
                }
            ]).then(answer => {
                const sqlString = `
                UPDATE employee
                SET ? WHERE ?`

                connection.query(sqlString,
                    [{
                        role_id: answer.updatedRole
                    },
                    {
                        id: answer.employees
                    }],
                    (err, data) => {
                        if(err) throw err;
                        init()
                })
            })
        })
    })
};