/* Deletes the content out of a Canvas course, preserving the course ID */

const canvas = require('canvas-wrapper');
const asyncLib = require('async');

module.exports = (course, stepCallback) => {

    function deleteFolder(folder, eachCallback) {
        if (folder.parent_folder_id == null) {
            eachCallback(null);
            return;
        }
        canvas.delete(`/api/v1/folders/${folder.id}?force=true`, (delErr) => {
            if (delErr) {
                course.error(delErr);
                eachCallback(null);
                return;
            }

            course.log('Prototype - Deleted Folders', {
                'Name': folder.name,
                'ID': folder.id
            });

            eachCallback(null);
        });
    }

    /* Get the pages so we can delete them */
    canvas.get(`/api/v1/courses/${course.info.prototypeOU}/folders`, (err, folders) => {
        if (err) {
            course.error(err);
            stepCallback(null, course);
            return;
        }

        /* Delete each page */
        asyncLib.eachLimit(folders, 15, deleteFolder, (eachErr) => {
            if (eachErr) {
                course.error(eachErr);
                stepCallback(null, course);
                return;
            }

            stepCallback(null, course);
        });
    });
};