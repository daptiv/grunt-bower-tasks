module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            app: {
                src: [
                    'tasks/**/*.js'
                ]
            }
        },
        simplemocha: {
            options: {
                timeout: 3000,
                ignoreLeaks: false,
                ui: 'bdd'
            },
            all: {
                src: ['test/**/*.js'],
                options: {
                    reporter: 'spec'
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-simple-mocha');

    // Default task.
    grunt.registerTask('default', 'Run jshint', ['jshint', 'simplemocha:all']);

    grunt.registerTask('teamcity', 'Run jshint', ['jshint', 'simplemocha:teamcity']);
};
