const mongoose = require("mongoose");

const VolunteerDetailSchema = new mongoose.Schema({
     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    state: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    languages_known: { 
        type: [String], 
        required: true, 
        enum: ["Tamil", "English", "Others"] ,
        default:[]
    },
    qualification: { 
        type: String, 
        required: true, 
        enum: ["10th", "12th", "Diploma", "UG", "PG"] 
    },
    available_dates: { 
        type: [Date],  // Array of Date objects
        required: true 
    },
    available_session: { 
        type: [String],  
        required: true,
        enum: ["morning", "afternoon", "evening"]
    },
    past_experience: { 
        type: String, 
        required: true, 
        enum: ["yes", "no"] 
    },
    travel_distance_km: { 
        type: Number, 
        required: true, 
        min: 0 
    }
}, { timestamps: true });

module.exports = mongoose.model('VolunteerDetail', VolunteerDetailSchema);

