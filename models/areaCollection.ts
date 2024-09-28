import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IAreas extends Document {
  _id: ObjectId;
  RegionId: ObjectId;
  Administrator?: ObjectId | null;
  Areaname?: string | null;
  AreaHead?: ObjectId | null;
  Staffs?: ObjectId[] | null;
}

const AreasSchema: Schema = new Schema({
  RegionId: { type: Schema.Types.ObjectId, required: true, ref: "Regions" },
  Administrator: { type: Schema.Types.ObjectId, ref: "Users", default: null },
  Areaname: { type: String, default: null },
  AreaHead: { type: Schema.Types.ObjectId, ref: "Users", default: null },
  Staffs: [{ type: Schema.Types.ObjectId, ref: "Users", default: [] }],
});

const Areas = mongoose.models?.Areas || mongoose.model<IAreas>('Areas', AreasSchema);

export default Areas;
