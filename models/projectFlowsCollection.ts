import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IProjectFlows extends Document {
  _id: ObjectId;
  Title: String | null;
  Description: String | null;
  Status: String | null;
  Creator: ObjectId | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

const ProjectFlowsSchema: Schema = new Schema({
  Title: { type: String },
  Description: { type: String },
  Status: { type: String, enum: [ 'complete', 'rollback', 'custom' ] },
  Creator: { type: Schema.Types.ObjectId, ref: "Users" },
}, { timestamps: true });

const ProjectFlows = mongoose?.models?.ProjectFlows || mongoose.model<IProjectFlows>('ProjectFlows', ProjectFlowsSchema);

export default ProjectFlows;
