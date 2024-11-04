import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface ITasks extends Document {
  _id: ObjectId;
  TaskName: String | null;
  Creator: ObjectId | null;
  Description: String | null;
  AcceptedBy: ObjectId | null;
  ForwardList: ObjectId[] | null;
  ProjectId: ObjectId | null;
  AdminId: ObjectId | null;
  AssignedUser: ObjectId | null;
  EnrolledBy: ObjectId[] | null;
  Status: String | null;
  Priority: String | null;
  ForwardType: String | null;
  AcceptedOn: Date | null;
  Deadline: Date | null;
  Department: ObjectId | null;
  Activities: {
    Title: String,
    Description: String,
    Proirity: String,
    Completed: Boolean
  }[];
  CompleteComment: String | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

const TasksSchema: Schema = new Schema({
  TaskName: { type: String },
  Creator: { type: Schema.Types.ObjectId, ref: "Users" },
  Description: { type: String },
  AcceptedBy: { type: Schema.Types.ObjectId, ref: "Users" },
  Department: { type: Schema.Types.ObjectId, ref: "Departments" },
  AcceptedOn: { type: Date },
  ForwardList: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  ProjectId: { type: Schema.Types.ObjectId },
  AdminId: { type: Schema.Types.ObjectId, ref: "Users" },
  EnrolledBy: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  Status: { type: String, enum: ['pending', 'completed', 'new'] },
  Priority: { type: String, enum: ['high', 'medium', 'low'], default: 'low' },
  Deadline: { type: Date },
  Activities: [{
    Title: { type: String },
    Description: { type: String },
    Priority: { type: String, enum: ['high', 'medium', 'low']},
    Completed: { type: Boolean, default: false }
  }],
  CompleteComment: { type: String }
}, { timestamps: true });

const Tasks = mongoose.models?.Tasks || mongoose.model<ITasks>('Tasks', TasksSchema);

export default Tasks;
