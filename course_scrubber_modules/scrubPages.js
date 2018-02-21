/* Deletes the content out of a Canvas course, preserving the course ID */

const canvas = require('canvas-wrapper');
const asyncLib = require('async');

module.exports = (course, stepCallback) => {

    function deletePage(page, eachCallback) {
        if (page.front_page == true) {
            eachCallback(null);
            return;
        }

        canvas.delete(`/api/v1/courses/${course.info.canvasOU}/pages/${page.page_id}`, (delErr) => {
            if (delErr) {
                course.error(delErr);
                eachCallback(null);
                return;
            }

            course.log('Prototype - Deleted Pages', {
                'Name': page.title,
                'ID': page.page_id
            });

            eachCallback(null);
        });
    }

    /* Get the pages so we can delete them */
    canvas.getPages(course.info.canvasOU, (err, pages) => {
        if (err) {
            course.error(err);
            stepCallback(null, course);
            return;
        }

        /* Delete each page */
        asyncLib.eachLimit(pages, 15, deletePage, (eachErr) => {
            if (eachErr) {
                course.error(eachErr);
                stepCallback(null, course);
                return;
            }

            stepCallback(null, course);
        });
    });
};