module.exports = function (grunt) {
  var path = require('path');   // added for express
  grunt.initConfig({
    copy: {
      main: {
        expand: true,
        cwd: 'src/',
        src: '**',
        dest: 'bin/'
      }
    },
    clean: {
      build: {
        src: ["bin"]
      }
    },
    express: {
      options: {
        port: 3000
      },
      dev: {
        options: {
          script: 'bin/bin/www',
          livereload: true
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      copy: {
        files: ['src/**/*.*'],
        tasks: ['copy:main']
      },
      express: {
        files: ['src/**/*.*'],
        tasks: ['express:dev'],
        options: {
          spawn: false
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('default', ['clean','copy','express', 'watch']);
  grunt.registerTask('build', ['clean', 'copy']);
}      
