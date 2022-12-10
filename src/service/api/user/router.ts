import express from "express";
import AuthFlow from "../middleware/authenticate";
import Create, { CreateValidator } from "./create";
import Follow, { FollowValidator } from "./follow";
import Followers from "./followers";
import Following from "./following";
import _userId from "./_userId";
import Login, { LoginValidator } from "./login";
import Me from "./me";
import Unfollow from "./unfollow";
import VerifyEmail, { VerifyEmailValidator } from "./verify-email";

const UserRouter = express.Router();

//Core
UserRouter.post("/create", ...CreateValidator, Create);
UserRouter.post("/login", ...LoginValidator, Login);
UserRouter.get("/verify-email", ...VerifyEmailValidator, VerifyEmail);

//User info
UserRouter.get("/me", ...AuthFlow, Me);
UserRouter.get("/:userId", ...AuthFlow, _userId);

//Friends
UserRouter.post("/follow", ...AuthFlow, ...FollowValidator, Follow);
UserRouter.post("/unfollow", ...AuthFlow, ...FollowValidator, Unfollow);
UserRouter.get("/following", ...AuthFlow, Following);
UserRouter.get("/followers", ...AuthFlow, Followers);

export default UserRouter;
