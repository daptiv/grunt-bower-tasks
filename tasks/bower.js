var BowerTask = require('bowerTask');

module.exports = function (grunt) {
    'use strict';

    grunt.registerMultiTask('bower', 'execute bower tasks', function () {
        var bowerTask = new BowerTask(this, grunt);
        bowerTask.run();
    });
};
