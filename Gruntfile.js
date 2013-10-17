module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        // Lint all non-generated javascript files
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            app: {
                src: [
                    'tasks/**/*.js'
                ]
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task.
    grunt.registerTask('default', 'Build and run live tests and packaging', ['jshint']);
};
