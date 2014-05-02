module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dir: {
            publish: 'public/assets',
            build: '.build',
            dist: '.dist',
            src: 'src',
            vendor: {
                bower: 'bower_components',
                npm: 'node_modules'
            }
        },
        libs: {
            javascripts: [
            '<%= dir.vendor.bower %>/jquery/dist/jquery.js',
            '<%= dir.vendor.bower %>/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/button.js',
            '<%= dir.vendor.bower %>/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/dropdown.js',
            '<%= dir.vendor.bower %>/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/tab.js',
            '<%= dir.vendor.bower %>/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/tooltip.js',
            '<%= dir.vendor.bower %>/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/alert.js',
            '<%= dir.vendor.bower %>/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/transition.js',
            '<%= dir.vendor.bower %>/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/collapse.js',
            ]
        },
        clean: {
            build: [
            '<%= dir.build %>'
            ],
            dist: [
            '<%= dir.dist %>'
            ],
            publish: [
            '<%= dir.publish %>/css',
            '<%= dir.publish %>/fonts',
            '<%= dir.publish %>/img',
            '<%= dir.publish %>/js',
            ]
        },
        concat: {
            options: {
                separator: ';',
                stripBanners: true,
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            libs: {
                src: ['<%= libs.javascripts %>'],
                dest: '<%= dir.build %>/js/libs.js',
                nonull: true
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            libs: {
                files: {
                    '<%= dir.dist %>/js/libs.min.js': ['<%= concat.libs.dest %>']
                }
            },
            src: {
                files: [{
                    expand: true,
                    src: '**/*.js',
                    dest: '<%= dir.dist %>/js',
                    cwd: '<%= dir.src %>/javascripts'
                }]
            }
        },
        compass: {
            src: {
                options: {
                    sassDir: '<%= dir.src %>/sass',
                    cssDir: '<%= dir.dist %>/css',
                    environment: 'production',
                    raw: "preferred_syntax = :scss\n",
                    outputStyle: "expanded"
                }
            }
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: '<%= dir.dist %>/css',
                src: ['*.css', '!*.min.css'],
                dest: '<%= dir.dist %>/css',
                ext: '.min.css'
            }
        },
        jshint: {
            files: ['gruntfile.js', '<%= dir.src %>/**/*.js', 'test/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        copy: {
            build: {
                files: [{
                    expand:true,
                    cwd: '<%= dir.vendor.bower %>/bootstrap-sass-official/vendor/assets/stylesheets/',
                    src:['**'],
                    dest: '<%= dir.build %>/sass/bootstrap',
                },{
                    expand:true,
                    cwd: '<%= dir.vendor.bower %>/font-awesome/scss/',
                    src:['**'],
                    dest: '<%= dir.build %>/sass/font-awesome',
                },
                {
                    expand: true,
                    flatten: true,
                    src: '<%= dir.vendor.bower %>/**/{*.eot,*.svg,*ttf,*woff,*.otf}',
                    dest: '<%= dir.build %>/fonts',
                    filter: 'isFile'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: '<%= dir.build %>/fonts/**/{*.eot,*.svg,*ttf,*woff,*.otf}',
                    dest: '<%= dir.dist %>/fonts',
                    filter: 'isFile'
                }, {
                    expand: true,
                    cwd: '<%= dir.src %>',
                    src: ['images/**', 'fonts/**'],
                    dest: '<%= dir.dist %>'
                }]
            },
            publish: {
                files: [{
                    expand: true,
                    cwd: '<%= dir.dist %>/',
                    src: 'fonts/**',
                    dest: '<%= dir.publish %>/'
                }, {
                    expand: true,
                    filter: 'isFile',
                    flatten: true,
                    cwd: '<%= dir.dist %>/',
                    src: 'images/**',
                    dest: '<%= dir.publish %>/img'
                }, {
                    expand: true,
                    flatten: true,
                    filter: 'isFile',
                    src: '<%= dir.dist %>/css/*.min.css',
                    dest: '<%= dir.publish %>/css'
                }, {
                    expand: true,
                    flatten: true,
                    filter: 'isFile',
                    src: '<%= dir.dist %>/js/*.js',
                    dest: '<%= dir.publish %>/js',
                }]
            }
        },
        watch: {
            options: {
                livereload: true,
            },
            css: {
                files: ['<%= dir.src %>/sass/**/*'],
                tasks: ['compass','cssmin','copy:publish'],
            },
            img: {
                files: ['<%= dir.src %>/images/**/*'],
                tasks: ['copy:dist','copy:publish'],
            },
            fonts: {
                files: ['<%= dir.src %>/fonts/*'],
                tasks: ['copy:dist','copy:publish'],
            },
            javascript: {
                files: ['<%= dir.src %>/javascripts/*.js'],
                tasks: ['uglify', 'copy:dist','copy:publish'],
            }
        },

    });
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-compass');

grunt.registerTask('default', ['dist', 'copy:publish']);
grunt.registerTask('dist', ['build', 'compass', 'concat', 'uglify', 'cssmin','copy:dist']);
grunt.registerTask('build', ['jshint', 'clean', 'copy:build']);
grunt.registerTask('develop', ['default', 'watch']);
};