import { Logger } from "../../../singleton/logger";
const log = Logger.getLogger().child({ from: "user/followers" });

import { Request, Response } from "express";
import { mongo } from "mongoose";

import { errorMessages, statusCodes } from "../../../utils/http-status";
import { ErrorResponse, SuccessResponse } from "../../../utils/response";
import FollowModel from "../../../model/mongo/follow";

const Followers = async (_: Request, res: Response) => {
  try {
    const userId = res.locals.oauth.token.user._id;
    FollowModel.aggregate([
      {
        $match: {
          $and: [{ targetId: new mongo.ObjectId(userId) }, { approved: true }],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sourceId",
          foreignField: "_id",
          as: "source",
        },
      },
      { $unwind: "$source" },
      {
        $replaceRoot: {
          newRoot: "$source",
        },
      },
      {
        $project: {
          _id: 0,
          __v: 0,
          password: 0,
          isRestricted: 0,
          emailVerified: 0,
        },
      },
    ]).exec(function (up, users) {
      if (up) {
        throw up;
      }
      res.status(statusCodes.success).json(new SuccessResponse({ users }));
    });
  } catch (err) {
    log.error(err);
    return res
      .status(statusCodes.internalError)
      .json(new ErrorResponse(errorMessages.internalError));
  }
};

export default Followers;
