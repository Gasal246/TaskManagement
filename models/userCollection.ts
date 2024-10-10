import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IUsers extends Document {
  _id: ObjectId;
  Email: string;
  Password: string;
  Name: String;
  Documents: {
     DocName: String | null;
     DocUrl: String | null;
     ExpireAt: Date | null;
     RemindAt: Date | null;
  }[];
  Skills: String[] | null;
  Addedby: ObjectId | null;
  Region: ObjectId | null;
  Area: ObjectId | null;
  Department: ObjectId | null;
  IsRegionalHead: Boolean | null;
  IsAreaHead: Boolean | null;
  InitialEntry: Boolean | null;
  VerifyCode: String | null;
  AvatarUrl: String | null;
  Status: String | null;
  IsDeleted: Boolean;
  Address: {
    Country: String;
    Province: String;
    City: String;
    Pin: String;
  }
  Role: 'admin' | 'staff' | 'area-head' | 'dep-head' | 'region-head' | 'dep-staff' | 'reg-staff';
}

const UsersSchema: Schema = new Schema({
  Email: { type: String, required: true, unique: true },
  Name: { type: String, required: true },
  Password: { type: String },
  Documents: [{
     DocName: { type: String },
     DocUrl: { type: String },
     ExpireAt: { type: Date },
     RemindAt: { type: Date },
  }],
  Address: {
    Country: { type: String },
    City: { type: String },
    Province: { type: String },
    Pin: { type: String }
  },
  Skills: [{ type: String,  }],
  Addedby: { type: Schema.Types.ObjectId },
  InitialEntry: { type: Boolean, default: true },
  VerifyCode: { type: String },
  AvatarUrl: { type: String },
  Status: { type: String, enum: ['active', 'blocked', 'unverified']},
  Region: { type: Schema.Types.ObjectId, ref: "Regions" },
  Area: { type: Schema.Types.ObjectId, ref: "Areas" },
  Department: { type: Schema.Types.ObjectId, ref: "Departments" },
  IsDeleted: { type: Boolean, default: false },
  Role: { type: String, enum: ['admin', 'staff', 'area-head', 'dep-head', 'region-head', 'dep-staff', 'reg-staff']}
}, { timestamps: true });

const Users = mongoose.models?.Users || mongoose.model<IUsers>('Users', UsersSchema);

export default Users;

