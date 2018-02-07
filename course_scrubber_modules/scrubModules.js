/* Deletes the content out of a Canvas course, preserving the course ID */

const canvas = require('canvas-wrapper');
const asyncLib = require('async');

module.exports = (course, stepCallback) => {

    function deleteModule(module, eachCallback) {

        canvas.delete(`/api/v1/courses/${course.info.canvasOU}/modules/${module.id}`, (delErr) => {
            if (delErr) {
                course.error(delErr);
                eachCallback(null);
                return;
            }

            course.log('Prototype - Deleted Modules', {
                'Name': module.name,
                'ID': module.id
            });

            eachCallback(null);
        });
    }

    /* Get the pages so we can delete them */
    canvas.getModules(course.info.canvasOU, (err, modules) => {
        if (err) {
            course.error(err);
            stepCallback(null, course);
            return;
        }

        /* Delete each page */
        asyncLib.eachLimit(modules, 15, deleteModule, (eachErr) => {
            if (eachErr) {
                course.error(eachErr);
                stepCallback(null, course);
                return;
            }

            stepCallback(null, course);
        });
    });
};