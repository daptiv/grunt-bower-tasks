/*jshint node:true */
'use strict';

var BowerTask = require('../tasks/lib/bowerTask'),
    chai = require('chai'),
    sinon = require('sinon').sandbox.create();

var gruntTaskMock = function () {
    return {
        async: sinon.stub().returns(sinon.stub()),
        data: {}
    };
};

var gruntMock = function () {
    return {
        fail: {
            warn: sinon.stub()
        },
        log: {
            ok: sinon.stub(),
            warn: sinon.stub()
        },
        config: sinon.stub(),
        task: {
            run: sinon.stub()
        }
    };
};

describe('bowerTask', function () {

    before(function () {
        chai.should();
    });

    beforeEach(function () {
        this.gruntTaskMock = gruntTaskMock();
        this.gruntMock = gruntMock();
        this.bowerTask = new BowerTask(this.gruntTaskMock, this.gruntMock);
    });

    afterEach(function () {
        sinon.restore();
    });

    describe('run', function () {

        it('should run install command', function () {
            this.gruntTaskMock.data = {
                command: 'install',
                options: 'fakeOption'
            };
            var stub = sinon.stub(this.bowerTask, 'install');
            this.bowerTask.run();
            stub.calledWith('fakeOption', 10).should.be.true;
        });

        it('should run copy command', function () {
            this.gruntTaskMock.data = {
                command: 'copy'
            };
            var stub = sinon.stub(this.bowerTask, 'bowerCopy');
            this.bowerTask.run();
            stub.called.should.be.true;
        });

        it('should run cache clean command', function () {
            this.bowerTask.bower = {
                commands: {
                    'cache': {
                        'clean': sinon.spy()
                    }
                }
            };
            this.gruntTaskMock.data = {
                command: 'cache',
                subCommand: 'clean'
            };
            var stub = sinon.stub(this.bowerTask, 'runCommand');
            this.bowerTask.run();
            stub.calledWith('cache', 'clean').should.be.true;
        });

    });

    describe('runCommand', function () {

        it('should should run a command', function () {
            var stub = sinon.stub();
            stub.returns({
                on: stub
            });
            this.bowerTask.bower = {
                commands: {
                    'commandName': stub
                }
            };
            this.bowerTask.runCommand('commandName');
            stub.called.should.be.true;
        });

        it('should should run a subCommand', function () {
            var stub = sinon.stub();
            stub.returns({
                on: stub
            });
            this.bowerTask.bower = {
                commands: {
                    'commandName': {
                        'subCommandName': stub
                    }
                }
            };
            this.bowerTask.runCommand('commandName', 'subCommandName');
            stub.called.should.be.true;
        });

    });

    describe('bowerInstallError', function () {

        it('should retry install, with retryLimit reduced, and log warning when error code is "EPERM"', function () {

            var installStub = sinon.stub(this.bowerTask, 'install');

            this.bowerTask.bowerInstallError({code: 'EPERM'}, {}, 2);

            this.gruntMock.log.warn.called.should.be.true;
            installStub.called.should.be.true;
        });

        it('should not retry install when error code is "EPERM" and retryLimit is 0', function () {
            var installStub = sinon.stub(this.bowerTask, 'install');

            this.bowerTask.bowerInstallError({code: 'EPERM'}, {}, 0);

            this.gruntMock.log.warn.notCalled.should.be.true;
            this.gruntMock.fail.warn.called.should.be.true;
            installStub.notCalled.should.be.true;
        });

        it('should call gruntTask.fail.warn when error code is not "EPERM"', function () {
            var installStub = sinon.stub(this.bowerTask, 'install');

            this.bowerTask.bowerInstallError({code: 'EOENT'}, {}, 2);

            this.gruntMock.log.warn.notCalled.should.be.true;
            this.gruntMock.fail.warn.called.should.be.true;
            installStub.notCalled.should.be.true;
        });
    });

});

