var BowerCopy = require('../tasks/lib/bowerCopy'),
    chai = require('chai'),
    path = require('path'),
    sinon = require('sinon').sandbox.create(),
    bowerConfig = {
        'dependencies': {
            'jquery': '~2.0.3',
            'angular-unstable': '~1.1.5',
            'bootstrap': '~2.3.2',
            'requirejs': '~2.1.8',
            'requirejs-text': '~2.0.9',
            'underscore-amd': '~1.5.1'
        },
        'devDependencies': {
            'angular-mocks-unstable': '~1.1.5',
            'chai': '~1.7.2',
            'chai-jquery': '~1.1.1'
        },
        'packageFiles': {
            'requirejs': [
                {
                    'file': 'require.js'
                }
            ],
            'requirejs-text': [
                {
                    'file': 'text.js'
                }
            ],
            'underscore-amd': [
                {
                    'file': 'underscore.js'
                }
            ]
        }
    };


describe('bowerCopy', function () {
    'use strict';

    before(function () {
        this.bowerCopy = new BowerCopy({}, {destination: 'abc', source: 'def'});
        chai.should();
    });

    afterEach(function () {
        sinon.restore();
    });

    it('should find a dependency when passed a non devDependency', function () {
        this.bowerCopy.isDependency.call({bowerConfig: bowerConfig}, 'jquery').should.equal(true);
    });

    it('should not find a dependency when passed a devDependency', function () {
        this.bowerCopy.isDependency.call({bowerConfig: bowerConfig}, 'chai').should.equal(false);
    });

    it('should find a package file config when one exists', function () {
        this.bowerCopy.getPackageFile.call({bowerConfig: bowerConfig}, 'underscore-amd')
            .should.equal(bowerConfig.packageFiles['underscore-amd']);
    });

    it('should not find a package file config  when one does not exist', function () {
        this.bowerCopy.getPackageFile.call({bowerConfig: bowerConfig}, 'chai').should.equal(false);
    });

    describe('Process File', function () {
        beforeEach(function () {
            this.isDirectoryStub = sinon.stub(this.bowerCopy, 'isDirectory');
        });

        it('should modify first file copy config to include the new path if it is not a directory', function () {
            this.isDirectoryStub.returns(false);
            this.bowerCopy.processFile([{src: []}], 'a fancy path')
                .should.deep.equal([{src: ['a fancy path']}]);
        });

        it('should throw adding a file copy config if it is a directory', function () {
            var self = this,
                processFile = function () {
                    self.bowerCopy.processFile([{src: []}], 'a fancy path');
                };

            this.isDirectoryStub.returns(true);
            processFile.should['throw']('This module does not prescribe files to be copied, add a packageFiles entry to bower.json');
        });
    });

    describe('Process Files', function () {
        beforeEach(function () {
            this.isDependencyStub = sinon.stub(this.bowerCopy, 'isDependency');
            this.isDependencyStub.returns(true);
            this.getPackageFileStub = sinon.stub(this.bowerCopy, 'getPackageFile');
            this.getPackageFileStub.returns(false);
        });

        it('should not include a module if it is not a dependency', function () {
            this.isDependencyStub.returns(false);
            this.bowerCopy.processFiles({}, 'module1').should.deep.equal([]);
        });

        it('should set files for a module', function () {
            this.getPackageFileStub.returns([
                    {
                        file: 'location/of/file.js'
                    }
                ]);

            this.bowerCopy.processFiles({}, 'module1')
                .should.deep.equal([path.join('def', 'module1', 'location/of/file.js')]);
        });

        it('should process package file entry as an array of files', function () {
            var filesToShow = ['file/to/show/1', 'file/to/show/2'];
            this.bowerCopy.processFiles(filesToShow, 'module1').should.deep.equal(filesToShow);
        });

        it('should process package file entry as a csv of files', function () {
            var filesToShow = 'file/to/show/1, file/to/show/2';
            var filesToShowArray = ['file/to/show/1', 'file/to/show/2'];
            this.bowerCopy.processFiles(filesToShow, 'module1')
                .should.deep.equal(filesToShowArray);
        });

        it('should process package file entry as a single file', function () {
            var filesToShow = 'file/to/show/1';
            var filesToShowArray = ['file/to/show/1'];
            this.bowerCopy.processFiles(filesToShow, 'module1')
                .should.deep.equal(filesToShowArray);
        });
    });

    describe('Process Paths', function () {
        beforeEach(function () {
            this.isDependencyStub = sinon.stub(this.bowerCopy, 'isDependency');
            this.isDependencyStub.returns(true);
            this.getPackageFileStub = sinon.stub(this.bowerCopy, 'getPackageFile');
            this.getPackageFileStub.returns(false);
            this.isDirectoryStub = sinon.stub(this.bowerCopy, 'isDirectory');
            this.isDirectoryStub.returns(false);
        });

        it('Should get a grunt copy config for the files that need copying', function () {
            this.bowerCopy.processPaths({
                'module1': 'file/to/show/1',
                'module2': ['file/to/show/2', 'file/to/show/3'],
                'module3': 'file/to/show/4, file/to/show/5'
            }).should.deep.equal([{
                expand: true,
                src: ['file/to/show/1', 'file/to/show/2', 'file/to/show/3', 'file/to/show/4', 'file/to/show/5'],
                dest: 'abc',
                flatten: true
            }]);
        });

        it('should throw when processing a directory', function () {
            var self = this,
                processPaths = function () {
                    self.bowerCopy.processPaths({'module1': 'folder/to/show'});
                };

            this.isDirectoryStub.returns(true);
            processPaths.should['throw']('This module does not prescribe files to be copied, add a packageFiles entry to bower.json');
        });
    });
});
