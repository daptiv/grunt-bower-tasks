grunt-bower-tasks
=================

Bower tasks that allow bower to run its own commands plus some custom ones. This is a wrapper for grunt-bower which allows 
for configuration to include only packaged files

## Getting Started

Install this grunt plugin next to your project's grunt.js gruntfile with: npm install grunt-bower-tasks

Then add this line to your project's grunt.js gruntfile:

grunt.loadNpmTasks('grunt-bower-tasks');

## Documentation

### bower.json packageFiles
Only copy files listed by package. Provide dependency name as provided by bower. File is relative to the dependency's
folder within the bower folder (options.source).

<pre>
"packageFiles": {
  "dep": [
      {
        "file": "dep.js"
      },
      {
        "file": "css/dep.css
      }
  ]
}
</pre>
    
### Options

#### options.command

Calls command within bower.

install: {
    command: 'install'
}

is the same as:

bower install
    
#### options.subCommand

Allows for secondary command within bower.

clean: {
    command: 'cache',
    subCommand: 'clean'
}

is translates to:

bower cache clean

#### options.source

Source location to install and find bower dependencies

#### options.destination

Location which to copy dependencies.

#### Ex.
<pre>
grunt.initConfig({
    bower: {
        install: {
            command: 'install'
        },
        copy: {
            command: 'copy',
            source: <source>,
            destination: <destination>
        },
        clean: {
            command: 'cache',
            subCommand: 'clean'
        },
    }
}
</pre>
