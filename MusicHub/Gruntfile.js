var path = require('path');

var exe = "www";
var dirSrc = "bin/";
var dirLog = "logs/";
var log = path.join(__dirname, dirLog,"logs.log");
var outfile = path.join(__dirname, dirLog,"outfile.log");
var error = path.join(__dirname, dirLog,"errors.log");
var command = " -c node --max_old_space_size=2048 ";
var options = " -a -l "+log+" -o "+outfile+" -e "+error+" ";
var dirForever = "node_modules/.bin";
var forever = path.join(__dirname, dirForever,"forever");

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        open: {
            navigateur: {
                path: 'http://localhost:3000',
                app: 'Chrome'
            }
        },
        shell: {
            start: {
                command: forever+" start "+options+command+dirSrc+exe+" &"
           },
           restart: {
                command: forever+" restart "+options+command+dirSrc+exe+" &"
           },
            stop: {
                command: forever+" stop "+dirSrc+exe
            }
        }
    });
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-shell');
    grunt.registerTask('start', [ 'shell:start' ]);
    grunt.registerTask('restart', ['shell:restart']);
    grunt.registerTask('stop', ['shell:stop']);
};