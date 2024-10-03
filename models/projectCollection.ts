import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IProjects extends Document {
    _id: ObjectId;
    Title: String | null;
    Description: String | null;
    AdminId: ObjectId | null;
    Creator: ObjectId | null;
    WorkingDepartment: ObjectId | null;
    Comments: ObjectId[] | [];
    Area: ObjectId | null;
    Deadline: Date | null;
    Priority: 'high' | 'average' | 'low' | null;
    IsDeleted: Boolean | null;
    IsCompleted: Boolean | null;
    Region: ObjectId | null;
    Documents: {
        AccessTo: ObjectId[] | null;
        DocName: String | null;
        DocUrl: String | null;
    }[];
    Flows: ObjectId[] | [];
    IsApproved: Boolean | null;
    OpenedBy: ObjectId[] | null;
    ClientId: ObjectId | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    AccessTo: ObjectId[] | [];
}

const ProjectsSchema: Schema = new Schema({
    Title: { type: String },
    Description: { type: String },
    AdminId: { type: Schema.Types.ObjectId, ref: "Users" },
    Creator: { type: Schema.Types.ObjectId, ref: "Users" },
    WorkingDepartment: { type: Schema.Types.ObjectId, ref: "Departments" },
    Deadline: { type: Date },
    Priority: { type: String, enum: ['high', 'average', 'low'] },
    IsDeleted: { type: Boolean },
    Region: { type: Schema.Types.ObjectId, ref: "Regions" },
    Area: { type: Schema.Types.ObjectId, ref: "Areas" },
    Documents: [{
        AccessTo: [{ type: Schema.Types.ObjectId, ref: "Users" }],
        DocName: { type: String },
        DocUrl: { type: String },
    }],
    Flows: [{ type: Schema.Types.ObjectId, ref: "ProjectFlows" }],
    Comments: [{ type: Schema.Types.ObjectId, ref: "ProjectComments" }],
    Departments: [{ type: Schema.Types.ObjectId, ref: "Departments" }],
    IsApproved: { type: Boolean },
    OpenedBy: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    AccessTo: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    IsCompleted: { type: Boolean, default: false },
    ClientId: { type: Schema.Types.ObjectId, ref: "Users" },
}, { timestamps: true });

const Projects = mongoose?.models?.Projects || mongoose.model<IProjects>('Projects', ProjectsSchema);

export default Projects;

