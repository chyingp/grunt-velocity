/*
 * grunt-velocity
 * https://github.com/casperchen/grunt-velocity
 *
 * Copyright (c) 2014 chyingp
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  //require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  var path = require('path');

  var $config = {
    devPath: 'dev/',
    srcPath: 'src/'
  };

  grunt.registerMultiTask('velocity', 'velocity_complier', function(){

    var options = this.options({}),
      _data = options._data || {},
      needRender = options.render,
      engine = null;

        try {
            engine = require('velocityjs');
        } catch (e) {
            console.log(e.message);
            return;
        }

        console.log('velocity compiler start....');

        this.files.forEach(function(filePair){
          var ret = '';
          filePair.src.forEach(function(filepath) {

              var dataPath = filepath.replace(/vm$/, 'data');
              if (grunt.file.exists(dataPath)) {
                  //console.log(new Date - 0, dataPath);

                  var json = grunt.file.readJSON(dataPath, {encoding: 'utf8'});
                  grunt.util._.extend(json, _data);

                  var rawTmpl = grunt.file.read(filepath, {encoding: 'utf8'});
                  rawTmpl = rawTmpl.replace(/xinline\((.*)\)/g, function (match, $1) {
                      var inlineText = match;
                      try {
                          //console.log($1);
                          inlineText = grunt.file.read(path.dirname(filepath) + '/'+ $1, {encoding: 'utf8'});
                      } catch (e) {
                           console.log(e);
                      }
                      console.log(inlineText);
                      return inlineText;
                  });
                  if(needRender){
                    var html = ret = engine.render(rawTmpl, json);
                    // console.log('velocity:dev target is: '+$config.devPath + filepath.match(/\/([^\/]+)\.vm$/)[1] + '.html');
                  }else{
                    ret = rawTmpl;
                  }
              }
          });
      grunt.file.write(filePair.dest, ret, {encoding:'utf8'});
        });

        console.log('velocity compiler end....');
  });
};
