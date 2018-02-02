/* Deletes the content out of a Canvas course, preserving the course ID */

const canvas = require('canvas-wrapper');
const asyncLib = require('async');

module.exports = (course, stepCallback) => {

    function deleteQuiz(quiz, eachCallback) {
        canvas.delete(`/api/v1/courses/${course.info.prototypeOU}/quizzes/${quiz.id}`, (delErr) => {
            if (delErr) {
                course.error(delErr);
                eachCallback(null);
                return;
            }

            course.log('Prototype - Deleted Quizzes', {
                'Name': quiz.title,
                'ID': quiz.id
            });

            eachCallback(null);
        });
    }

    /* Get the pages so we can delete them */
    canvas.getQuizzes(course.info.prototypeOU, (err, quizzes) => {
        if (err) {
            course.error(err);
            stepCallback(null, course);
            return;
        }

        /* Delete each page */
        asyncLib.eachLimit(quizzes, 15, deleteQuiz, (eachErr) => {
            if (eachErr) {
                course.error(eachErr);
                stepCallback(null, course);
                return;
            }

            stepCallback(null, course);
        });
    });
};