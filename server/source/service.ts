const https = require("https");
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
require("dotenv").config();

/**
 * TypeScript interfaces
 */

interface DataExport {
  kind: string;
  data: Resources[];
}

interface Resources {
  id: string;
  completedDate: string;
  status: string;
  //"Scheduled"
  //"Completed"
  resource: Resource[];
}

interface Resource {
  name: string;
  url: string;
}

/**
 * Gmail service
 */

export class GmailMessage {
  subject: string;
  message: string;
  user: string;

  constructor(subject: string, message: string, user: string) {
    this.subject = subject;
    this.message = message;
    this.user = user;
  }

  gmailMessage(objSelf: object): void {
    // If modifying these scopes, delete token.json.
    const SCOPES = [
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.readonly"
    ];
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.

    const TOKEN_PATH = "token.json";

    // Load client secrets from a local file.
    fs.readFile("./credentials.json", function processClientSecrets(
      err,
      content
    ) {
      if (err) {
        console.log("Error loading client secret file: " + err);
        return;
      }
      // Authorize a client with the loaded credentials, then call the
      // Gmail API.
      authorize(JSON.parse(content), sendMessage.bind(objSelf));
    });

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback): void {
      const clientSecret = credentials.web.client_secret;
      const clientId = credentials.web.client_id;
      const redirectUrl = credentials.web.redirect_uris[0];
      const oAuth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUrl
      );

      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.on("tokens", tokens => {
          if (tokens.refresh_token) {
            // store the refresh_token in the root folder!
            fs.writeFile(TOKEN_PATH, JSON.stringify(tokens), err => {
              if (err) return console.error(err);
              console.log("Token stored to", TOKEN_PATH);
            });
          }
          //console.log(tokens.access_token);
        });
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
      });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */

    function getNewToken(oAuth2Client, callback): void {
      const authUrl = oAuth2Client.generateAuthUrl({
        // eslint-disable-next-line @typescript-eslint/camelcase
        access_type: "offline",
        scope: SCOPES
      });
      console.log("Authorize this app by visiting this url:", authUrl);
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question("Enter the code from that page here: ", code => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
          if (err) return console.error("Error retrieving access token", err);
          oAuth2Client.setCredentials(token);
          // Store the token to disk for later program executions
          fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
            if (err) return console.error(err);
            console.log("Token stored to", TOKEN_PATH);
          });
          callback(oAuth2Client);
        });
      });
    }

    /**
     * Send message to the user's.
     *
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */

    function makeBody(
      to: string,
      from: string,
      subject: string,
      message: string
    ): string {
      const str = [
        'Content-Type: text/plain; charset="UTF-8"\n',
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ",
        to,
        "\n",
        "from: ",
        from,
        "\n",
        "subject: ",
        subject,
        "\n\n",
        message
      ].join("");

      const encodedMail = Buffer.from(str)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
      return encodedMail;
    }

    function sendMessage(auth: object): void {
      //console.log("USER = " + this.subject);
      const gmail = google.gmail("v1");
      const raw = makeBody(
        this.user,
        "wrike@se.ua",
        this.subject,
        this.message
      );
      gmail.users.messages.send(
        {
          auth: auth,
          userId: "me",
          resource: {
            raw: raw
          }
        },
        function(err, response) {
          console.log(err || response);
        }
      );
    }
  }
}

/**
 * Wrike http-service
 */

export function requestHttp(method: string, url: string): Promise<unknown> {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    const req = new XMLHttpRequest();
    req.open(method, url, true);
    req.setRequestHeader("Authorization", `Bearer ${process.env.TOKEN}`);
    //req.responseType = 'json';
    req.onload = function(): void {
      // This is called even on 404 etc
      // so check the status
      if (req.status >= 200 && req.status < 300) {
        // Resolve the promise with the response text
        resolve(this.responseText);
      } else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(this.statusText));
      }
    };
    // Handle network errors
    req.onerror = (): void => {
      reject(Error("Network Error on http request " + method + ":" + url));
    };
    // Make the request
    req.send();
  });
}

/**
 * ERP https-service
 */

class ErpHttpsService {
  private port: number;
  private host: string;
  private static certs: { key: Buffer; cert: Buffer };

  constructor(port: number, host: string) {
    this.port = port;
    this.host = host;
  }

  // Read SSL-certificate and private key
  certs = {
    key: fs.readFileSync("./client.key"),
    cert: fs.readFileSync("./client-cert.pem")
  };

  public requestHttps(method: string, path: string): Promise<unknown> {
    const options = {
      hostname: this.host,
      port: this.port,
      path: path,
      method: method,
      key: this.certs.key,
      cert: this.certs.cert,
      passphrase: "",
      rejectUnauthorized: false
    };
    // Return a new promise.
    return new Promise((resolve, reject) => {
      let response = "";
      const req = https.request(options, function(res) {
        res.on("data", function(data) {
          response += data;
        });
        // Handle network errors
        req.on("error", err => {
          reject("Https request error " + err);
        });
        res.on("end", function() {
          try {
            resolve(JSON.parse(response));
          } catch (err) {
            reject("Https JSON parse error " + err);
          }
        });
      });
      // Close the request
      req.end();
    });
  }
}

export const erpHttps = new ErpHttpsService(
  parseInt(process.env.ERP_PORT),
  process.env.ERP_HOST
);

/**
 * Power BI and ERP data refresh service
 */

// The function call a callback function at an interval of time
export class DataRefresh {
  public hour: number;
  public minute: number;
  public interval: number;
  private timerId: any; //NodeJS.Timeout;
  private repeat: (name: void) => void;
  // The first two arguments of the constructor are the start time
  constructor(hour: number, minute: number, interval: number) {
    this.hour = hour;
    this.minute = minute;
    this.interval = interval;
  }

  private forceTargetTime(): Date {
    const t = new Date();
    t.setHours(this.hour);
    t.setMinutes(this.minute);
    t.setSeconds(0);
    t.setMilliseconds(0);
    return t;
  }

  private timeNow(): number {
    return new Date().getTime();
  }

  private timeOffset(): number {
    return this.forceTargetTime().getTime() - this.timeNow();
  }

  public initInterval(callback: () => void): void {
    this.repeat = (): void => {
      callback();
      clearTimeout(this.timerId);
      this.timerId = setTimeout(this.repeat, this.interval); // Call the function every the interval milliseconds
    };
    this.timerId = setTimeout(this.repeat, this.timeOffset()); // Call the function the first time after the offset
  }
}
