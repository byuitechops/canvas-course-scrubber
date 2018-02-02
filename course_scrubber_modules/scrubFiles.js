/* Deletes the content out of a Canvas course, preserving the course ID */

const canvas = require('canvas-wrapper');
const asyncLib = require('async');

module.exports = (course, stepCallback) => {

    function deleteFile(file, eachCallback) {
        canvas.delete(`/api/v1/files/${file.id}`, (delErr) => {
            if (delErr) {
                course.error(delErr);
                eachCallback(null);
                return;
            }

            course.log('Prototype - Deleted Files', {
                'Name': file.display_name,
                'ID': file.id
            });

            eachCallback(null);
        });
    }

    /* Get the pages so we can delete them */
    canvas.getFiles(course.info.prototypeOU, (err, files) => {
        if (err) {
            course.error(err);
            stepCallback(null, course);
            return;
        }

        /* Delete each page */
        asyncLib.eachLimit(files, 15, deleteFile, (eachErr) => {
            if (eachErr) {
                course.error(eachErr);
                stepCallback(null, course);
                return;
            }

            stepCallback(null, course);
        });
    });
};