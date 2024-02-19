// var express = require('express');
// var cors = require('cors');
// var reveal = require('reveal-sdk-node');

// //const app = express();

// app.use(cors()); // DEVELOPMENT only! In production, configure appropriately.

// app.use('/', reveal());

// app.listen(5111, () => {
// 	console.log(`Reveal server accepting http requests`);
// });

// const fs = require("fs");
// const path = require("path");

// const app = express();
// app.use(cors());
const express = require('express');
const reveal = require('reveal-sdk-node');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

// Step 0 - Create API to Retrieve Dashboards
// app.get("/dashboards", (req, res) => {
//   const directoryPath = "./dashboards";
//   fs.readdir(directoryPath, (err, files) => {
//     const fileNames = files.map((file) => {
//       const { name } = path.parse(file);
//       return { name };
//     });
//     res.send(fileNames);
//   });
// });
app.get('/dashboards', (req, res) => {
	const directoryPath = "./dashboards";
	fs.readdir(directoryPath, (err, files) => {
	  if (err) {
		console.error(err);
		res.status(500).send({ error: 'Internal Server Error' });
		return;
	  }
  
	  const fileNames = files.map((file) => {
		const { name } = path.parse(file);
		console.log({name});
		return { name };
		
	  });
	  res.json(fileNames);
	});
  });
  

// Step 1 - Set up your Authentication Provider
const authenticationProvider = async (userContext, dataSource) => {
  console.log("Enter Authentication Provider");
  if (dataSource instanceof reveal.RVRedshiftDataSource) {
    return new reveal.RVUsernamePasswordDataSourceCredential(
      "admin", // Replace with your actual Redshift username
      "!(%*Blink1234" // Replace with your actual Redshift password
    );
  }
};

// Step 2 - Set up your Data Source Provider
const dataSourceProvider = async (userContext, dataSource) => {
  if (dataSource instanceof reveal.RVRedshiftDataSource) {
    dataSource.host = "44.240.211.241";
    dataSource.port = 5439;
    dataSource.database = "blink_test";
    dataSource.username = "admin";
    dataSource.password = "!(%*Blink1234";
  }
  return dataSource;
};

// Step 3 - Set up your Data Source Item Provider
const dataSourceItemProvider = async (userContext, dataSourceItem) => {
  console.log("Enter dataSourceItemProvider");

  // Redshift
  if (dataSourceItem instanceof reveal.RVRedshiftDataSourceItem) {
    console.log("in Redshift dataSourceItem");

    if (dataSourceItem.id === "charger_uptime") {
      dataSourceItem.query = "SELECT * FROM charger_uptime";
    } else if (dataSourceItem.id === "charger_uptime_summary") {
      dataSourceItem.query = "SELECT * FROM charger_uptime_summary";
    } else if (dataSourceItem.id === "charger_utilization") {
      dataSourceItem.query = "SELECT * FROM charger_utilization";
    } else if (dataSourceItem.id === "charging_session") {
      dataSourceItem.query = "SELECT * FROM charging_session";
    }
  }

  return dataSourceItem;
 };

// Step 4 - Set up your Reveal Options
const revealOptions = {
  authenticationProvider: authenticationProvider,
  dataSourceProvider: dataSourceProvider,
  dataSourceItemProvider: dataSourceItemProvider,
  //localFileStoragePath: "data",
};

// Step 5 - Initialize Reveal with revealOptions
app.use("/", reveal(revealOptions));

// Step 6 - Start your Node Server
app.listen(5111, () => {
  console.log(`Reveal server accepting http requests`);
});
