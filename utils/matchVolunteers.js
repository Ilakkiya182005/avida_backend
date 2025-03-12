const matchVolunteers = async (examRequest, volunteers) => {
    console.log("Exam Request:", JSON.stringify(examRequest, null, 2));
    console.log("Volunteers List:", JSON.stringify(volunteers, null, 2));

    const { examVenue, examDate, qualification_needed_for_volunteer, language_should_be_known_for_volunteer } = examRequest;
    const matchedVolunteers = [];

    for (const volunteer of volunteers) {
        // ✅ Ensure `languages_known` exists
        if (!Array.isArray(volunteer.languages_known)) {
            console.log(`Skipping volunteer ${volunteer._id} due to missing languages_known.`);
            continue;
        }

        // ✅ City or Distance Check
        if (examVenue === volunteer.city || calculateDistance(examVenue, volunteer.city) <= volunteer.travel_distance_km) {
            console.log(`✅ Volunteer ${volunteer._id} is in ${volunteer.city} and within range.`);

            // ✅ Fix Date Comparison
            const formattedExamDate = new Date(examDate).toISOString().split("T")[0];
            const isDateAvailable = volunteer.available_dates.some(date => 
                new Date(date).toISOString().split("T")[0] === formattedExamDate
            );

            if (isDateAvailable) {
                console.log(`✅ Volunteer ${volunteer._id} is available on ${examDate}.`);

                // ✅ Qualification Check
                if (volunteer.qualification === qualification_needed_for_volunteer) {
                    console.log(`✅ Volunteer ${volunteer._id} has the required qualification.`);

                    // ✅ Language Match
                    const languageMatch = language_should_be_known_for_volunteer.some(lang => 
                        volunteer.languages_known.includes(lang)
                    );

                    if (languageMatch) {
                        console.log(`✅ Volunteer ${volunteer._id} matches the required language.`);
                        matchedVolunteers.push(volunteer);
                    } else {
                        console.log(`❌ Volunteer ${volunteer._id} does NOT match required language.`);
                    }
                } else {
                    console.log(`❌ Volunteer ${volunteer._id} has qualification ${volunteer.qualification}, expected ${qualification_needed_for_volunteer}.`);
                }
            } else {
                console.log(`❌ Volunteer ${volunteer._id} is NOT available on ${examDate}.`);
            }
        } else {
            console.log(`❌ Volunteer ${volunteer._id} is NOT in range.`);
        }
    }

    return matchedVolunteers;
};

module.exports = matchVolunteers;


