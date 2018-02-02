/* Deletes the content out of a Canvas course, preserving the course ID */

const canvas = require('canvas-wrapper');

module.exports = (course, stepCallback) => {

    var putObj = {
        'syllabus_body': ''
    }

    canvas.put(`/api/v1/courses/${course.info.prototypeOU}`, putObj, (err, newCourse) => {
        if (err) {
            course.error(err);
            return;
        }

        stepCallback(null);
    });

};