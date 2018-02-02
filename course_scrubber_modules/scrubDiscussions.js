/* Deletes the content out of a Canvas course, preserving the course ID */

const canvas = require('canvas-wrapper');
const asyncLib = require('async');

module.exports = (course, stepCallback) => {

    function deleteTopic(discussion_topic, eachCallback) {
        canvas.delete(`/api/v1/courses/${course.info.prototypeOU}/discussion_topics/${discussion_topic.id}`, (delErr) => {
            if (delErr) {
                course.error(delErr);
                eachCallback(null);
                return;
            }

            course.log('Prototype - Deleted Discussion Topics', {
                'Name': discussion_topic.title,
                'ID': discussion_topic.id
            });

            eachCallback(null);
        });
    }

    /* Get the topics so we can delete them */
    canvas.getDiscussions(course.info.prototypeOU, (err, topics) => {
        if (err) {
            course.error(err);
            stepCallback(null, course);
            return;
        }

        /* Delete each topic */
        asyncLib.eachLimit(topics, 15, deleteTopic, (eachErr) => {
            if (eachErr) {
                course.error(eachErr);
                stepCallback(null, course);
                return;
            }

            stepCallback(null, course);
        });
    });
};