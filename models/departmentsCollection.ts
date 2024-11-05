import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IDepartments extends Document {
  _id: ObjectId;
  AdminId: ObjectId;
  DepartmentName: String;
  DepartmentHead: ObjectId | null;
  Staffs: ObjectId[] | null;
  Regions: ObjectId[] | null;
  AllowProjects: Boolean;
  AllowTasks: Boolean;
  MaximumStaffs: Number;
  IsDemo: Boolean | null;
  IsDeleted: Boolean | null;
}

const DepartmentsSchema: Schema = new Schema({
  AdminId: { type: Schema.Types.ObjectId, ref: "Users" },
  DepartmentName: { type: String, required: true },
  DepartmentHead: { type: Schema.Types.ObjectId, ref: "Users" },
  Staffs: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  Regions: [
    {
      RegionId: { type: Schema.Types.ObjectId, ref: "Regions" },
      Areas: [{ type: Schema.Types.ObjectId, ref: "Areas" }]
    }
  ],
  AllowProjects: { type: Boolean, required: true },
  AllowTasks: { type: Boolean, required: true },
  MaximumStaffs: { type: Number, required: true },
  IsDemo: { type: Boolean },
  IsDeleted: { type: Boolean },
  HeadPermission: [{ type: String }],
}, { timestamps: true });

const Departments = mongoose?.models?.Departments || mongoose.model<IDepartments>('Departments', DepartmentsSchema);

export default Departments;

