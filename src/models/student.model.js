import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  }
});

export const StudentModel = mongoose.model('Student', studentSchema);
