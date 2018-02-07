/* Deletes the content out of a Canvas course, preserving the course ID */

const canvas = require('canvas-wrapper');
const asyncLib = require('async');

module.exports = (course, stepCallback) => {

    function deleteGroup(group, eachCallback) {
        canvas.delete(`/api/v1/groups/${group.id}`, (delErr) => {
            if (delErr) {
                course.error(delErr);
                eachCallback(null);
                return;
            }

            course.log('Prototype - Deleted Groups', {
                'Name': group.name,
                'ID': group.id
            });

            eachCallback(null);
        });
    }

    /* Get the pages so we can delete them */
    canvas.get(`/api/v1/courses/${course.info.canvasOU}/groups`, (err, groups) => {
        if (err) {
            course.error(err);
            stepCallback(null, course);
            return;
        }

        /* Delete each page */
        asyncLib.eachLimit(groups, 15, deleteGroup, (eachErr) => {
            if (eachErr) {
                course.error(eachErr);
                stepCallback(null, course);
                return;
            }

            stepCallback(null, course);
        });
    });
};