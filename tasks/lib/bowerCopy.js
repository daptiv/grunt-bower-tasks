/*jshint node:true */

'use strict';

var path = require('path'),
    fs = require('fs'),
    _ = require('underscore');

var bowerCopy = function (bowerConfig, options) {
    this.bowerConfig = bowerConfig;
    this.options = options;
};

bowerCopy.prototype = {
    processPaths: function (moduleDefinitions) {
        var self = this,
            bowerSources = _.flatten(_.map(moduleDefinitions, _.bind(this.processFiles, this))),
            output = _.reduce(bowerSources, _.bind(this.processFile, this), [{
                expand: true,
                src: [],
                dest: self.options.destination,
                flatten: true
            }]);
        return output;
    },
    isDependency: function (dependency) {
        return this.bowerConfig.dependencies[dependency] !== undefined;
    },
    isDirectory: function (path) {
        return fs.statSync(path).isDirectory();
    },
    getPackageFile: function (dependency) {
        return this.bowerConfig.packageFiles[dependency] || false;
    },
    processFiles: function (files, module) {
        var self = this;
        if (this.isDependency(module)) {
            var packageFile = this.getPackageFile(module);
            if (packageFile) {
                files = _.map(packageFile, function (content) {
                    return path.join(self.options.source, module, content.file);
                });
            }
            else {
                files = _.isArray(files) ? files: files.split(', ');
            }

            return files;
        }
        return [];
    },
    processFile: function (filesToCopy, path) {
        if (this.isDirectory(path)) {
            throw new Error('This module does not prescribe files to be copied, add a packageFiles entry to bower.json');
        }
        else {
            filesToCopy[0].src.push(path);
        }
        return filesToCopy;
    }
};
module.exports = bowerCopy;
