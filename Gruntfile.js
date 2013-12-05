module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-ngmin');

  grunt.loadNpmTasks('grunt-karma');

  grunt.loadTasks('./grunt_tasks/');


  assets = {
    css: {
      path: "assets/stylesheets/"
    },
    js: {
      path: "assets/javascripts/"
    },
    images: {
      path: "assets/imagesmages/"
    }
  };


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      options: {
        port: 4000
      },
      server: {
        options: {
          keepalive: false
        }
      }
    },

    clean: {
      tmp: ['tmp'],
      fonts: ['public/font', 'tmp/font'],
      javascripts: ['public/javascripts', 'tmp/javascripts'],
      images: ['public/images', 'tmp/images'],
      stylesheets: ['public/stylesheets', 'tmp/stylesheets']
    },

    copy: {
      styles: {
        expand: true,
        src: '**/**.css',
        dest: 'tmp/stylesheets/',
        cwd: assets.css.path
      },
      scripts: {
        expand: true,
        src: '**/**.js',
        dest: 'tmp/javascripts/',
        cwd: assets.js.path
      },
      fonts: {
        expand: true,
        src: '**',
        dest: 'public/font/',
        cwd: "assets/font/"
      },
      images: {
        expand: true,
        src: '**',
        dest: 'public/images/',
        cwd: "assets/images/"
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
        dest: 'tmp/javascripts/',
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
        dest: 'tmp/stylesheets/',
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
            "tmp/javascripts/template_cache.js",
            "tmp/javascripts/modules.js",
            "tmp/javascripts/imagesnit.js",
            "tmp/javascripts/controllers/**/**.js",
            "tmp/javascripts/services/**/**.js",
            "tmp/javascripts/directives/**/**.js",
            "tmp/javascripts/models/**/**.js",
            "tmp/javascripts/filters/**/**.js"
          ],
          'public/javascripts/lib.js': [
            "assets/lib/jquery.js",
            "assets/lib/angular/angular.js",
            "assets/lib/**/**.js"
          ],
          'public/javascripts/advertisment.js': ['tmp/javascripts/advertisment.js']
        }
      },

      javascripts_dev: {
        files: {
          'public/javascripts/app.js': [
            "env/dev/dev-modules.js",
            "public/javascripts/app.js",
            "env/dev/dev-app.js"
          ]
        }
      },

      stylesheets: {
        files: {
          'public/stylesheets/app.css': [
            "tmp/stylesheets/bootstrap.css",
            "tmp/stylesheets/bootstrap-responsive.css",
            "tmp/stylesheets/base.css",
            "tmp/stylesheets/markup.css",
            "tmp/stylesheets/**/**.css"
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
      views: {
        files: [ assets.views.path + '**/**.html'],
        tasks: ['compile_javascripts'],
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
        tasks: ['compile_javascripts_dev'],
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
  grunt.registerTask('build_template_cache', ['angular_template_cache']);


  grunt.registerTask('test:e2e', ['connect:testserver', 'karma:e2e']);
  grunt.registerTask('test', ['karma:unit', 'test:e2e']);



  grunt.registerTask('build_template_cache', ['angular_template_cache']);
  grunt.registerTask('compile_javascripts', ['clean:javascripts', 'build_template_cache', 'coffee', 'copy:scripts', 'concat:javascripts']);

  grunt.registerTask('compile_javascripts_dev', ['compile_javascripts', 'concat:javascripts_dev']);

  grunt.registerTask('compile_styles', ['clean:stylesheets', 'stylus', 'copy:styles', 'concat:stylesheets']);
  grunt.registerTask('compile_images', ['clean:images', 'copy:images']);
  grunt.registerTask('compile_fonts', ['clean:fonts', 'copy:fonts'])
  grunt.registerTask('compile', ['compile_javascripts', 'compile_styles']);
  grunt.registerTask('compress', ['compile', 'ngmin', 'uglify']);

  grunt.registerTask('build', ['compress', 'compile_images', 'compile_fonts']);

  grunt.registerTask('unit:auto', ['compile', 'karma:unit_auto']);

  grunt.registerTask('test:e2e', ['build', 'connect:server', 'karma:e2e']);
  grunt.registerTask('test:e2e_auto', ['connect:server', 'karma:e2e_auto']);
  grunt.registerTask('test', ['karma:unit', 'test:e2e']);
};
