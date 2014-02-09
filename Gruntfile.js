module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-stylus');

  assets = {
    css: {
      path: "assets/stylesheets/"
    },
    js: {
      path: "assets/javascripts/"
    },
    images: {
      path: "assets/images/"
    },
    fonts: {
      path: "assets/fonts/"
    }
  };


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),


    clean: {
      tmp: ['tmp'],
      fonts: ['public/font', '_tmp/font'],
      javascripts: ['public/javascripts', '_tmp/javascripts'],
      images: ['public/images', '_tmp/images'],
      stylesheets: ['public/stylesheets', '_tmp/stylesheets']
    },

    copy: {
      styles: {
        expand: true,
        src: '**/**.css',
        dest: '_tmp/stylesheets/',
        cwd: assets.css.path
      },
      scripts: {
        expand: true,
        src: '**/**.js',
        dest: '_tmp/javascripts/',
        cwd: assets.js.path
      },
      fonts: {
        expand: true,
        src: '**',
        dest: 'public/fonts/',
        cwd: assets.fonts.path
      },
      flat_ui_fonts: {
        expand: true,
        src: '**',
        dest: 'public/fonts',
        cwd: "assets/components/Flat-UI/fonts"
      },
      fontawesome_fonts: {
        expand: true,
        src: '**',
        dest: 'public/fonts',
        cwd: "assets/components/font-awesome/fonts/"
      },
      images: {
        expand: true,
        src: '**',
        dest: 'public/images/',
        cwd: assets.images.path
      }
    },

    uglify: {
      options: {
        mangle: {
          except: ['jQuery', 'Backbone', 'angular']
        }
      },

      javascripts: {
        files: {
          'public/javascripts/app-min.js': [
            'public/javascripts/lib.js',
            'public/javascripts/app.js'
          ]
        }
      }
    },

    coffee: {
      compile: {
        expand: true,
        flatten: false,
        cwd: assets.js.path,
        src: ['**/**.coffee'],
        dest: '_tmp/javascripts/',
        ext: '.js'
      }
    },

    stylus: {
      compile: {
        expand: true,
        linenos: true,
        flatten: false,
        cwd: assets.css.path,
        src: ['**/**.styl'],
        dest: '_tmp/stylesheets/',
        ext: '.css'
      }
    },

    concat: {
      javascripts: {
        options: {
          separator: ';'
        },
        files: {
          'public/javascripts/app.js': [
            "_tmp/javascripts/**/**.js"
          ],
          'public/javascripts/lib.js': [
            "assets/components/angular/angular.js",
            "assets/components/angular-google-maps/dist/angular-google-maps.js"
          ]
        }
      },


      stylesheets: {
        files: {
          'public/stylesheets/style.css': [
            "assets/components/Flat-UI/bootstrap/css/bootstrap.css",
            "assets/components/Flat-UI/css/flat-ui.css",
            "assets/components/font-awesome/font-awesome.css",
            "_tmp/stylesheets/**/**.css"
          ]
        }
      }
    },
    watch: {
      images: {
        files: ['assets/images/**/**'],
        tasks: ['compile_images'],
        options: {
          atBegin: true
        }
      },
      fonts: {
        files: ['assets/font/**/**'],
        tasks: ['compile_fonts'],
        options: {
          atBegin: true
        }
      },
      stylesheets: {
        files: [ assets.css.path + '**/**.css', assets.css.path + '/**/**.styl'],
        tasks: ['compile_styles'],
        options: {
          atBegin: true
        }
      },
      scripts: {
        files: [ assets.js.path + '**/**.js', assets.js.path + '**/**.coffee', 'test/**/**.js'],
        tasks: ['compile_javascripts'],
        options: {
          atBegin: true
        }
      }
    },

    // CSSLint
    // -------
    csslint: {
      all: 'public/stylesheets/app.css',
      options: {
        absoluteFilePathsForFormatters: true,
        formatters: [
          {id: 'lint-xml', dest: '../stylesheetslint.xml'}
        ]
      }
    },
    // end csslint

    // JSHint
    // ------
    jshint: {
      all: 'public/javascripts/app.js',
      options: {
        reporter: 'jslint',
        reporterOutput: '../javascriptslint.xml'
      }
    }
    // end jshint


  });

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });

  grunt.registerTask('compile_javascripts', ['clean:javascripts', 'coffee', 'copy:scripts', 'concat:javascripts']);
  grunt.registerTask('compile_styles', ['clean:stylesheets', 'stylus', 'copy:styles', 'concat:stylesheets']);
  grunt.registerTask('compile_images', ['clean:images', 'copy:images']);
  grunt.registerTask('compile_fonts', ['clean:fonts', 'copy:fonts', 'copy:flat_ui_fonts', 'copy:fontawesome_fonts']);
  grunt.registerTask('compile', ['compile_javascripts', 'compile_styles']);
  grunt.registerTask('build', ['compile', 'uglify', 'compile_images', 'compile_fonts']);

  grunt.registerTask('heroku:production', ['build']);
};
