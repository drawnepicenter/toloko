'use strict';var themes=require('../../themes');var tools=require('../../tools');var _=require('lodash');var http=require('good-guy-http')();var noon=require('noon');var CFILE=process.env.HOME+'/.toloko.noon';exports.command='translate <query>';exports.aliases=['trans','tr'];exports.desc='Translate a word';exports.builder={out:{alias:'o',desc:'Write cson, json, noon, plist, yaml, xml',default:'',type:'string'},force:{alias:'f',desc:'Force overwriting outfile',default:false,type:'boolean'},save:{alias:'e',desc:'Save flags to config file',default:false,type:'boolean'},source:{alias:'s',desc:'3-letter ISO 693-3 source language code (Required)',default:'',type:'string'},target:{alias:'t',desc:'3-letter ISO 693-3 target language code (Required)',default:'',type:'string'}};exports.handler=function(argv){tools.checkConfig(CFILE);var config=noon.load(CFILE);var userConfig={source:argv.s,target:argv.t};if(config.merge)config=_.merge({},config,userConfig);if(argv.e&&config.merge)noon.save(CFILE,config);if(argv.e&&!config.merge)throw new Error("Can't save user config, set option merge to true.");var theme=themes.loadTheme(config.theme);if(config.verbose)themes.label(theme,'down','Hablaa');var prefix='http://hablaa.com/hs/translation/';var dcont=[];dcont.push(argv.query);if(argv._.length>1){for(var i=0;i<=argv._.length-1;i++){if(argv._[i]!=='ha'&&argv._[i]!=='tr')dcont.push(argv._[i]);}}var words='';if(dcont.length>1){words=dcont.join('+');}else{words=dcont[0];}var url=''+prefix+words+'/'+argv.s+'-'+argv.t+'/';url=encodeURI(url);var tofile={type:'hablaa',function:'translate',src:'http://hablaa.com'};http({url:url},function(error,response){if(!error&&response.statusCode===200){var body=JSON.parse(response.body);for(var _i=0;_i<=body.length-1;_i++){themes.label(theme,'right','Text',body[_i].text);themes.label(theme,'right','Source',body[_i].source);if(body[_i].pos.code!==null&&body[_i].pos.title!==null){themes.label(theme,'right','Part of speech');themes.label(theme,'right','Code',body[_i].pos.code);themes.label(theme,'right','Title',body[_i].pos.title);}if(body[_i].addinfo){var ai=body[_i].addinfo;for(var j=0;j<=ai.length-1;j++){themes.label(theme,'right','Part of speech');themes.label(theme,'right','Code',body[_i].addinfo[j].code);themes.label(theme,'right','Title',body[_i].addinfo[j].title);}}tofile[['result'+_i]]=body[_i];}if(argv.o)tools.outFile(argv.o,argv.f,tofile);}else{console.log(JSON.stringify(error,null,2));throw new Error(error);}});};