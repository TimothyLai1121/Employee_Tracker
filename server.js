// npm i inquirer //
// npm i mysql2 //
// npm i console.table //
// npm i figlet just like ReadMe //
// npm i chalk just like ReadMe //
// adding type module to package.json for import //
// npm i ora //
// adding console.clear since terminal was getting messy //


import inquirer from "inquirer";
import mysql from "mysql2";
import figlet from "figlet";
import chalk from "chalk";
import ora from "ora";

// connecting to the database //
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee_db",
});


// connecting to the database and checks for errors //
connection.connect((err) => {
  if (err) {
    console.log("error connecting: " + err.stack);
    return;
  }
  console.log(`Connected to database as id ${connection.threadId}`);
});


// Reset database function //
// Defining the function to reset the database // 
const resetDatabase = () => {
    connection.query("DELETE FROM employee", (err) => {
      // delete all employees from the employee table //
      if (err) throw err;
      console.log("Employee table cleared successfully!");
    });
    // delete all roles from the role table //
    connection.query("DELETE FROM role", (err) => {
      if (err) throw err;
      console.log("Role table cleared successfully!");
    });
    // delete all departments from the department table //
    connection.query("DELETE FROM department", (err) => {
      if (err) throw err;
      console.log("Department table cleared successfully!");
    });
  
    console.log("All data has been deleted from the database.");
    mainMenu();
  };
  
// main menu function //
// Defining the function to show the main menu //
const mainMenu = () => {
  // using figlet and chalk blue to create the title //
  console.log(chalk.blue(figlet.textSync("Employee Tracker")));
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          "View Employees",
          "View Departments",
          "View Roles",
          "Add Employee",
          "Add Department",
          "Add Role",
          "Update employee role",
          "Update employee department",
          "Reset Database",
          "Exit",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.choice) { // using switch to select the option //
        case "View Employees":
          showSpinner("Loading employees...", viewEmployees);
          break;
        case "View Departments":
          showSpinner("Loading departments...", viewDepartments);
          break;
        case "View Roles":
          showSpinner("Loading roles...", viewRoles);
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Update employee role":
          updateEmployeeRole();
          break;
        case "Update employee department":
          updateEmployeeDepartment();
          break;
        case "Reset Database":
          resetDatabase();
          break;
        case "Exit":
          connection.end();
          break;
        default:
          console.log(chalk.red(`Invalid action: ${answer.choice}`));
          mainMenu();
      }
    });
};

// npm ora //
// Defining the function to show the spinner //
const showSpinner = (text, callback) => {
  const spinner = ora({
    text: text,
    spinner: "dots", // using dots as the spinner //
  }).start();

  setTimeout(() => {
    spinner.stop();
    callback();
  }, 1000); // 1 second
};

// view employees function //

const viewEmployees = () => {
    // select all employees from the employee table //
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
};

// view departments function //

const viewDepartments = () => {
    

  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
};

const viewRoles = () => {
    

  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
};

const addEmployee = () => {
  connection.query("SELECT * FROM department", (err, departments) => {
    if (err) throw err;

    if (!departments.length) {
      console.log("No departments found, please add a department first.");
      mainMenu();
      return;
    }

    connection.query("SELECT * FROM role", (err, roles) => {
      if (err) throw err;

      if (!roles.length) {
        console.log("No roles found, please add a role first.");
        mainMenu();
        return;
      }

      const roleChoices = roles.map((role) => ({
        name: role.title,
        value: role.id,
      }));

      inquirer
        .prompt([
          {
            type: "input",
            name: "first_name",
            message: "Enter the employee's first name:",
          },
          {
            type: "input",
            name: "last_name",
            message: "Enter the employee's last name:",
          },
          {
            type: "list",
            name: "role_id",
            message: "Select the employee's role:",
            choices: roleChoices,
          },
        ])
        .then((answers) => {
          connection.query("INSERT INTO employee SET ?", answers, (err) => {
            if (err) throw err;
            console.log("Employee added successfully!");
            mainMenu();
          });
        });
    });
  });
};


const addDepartment = () => {
    
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the department name:",
      },
    ])
    .then((answers) => {
      connection.query("INSERT INTO department SET ?", answers, (err) => {
        if (err) throw err;
        console.log("Department added successfully!");
        mainMenu();
      });
    });
};

const addRole = () => {
  connection.query("SELECT * FROM department", (err, departments) => {
    if (err) throw err;
    const departmentChoices = departments.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Enter the role title:",
        },
        {
          type: "input",
          name: "salary",
          message: "Enter the role salary:",
        },
        {
          type: "list",
          name: "department_id",
          message: "Select the department for the role:",
          choices: departmentChoices,
        },
      ])
      .then((answers) => {
        connection.query("INSERT INTO role SET ?", answers, (err) => {
          if (err) throw err;
          console.log("Role added successfully!");
          mainMenu();
        });
        
      });
  });
};


const updateEmployeeRole = () => {
    
  connection.query("SELECT * FROM employee", (err, employees) => {
    if (err) throw err;
    const employeeChoices = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    connection.query("SELECT * FROM role", (err, roles) => {
      if (err) throw err;
      const roleChoices = roles.map((role) => ({
        name: role.title,
        value: role.id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "employee_id",
            message: "Select the employee to update:",
            choices: employeeChoices,
          },
          {
            type: "list",
            name: "role_id",
            message: "Select the new role for the employee:",
            choices: roleChoices,
          },
        ])
        .then((answers) => {
          connection.query(
            "UPDATE employee SET role_id = ? WHERE id = ?",
            [answers.role_id, answers.employee_id],
            (err) => {
              if (err) throw err;
              console.log("Employee role updated successfully!");
              mainMenu();
            }
          );
        });
    });
  });
};

const updateEmployeeDepartment = () => {
    
  connection.query("SELECT * FROM employee", (err, employees) => {
    if (err) throw err;
    const employeeChoices = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    connection.query("SELECT * FROM department", (err, departments) => {
      if (err) throw err;
      const departmentChoices = departments.map((department) => ({
        name: department.name,
        value: department.id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "employee_id",
            message: "Select the employee to update:",
            choices: employeeChoices,
          },
          {
            type: "list",
            name: "department_id",
            message: "Select the new department for the employee:",
            choices: departmentChoices,
          },
        ])
        .then((answers) => {
          connection.query(
            "SELECT * FROM role WHERE department_id = ?",
            [answers.department_id],
            (err, roles) => {
              if (err) throw err;
              const roleChoices = roles.map((role) => ({
                name: role.title,
                value: role.id,
              }));

              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "role_id",
                    message: "Select the new role for the employee:",
                    choices: roleChoices,
                  },
                ])
                .then((newRoleAnswer) => {
                  connection.query(
                    "UPDATE employee SET role_id = ? WHERE id = ?",
                    [newRoleAnswer.role_id, answers.employee_id],
                    (err) => {
                      if (err) throw err;
                      console.log("Employee department updated successfully!");
                      mainMenu();
                    }
                  );
                });
            }
          );
        });
    });
  });
};

mainMenu();
