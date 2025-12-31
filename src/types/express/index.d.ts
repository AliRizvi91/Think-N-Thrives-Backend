import * as express from "express";

declare namespace Express {
  interface Request {
    user?: IUser; // from User model
  }
}

