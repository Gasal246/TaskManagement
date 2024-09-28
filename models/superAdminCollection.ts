import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface ISuperadmin extends Document {
  _id: ObjectId;
  Email: String;
  Password: String;
  SuperadminId: String;
}

const SuperadminSchema: Schema = new Schema({
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  SuperadminId: { type: String, required: true }
}, { timestamps: true });

const Superadmin = mongoose?.models?.Superadmin || mongoose.model<ISuperadmin>('Superadmin', SuperadminSchema);

export default Superadmin;

