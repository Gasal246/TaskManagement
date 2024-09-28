import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface ISkills extends Document {
  AdminId: ObjectId | null;
  Skills: String[] | null;
  _id: ObjectId;
  createdAt: Date | null;
  updatedAt: Date | null;
}

const SkillsSchema: Schema = new Schema({
  AdminId: { type: Schema.Types.ObjectId },
  Skills: [{ type: String,  }],
}, { timestamps: true });

const Skills = mongoose?.models?.Skills || mongoose.model<ISkills>('Skills', SkillsSchema);

export default Skills;

