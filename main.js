/* Deletes all content from a course programmatically, so we can preserve the ID of the course */

const asyncLib = require('async');
const scrubPages = require('./course_scrubber_modules/scrubPages.js');
const scrubDiscussions = require('./course_scrubber_modules/scrubDiscussions.js');
const scrubQuizzes = require('./course_scrubber_modules/scrubQuizzes.js');
const scrubFiles = require('./course_scrubber_modules/scrubFiles.js');
const scrubFolders = require('./course_scrubber_modules/scrubFolders.js');
const scrubAssignments = require('./course_scrubber_modules/scrubAssignments.js');
const scrubModules = require('./course_scrubber_modules/scrubModules.js');
const scrubGroups = require('./course_scrubber_modules/scrubGroups.js');


var scrubCourse = (course, stepCallback) => {

    course.info.prototypeOU = course.info.canvasOU;

    /* If there isn't an ID provided for a prototype course, there's nothing to scrub */
    if (!course.info.prototypeOU) {
        course.message('No Prototype ID provided. Scrubbing the course is not necessary.');
        stepCallback(null, course);
        return;
    }

    var scrubbers = [
        asyncLib.constant(course),
        scrubPages,
        scrubDiscussions,
        scrubQuizzes,
        scrubFiles,
        scrubFolders,
        scrubAssignments,
        scrubModules,
        scrubGroups
    ];

    asyncLib.waterfall(scrubbers, (err) => {
        if (err) {
            stepCallback(err);
            return;
        }
        /* Take us back up when were done */
        stepCallback(null);
    });
};

module.exports = {
    scrubCourse: scrubCourse,
    scrubAssignments: scrubAssignments,
    scrubDiscussions: scrubDiscussions,
    scrubFiles: scrubFiles,
    scrubFolders: scrubFolders,
    scrubPages: scrubPages,
    scrubQuizzes: scrubQuizzes,
    scrubModules: scrubModules,
    scrubGroups: scrubGroups
};
