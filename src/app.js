const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const app = express();
const { ErrorHandler } = require("./helpers/errorHandler");
const { HttpCode } = require("./helpers/constants");
const contactsRouter = require("./api/contacts/index");

const { apiLimit, jsonLimit } = require("./config/rate-limit.json");
const userRouter = require("./api/users/users");

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: jsonLimit }));

app.use(
  "/api/",
  rateLimit({
    windowMs: apiLimit.windowMs,
    max: apiLimit.max,
    handler: (req, res, next) => {
      next(
        new ErrorHandler(
          HttpCode.BAD_REQUEST,
          "You have send too many requests on 15 min."
        )
      );
    },
  })
);

app.use("/api/users", userRouter);
app.use("/api/contacts", contactsRouter);

app.use((req, res, next) => {
  res.status(HttpCode.NOT_FOUND).json({
    status: "error",
    code: HttpCode.NOT_FOUND,
    message: `Use api on routes ${req.baseUrl}/api/contacts`,
    data: "Not Found",
  });
});

app.use((err, req, res, next) => {
  err.status = err.status ? err.status : HttpCode.INTERNAL_SERVER_ERROR;
  res.status(err.status).json({
    status: err.status === 500 ? "fail" : "error",
    code: err.status,
    message: err.message,
    data: err.status === 500 ? "Internal Server Error" : err.data,
  });
});
module.exports = app;
