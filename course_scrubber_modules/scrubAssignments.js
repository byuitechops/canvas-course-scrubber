/* Deletes the content out of a Canvas course, preserving the course ID */

const canvas = require('canvas-wrapper');
const asyncLib = require('async');

module.exports = (course, stepCallback) => {

    function deleteAssignment(assignment, eachCallback) {
        canvas.delete(`/api/v1/courses/${course.info.canvasOU}/assignments/${assignment.id}`, (delErr) => {
            if (delErr) {
                course.error(delErr);
                eachCallback(null);
                return;
            }

            course.log('Prototype - Deleted Assignments', {
                'Name': assignment.name,
                'ID': assignment.id
            });

            eachCallback(null);
        });
    }

    /* Get the pages so we can delete them */
    canvas.getAssignments(course.info.canvasOU, (err, assignments) => {
        if (err) {
            course.error(err);
            stepCallback(null, course);
            return;
        }

        /* Delete each assignment */
        asyncLib.eachLimit(assignments, 15, deleteAssignment, (eachErr) => {
            if (eachErr) {
                course.error(eachErr);
                stepCallback(null, course);
                return;
            }

            stepCallback(null, course);
        });
    });
};