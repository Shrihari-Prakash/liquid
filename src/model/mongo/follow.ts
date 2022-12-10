import mongoose, { Schema } from "mongoose";

const followerSchema = {
  sourceId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  targetId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
};

const schemaInstance = new mongoose.Schema(followerSchema),
  FollowModel = mongoose.model("follow", schemaInstance);

schemaInstance.index({ sourceId: 1, targetId: 1 }, { unique: true });

export default FollowModel;
