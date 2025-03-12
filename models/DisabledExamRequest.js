const mongoose = require('mongoose');

const DisabledExamRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    examName: { type: String, required: true, trim: true },
    examVenue: { type: String, required: true, trim: true },
    examSession: { type: String, required: true, enum: ['morning', 'afternoon', 'evening'] },
    examDate: { type: Date, required: true },
    qualification_needed_for_volunteer: { type: String, required: true, enum: ['10th', '12th', 'UG', 'PG', 'Diploma'] },
    language_should_be_known_for_volunteer: { type: [String], required: true, enum: ['Tamil', 'English', 'Others'] },
    gender: { type:String,enum:["Female","Male"] ,required: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('DisabledExamRequest', DisabledExamRequestSchema);