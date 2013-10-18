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
            dev: {
                src: ['test/**/*.js'],
                options: {
                    reporter: 'spec'
                }
            },
            teamcity: {
                src: ['test/**/*.js'],
                options: {
                    reporter: 'teamcity'
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-simple-mocha');

    // Default task.
    grunt.registerTask('default', 'Run jshint', ['jshint', 'simplemocha:dev']);

    grunt.registerTask('teamcity', 'Run jshint', ['jshint', 'simplemocha:teamcity']);
};
