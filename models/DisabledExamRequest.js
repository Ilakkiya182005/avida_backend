const mongoose = require('mongoose');
const axios = require('axios');

const DisabledExamRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    examName: { type: String, required: true, trim: true },
    latitude: { type: Number },
    longitude: { type: Number },
    examVenue: { type: String, required: true, trim: true },
    examSession: { type: String, required: true, enum: ['Morning', 'Afternoon', 'Evening'] },
    examDate: { type: Date, required: true },
    qualification_needed_for_volunteer: { type: String, required: true, enum: ['10th', '12th', 'UG', 'PG', 'Diploma'] },
    language_should_be_known_for_volunteer: { type: String, required: true, enum: ['Tamil', 'English', 'Others'] },
    gender: { type: String, enum: ["Female", "Male"], required: true, trim: true }
}, { timestamps: true });

// Function to get latitude and longitude using OpenStreetMap Nominatim API
async function getCoordinatesFromOSM(address) {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                q: address,
                format: 'json',
                limit: 1
            },
            headers: { 'User-Agent': 'rough/1.0' } // Required for OSM requests
        });

        if (response.data.length > 0) {
            return {
                latitude: parseFloat(response.data[0].lat),
                longitude: parseFloat(response.data[0].lon)
            };
        } else {
            throw new Error('Invalid Address');
        }
    } catch (error) {
        console.error("Error fetching geolocation from OSM:", error.message);
        throw error;
    }
}

// Middleware to fetch coordinates before saving
DisabledExamRequestSchema.pre('save', async function (next) {
    if (!this.isModified('examVenue')) return next(); // Only run if examVenue is modified

    try {
        const { latitude, longitude } = await getCoordinatesFromOSM(this.examVenue);
        this.latitude = latitude;
        this.longitude = longitude;
    } catch (error) {
        return next(error);
    }

    next();
});

module.exports = mongoose.model('DisabledExamRequest', DisabledExamRequestSchema);
