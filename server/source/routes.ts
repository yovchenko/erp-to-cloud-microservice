const express = require("express");
const crypto = require("crypto");
import checkEvent from "./controller";
export const router = express.Router();

/**
 *Express routing
 */

router.post(
  "/post", //responds to HTTP POST requests.
  (
    req: { headers: object; body: unknown; rawBody: object },
    res: { writeHead: Function; status: Function }
  ) => {
    if ("x-hook-secret" in req.headers) {
      //secret to check authenticity of the events
      const hash = crypto
        .createHmac("sha256", process.env.SECRET)
        .update(req.headers["x-hook-secret"])
        .digest("hex");

      if (
        req.headers["x-hook-secret"] ===
        crypto
          .createHmac("sha256", process.env.SECRET)
          .update(req.rawBody.toString())
          .digest("hex")
      ) {
        //X-Hook-Secret header with value hmacSha256 is equal to request body
        if (Array.isArray(req.body) && req.body.length) {
          req.body.forEach(checkEvent);
        }
      } else 
        res.status(401).end("Invalid Authentication Token");

      res.writeHead(200, { "X-Hook-Secret": hash });
      res.status(200).end();
    } else
      res.status(401).end("The request you have made requires authentication");
  }
);
