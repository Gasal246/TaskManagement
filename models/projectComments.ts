import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IProjectComments extends Document {
  _id: ObjectId;
  Comment: String | null;
  Creator: ObjectId | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

const ProjectCommentsSchema: Schema = new Schema({
  Comment: { type: String },
  Creator: { type: Schema.Types.ObjectId, ref: "Users" },
}, { timestamps: true });

const ProjectComments = mongoose?.models?.ProjectComments || mongoose.model<IProjectComments>('ProjectComments', ProjectCommentsSchema);

export default ProjectComments;

