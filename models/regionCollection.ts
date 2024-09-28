import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IRegions extends Document {
  _id: ObjectId;
  RegionHead: ObjectId;
  Administrator: ObjectId;
  RegionName: String;
  Staffs: ObjectId[] | null;
}

const RegionsSchema: Schema = new Schema({
  RegionHead: { type: Schema.Types.ObjectId, ref: "Users" },
  Administrator: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  RegionName: { type: String, required: true },
  Staffs: [{ type: Schema.Types.ObjectId }],
});

const Regions = mongoose.models?.Regions || mongoose.model<IRegions>('Regions', RegionsSchema);

export default Regions;

