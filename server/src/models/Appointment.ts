import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  name: string;
  email: string;
  phone: string;
  date: Date;
  message?: string;
  createdAt: Date;
}

const AppointmentSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema); 