/*jshint node:true */
'use strict';
var bower = require('bower'),
    BowerCopy = require('./bowerCopy'),
    INSTALL_RETRY_LIMIT = 10;

var BowerTask = function (gruntTask, grunt) {
    this.gruntTask = gruntTask;
    this.grunt = grunt;
    this.bower = bower;
    this.BowerCopy = BowerCopy;
    this.bowerDone = this.gruntTask.async();
};

BowerTask.prototype = {
    run: function () {
        var command = this.gruntTask.data.command,
            subCommand = this.gruntTask.data.subCommand;
        this.grunt.log.ok('running bower task', command);
        switch (command)
        {
        case 'install':
            this.install(undefined, this.gruntTask.data.options, INSTALL_RETRY_LIMIT);
            break;
        case 'copy':
            this.bowerCopy();
            break;
        case 'version':
            this.bowerVersion();
            break;
        default:
            this.runCommand(command, subCommand);
            break;
        }
    },

    runCommand: function (commandName, subCommandName) {
        var command = this.bower.commands[commandName];
        if (subCommandName) {
            this.grunt.log.ok('running bower sub task', subCommandName);
            command = command[subCommandName];
        }
        command(this.gruntTask.data.options)
            .on('end', this.bowerDone.bind(this))
            .on('error', this.bowerError.bind(this));
    },

    bowerCopy: function () {
        this.bower.commands.list({ paths: true }, { offline: true })
            .on('end', this.bowerListResponse.bind(this))
            .on('error', this.bowerError.bind(this));
    },

    bowerVersion: function()  {
        this.bower.commands.list({ paths: false }, { offline: true })
            .on('end', this.bowerVersionResponse.bind(this))
            .on('error', this.bowerError.bind(this));
    },

    bowerError: function (e) {
        this.grunt.fail.warn(e.message);
    },

    bowerInstallError: function (e, options, retryLimit) {
        if (e.code === 'EPERM' && retryLimit > 0) {
            this.grunt.log.warn('Retrying bower install: ' + retryLimit + ' more times', e.message);
            this.install(options, retryLimit--);
        }
        else {
            this.bowerError(e);
        }
    },

    bowerListResponse:  function (bowerModules) {
        var bowerCopy = new BowerCopy(this.getBowerJson(), {
                destination: this.gruntTask.data.destination,
                source: this.gruntTask.data.source
            }),
            filesToCopy = bowerCopy.processPaths(bowerModules);
        this.grunt.config(['copy', 'bower'], {
            files: filesToCopy
        });
        this.grunt.task.run('copy:bower');
        this.bowerDone();
    },

    getBowerJson: function () {
        return this.grunt.file.readJSON('bower.json');
    },

    bowerVersionResponse: function(bowerModules) {
        this.grunt.log.writeln('Bower@' + this.bower.version);
        for (var depName in bowerModules.dependencies) {
            this.printVersionTree(bowerModules.dependencies[depName], 0);
        }
        this.bowerDone();
    },

    printVersionTree: function(pkg, depth) {
        this.grunt.log.writeln('-> ' + pkg.pkgMeta.name + '@' + pkg.pkgMeta.version);
        for (var dep in pkg.dependencies) {
            this.grunt.log.write(new Array(depth + 2).join('  '));
            this.printVersionTree(pkg.dependencies[dep], depth + 1);
        }
    },

    install: function (options, retryLimit) {
        this.bower.commands.install(options)
            .on('end', this.bowerDone.bind(this))
            .on('error', function (e) { this.bowerInstallError(e, options, retryLimit); }.bind(this));
    }
};

module.exports = BowerTask;
