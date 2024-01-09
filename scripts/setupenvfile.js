const fs = require("fs").promises;
const path = require("path");

// TODO
let env = {
  appUrl: "http://localhost:3000/",
  admin_signin_login: "",
  admin_signin_password: "",
  admin_database_url: "",
  input_signin_active_login: "active.user@yopmail.com",
  input_signin_active_password: "active.user",
  input_signin_inactive_login: "inactive.user@yopmail.com",
  input_signin_inactive_password: "inactive.user",
};

async function script() {
  try {
    let fileName = "RAW.env.json";
    let fileLoc = path.join(path.dirname(__dirname), "/", fileName);
    await fs.writeFile(fileLoc, envToString());
    console.log("Raw environment file create in root directory: " + fileName);
    console.log("Make sure to:");
    console.log("\t1. remove the last coma (to meet json syntax)");
    console.log("\t2. provide secrets values where empty");
    console.log('\t3. rename the file to ".env.json" for it to be leveraged');
    console.log("");
  } catch (error) {
    console.error(error);
  }
}

script();

function envToString() {
  let envStr = "{";
  Object.keys(env).forEach((key) => {
    envStr += '\n\t"' + key + '": "' + env[key] + '",';
  });
  envStr += "\n}";
  return envStr;
}
