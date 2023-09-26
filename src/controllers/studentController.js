import express from 'express';
import { StudentModel } from '../models/student.model.js';

export const router = express.Router();

router.get('/', (req, res) => {
  res.render('student/addOrEdit', {
    viewTitle: 'Insert student'
  });
});

router.get('/list', async (req, res) => {
  try {
    const students = await StudentModel.find();
    res.render('student/list', {
      list: students
    });
  } catch (err) {
    throw new Error(err.message);
  }
});

router.post('/', async (req, res) => {

  if (req.body._id == '') {
    await insertRecord(req, res);
    res.redirect('/student/list');
  } else {
    await updateRecord(req, res);
    const students = await StudentModel.find();
    res.render('student/list', {
      list: students
    });
  }
});

async function insertRecord(req, res) {
  try {
    const student = new StudentModel({
      fullName: req.body.fullName,
      email: req.body.email,
      mobile: req.body.mobile,
      city: req.body.city
    });
    await student.save();
  } catch (err) {
    throw new Error(err.message);
  }
};

async function updateRecord(req, res) {
  try {
    await StudentModel.findByIdAndUpdate({ _id: req.body._id }, req.body);
  } catch (err) {
    throw new Error(err.message);
  }
}

router.get('/:id', async (req, res) => {
  try {
    const student = await StudentModel.findById(req.params.id);
    res.render('student/addOrEdit', {
      viewTtile: 'Update student',
      student: student
    });
    console.log(student);
  } catch (err) {
    throw new Error(err.message);
  }
});

router.get('/delete/:id', async (req, res) => {
  try {
    await StudentModel.findByIdAndDelete({ _id: req.params.id });
    res.redirect('/student/list');
  } catch (err) {
    throw new Error(err.message);
  }
});

