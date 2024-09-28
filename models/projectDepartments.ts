import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IProjectDepartments extends Document {
  Depid: ObjectId | null;
  Staffs: ObjectId[] | null;
  _id: ObjectId;
}

const ProjectDepartmentsSchema: Schema = new Schema({
  Depid: { type: Schema.Types.ObjectId },
  Staffs: [{ type: Schema.Types.ObjectId, ref: "Users" }],
}, { timestamps: true });

const ProjectDepartments = mongoose.models?.ProjectDepartments || mongoose.model<IProjectDepartments>('ProjectDepartments', ProjectDepartmentsSchema);

export default ProjectDepartments;

