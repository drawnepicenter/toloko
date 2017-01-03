'use strict';/* eslint no-unused-vars: 0 */var themes=require('../../themes');var tools=require('../../tools');var _=require('lodash');var chalk=require('chalk');var fs=require('fs');var http=require('good-guy-http')();var noon=require('noon');var CFILE=process.env.HOME+'/.toloko.noon';exports.command='ex <query>';exports.desc='Fetches examples';exports.builder={out:{alias:'o',desc:'Write cson, json, noon, plist, yaml, xml',default:'',type:'string'},force:{alias:'f',desc:'Force overwriting outfile',default:false,type:'boolean'},save:{alias:'e',desc:'Save flags to config file',default:false,type:'boolean'},source:{alias:'s',desc:'3-letter ISO 693-3 source language code (Required)',default:'',type:'string'},target:{alias:'t',desc:'3-letter ISO 693-3 target language code (Required)',default:'',type:'string'},page:{alias:'p',desc:'Page of results to be displayed (200 Max)',default:1,type:'number'},size:{alias:'z',desc:'Size of the result page (30 Max)',default:1,type:'number'}};exports.handler=function(argv){tools.checkConfig(CFILE);var config=noon.load(CFILE);var userConfig={source:argv.s,target:argv.t,page:argv.p,size:argv.z};if(config.merge)config=_.merge({},config,userConfig);if(argv.e&&config.merge)noon.save(CFILE,config);if(argv.e&&!config.merge)throw new Error("Can't save user config, set option merge to true.");var theme=themes.loadTheme(config.theme);if(config.verbose)themes.label(theme,'down','Glosbe');var prefix='https://glosbe.com/gapi/tm?';var dcont=[];dcont.push(argv.query);if(argv._.length>1){_.each(argv._,function(value){if(value!=='gl'&&value!=='ex')dcont.push(value);});}var words='';if(dcont.length>1){words=dcont.join('+');}else{words=dcont[0];}var ucont=[];ucont.push('from='+argv.s);ucont.push('dest='+argv.t);ucont.push('page='+argv.p);ucont.push('pageSize='+argv.z);ucont.push('phrase='+words);ucont.push('format=json');ucont.push('pretty=true');var url=''+prefix+ucont.join('&');url=encodeURI(url);var tofile={type:'glosbe',function:'examples',src:'http://glosbe.com'};http({url:url},function(error,response){if(!error&&response.statusCode===200){// console.log(response.body)
var body=JSON.parse(response.body);if(body.result==='ok'){(function(){console.log('Found '+body.found+' results. Page '+body.page+', size '+body.pageSize+' items.');tofile.examples={};var i=0;_.map(body.examples,function(value){themes.label(theme,'right','Author',value.author);themes.label(theme,'right','Example',value.first);themes.label(theme,'right','Translation',value.second);tofile.examples[['example'+i]]=value;i++;});})();}if(argv.o)tools.outFile(argv.o,argv.f,tofile);}else{throw new Error('HTTP '+error.statusCode+': '+error.reponse.body);}});};