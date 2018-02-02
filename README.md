# Canvas Course Scrubber

## Overview
This tool's purpose is to scrub a Canvas course clean of content. The native tool to reset a course's content also changes the course's ID, and we needed a way to preserve a course's ID, while being able to clean out all of its content.

## Use

Install with: 

```
npm install --save byuitechops/canvas-course-scrubber
```

Require with:

```
const scrubber = require('canvas-course-scrubber');
```

Use with these different functions:

```js
// Require the module
const scrubber = require('canvas-course-scrubber');

// This scrubs an entire course - the below functions are not needed if you use this one
scrubber.scrubCourse(course object, callback);

// Deletes all of the assignments
scrubber.scrubAssignments(course object, callback);

// Deletes all of the files
scrubber.scrubFiles(course object, callback);

// Deletes all of the folders - INCLUDING any files in them - note that this does not delete files at the top level, and that this should be used in tandem with scrubFiles
scrubber.scrubFolders(course object, callback);

// Deletes all of the modules
scrubber.scrubModules(course object, callback);

// Deletes all of the quizzes
scrubber.scrubQuizzes(course object, callback);

// Deletes all of the pages
scrubber.scrubPages(course object, callback);

// Deletes all of the discussion boards
scrubber.scrubDiscussions(course object, callback);

// Deletes all of the groups and unenrolls their member
scrubber.scrubDiscussions(course object, callback);
```

## Note

- Announcements are not deleted (API does not provide a way to remove them)
- Enrolled members are not removed from the course
- Course settings are not changed, including the course name and code
- Outcomes are not changed
- The "course_image" folder will not be removed, since it is a part of the course settings
