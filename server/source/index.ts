/**
 * Required External Modules
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
import { router } from "./routes";
import { checkErpData, updateErpData } from "./erpDataExchange";
import { requestHttp } from "./service";
require("dotenv").config();
import { DataRefresh } from "./service";

/**
 * App Variables
 */

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();

/**
 *  App Configuration
 */

app.use(helmet());
app.use(cors());

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  })
);
app.use(express.urlencoded({ extended: false }));

/**
 * Server Activation
 */

app.use("/api", router);

const server = app.listen(PORT, () =>
  console.log(`API running on localhost:${PORT}`)
);

/**
 * Power BI's data refresh initialization
 */

const powerBiRefresh = new DataRefresh(23, 59, 86400000); //call the callback function every 24 hours
powerBiRefresh.initInterval(async () => {
  await checkErpData().catch(err => {
    console.log("ERP's information update error " + err);
  });
  await updateErpData(
    process.env.ERP_BUDGET_PATH_MESSAGE,
    process.env.ERP_BUDGET_PATH_DATA
  ).catch(err => {
    console.log("ERP's data refresh error " + err);
  });
});

/**
 * ERP's data refresh initialization
 */

const erpRefresh = new DataRefresh(23, 59, 1800000); //call the callback function every 30 minutes

erpRefresh.initInterval(async () => {
  await requestHttp("POST", process.env.POWER_BI_URL).catch((err: Error) => {
    console.log("Power BI's data refresh error " + err);
  });
});

/**
 * Webpack HMR Activation
 */

type ModuleId = string | number;

interface WebpackHotModule {
  hot?: {
    data: string;
    accept(
      dependencies: string[],
      callback?: (updatedDependencies: ModuleId[]) => void
    ): void;
    accept(dependency: string, callback?: () => void): void;
    accept(errHandler?: (err: Error) => void): void;
    dispose(callback: (data: string) => void): void;
  };
}

declare const module: WebpackHotModule;

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.close());
}
