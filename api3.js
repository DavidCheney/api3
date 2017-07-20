///// Primary Data API3 GraphQL tests

// david.cheney@primarydata.com

var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema, GraphQLScalarType } = require('graphql');
var { execute, subscribe } = require('graphql');

var { PubSub } = require('graphql-subscriptions');
var { createServer } = require('http');
var { SubscriptionServer } = require('subscriptions-transport-ws');
var { Kind } = require('graphql/language');

///// data schema

// var { types } = require('./schemas/types.js');
var { types } = require('./schemas/amdb.js');

var schema = buildSchema(types);


///// query resolvers

let root = { 
  hello: () => 'Hello world!', 
  dataSphere: () => dataSphere,
  users: () => users,
  user:  (args) => { return find( users, { id: args.id } ); },
  files: (args) => { return find( files, { type: args.type } ) },
  filesStats: () => filesStats,
  events: () => events,
  storage: () => { return storageResources; },
  tasks: () => { return convertObjectsFieldToJson(tasks, 'paramsMap'); },
  activity: (args) => { return find( activity, { id: args.id } ); },
  alignment: () => alignment,
  performance: () => performance,
  capacity: () => capacity
};


///// mock data 

const files = require('./mock/response_to_files.json');
// console.log("response_to_files", response_to_files);
const filesStats = require('./mock/response_to_data-analytics.json');
const events = require('./mock/response_to_events.json');
const tasks = require('./mock/response_to_tasks.json');
const activity = require('./mock/response_to_reports_activity-analytics.json');
const alignment = require('./mock/response_to_reports_moe_compliance.json');
const performance = require('./mock/response_to_reports_moe_performance.json');
const capacity = require('./mock/response_to_reports_moe_space.json');
const dataSphere = require('./mock/api3_data.json');

const storageResources = dataSphere.virtualDataSpheres[1].storageResources;

let users = [
  { id:1, name:"Dave" },
  { id:2, name:"Chuck", files:files, filesStats:[] },
  { id:3, name:"Victoria", files:[], filesStats:filesStats },
  { id:4, name:"Simeon", date:1499895679, files:files, filesStats:filesStats },
  { id:5, name:"Paul", files:[], filesStats:[] },
  { id:6, name:"Mary", files:null, filesStats:null },
  { id:7, name:"Ted" }
];


///// private methods

function find(array, kv_pair) {
  if (! kv_pair || ! Object.keys(kv_pair) || ! Object.keys(kv_pair)[0]) {
    return array;
  }
  if (Object.keys(kv_pair)[0] === 'id' && Object.values(kv_pair)[0] === -1) {
    return array;
  }
  if (Object.keys(kv_pair)[0] === 'type' && Object.values(kv_pair)[0] === "ALL") {
    return array;
  }
  let matches = [];
  let key = Object.keys(kv_pair)[0];
  let value = Object.values(kv_pair)[0];
  // console.log("find", kv_pair);
  for (var i = 0; i < array.length; i++) {
    if (array[i][key] && array[i][key] === value) {
      matches.push(array[i]);
    }
  }  
  return matches;
}

function delayedFind(array, kv_pair) {
  // this was used to test stacked requests, parallel server processing,
  // and out of order response handling.  The results: stacked requests and 
  // parallel server processing work as expected; graphiql does not show 
  // multiple query responses.
  return new Promise((resolve, reject) => {
    console.log("promise",kv_pair);
    setTimeout(() => { 
      console.log("resolve",kv_pair); 
      resolve(find ( array, kv_pair ));
    }, getRandomInt(4,9) * 1000)
  })
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function convertObjectsFieldToJson(array, field) {
  for (var i = 0; i < array.length; i++) {
    var record = array[i];
    if (! array[i][field]) { continue };
    var object = array[i][field];
    var json = null;
    try {
      json = JSON.stringify(object);
    } catch (err) {
      console.error("convertObjectsFieldToJson error on objectof type " + typeof object, err);
      continue;
    }
    if (json) {
      var newField = field + "Json";
      array[i][newField] = json;
      // console.log("convertObjectsFieldToJson result", json);
    }
  }
  return array;
}


///// server

var app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));


///// trials

//  type File {
//    	access: String, //null,
//    	children: String, //null,
//    	compliance: String, //null,
//    	executable: Boolean,
//    	explicit: Boolean,
//    	lastModified: String,
//    	logicalSize: String, //null,
//    	movers: String, //null,
//    	name: String,
//    	parent: String,
//    	path: String,
//    	permanentDataLoss:Boolean,
//    	physicalSize: String, //null,
//    	profileName: String,
//    	readable:Boolean,
//    	shareName: String,
//    	sharePath: String,
//    	size: String, //null,
//    	sloTargets: String, //null,
//    	slos: String, //null,
//    	type: String,
//    	volumes: String, //null,
//    	writable:Boolean
//  }


// var GraphQLPercent = exports.GraphQLPercent = new GraphQLScalarType({
//   name: 'Percent',
//   description: 'The `Percent` scalar type represents Integer values between 1 and 100. ',
//   serialize: coercePercent,
//   parseValue: coercePercent,
//   parseLiteral: function parseLiteral(ast) {
//     if (ast.kind === Kind.INT) {
//       var num = parseInt(ast.value, 10);
//       if (num <= MAX_INT && num >= MIN_INT) {
//         return num;
//       }
//     }
//     return null;
//   }
// });
// 
// function coercePercent(value) {
//   if (value === '') {
//     throw new TypeError('Percent cannot represent non 32-bit signed integer value: (empty string)');
//   }
//   var num = Number(value);
//   if (num !== num || num > 100 || num < 0) {
//     throw new TypeError('Percent cannot represent non 32-bit signed integer value: ' + String(value));
//   }
//   var percent = Math.floor(num);
//   if (percent !== num) {
//     throw new TypeError('Percent cannot represent non-integer value: ' + String(value));
//  }
//  return percent;
//}

// const WS_PORT = 5000;
// const pubsub = new PubSub();
// 
// // Create WebSocket listener server
// const websocketServer = createServer((request, response) => {
//   response.writeHead(404);
//   response.end();
// });
// 
// // Bind it to port and start listening
// websocketServer.listen(WS_PORT, () => console.log(
//   `Websocket Server is now running on http://localhost:${WS_PORT}`
// ));
// 
// const subscriptionServer = SubscriptionServer.create(
//   {
//     schema,
//     execute,
//     subscribe,
//   },
//   {
//     server: websocketServer,
//     path: '/graphql',
//   },
// );
// 
// // var GraphQLPercent = exports.GraphQLPercent = new GraphQLScalarType({
// var dateTime = exports.DateTime = new GraphQLScalarType({
//       name: 'DateTime',
//       description: 'Date custom scalar type',
//       parseValue(value) {
//         return new Date(value); // value from the client
//       },
//       serialize(value) {
//         return value.getTime(); // value sent to the client
//       },
//       parseLiteral(ast) {
//         if (ast.kind === Kind.INT) {
//           return parseInt(ast.value, 10); // ast value is always in string format
//         }
//         return null;
//       },
//     })

// const resolverMap = {
//   DateTime: new GraphQLScalarType({
//     name: 'DateTime',
//     description: 'Date and time custom scalar type',
//     parseValue(value) {
//       return new Date(value); // value from the client
//     },
//     serialize(value) {
//       return value.getTime(); // value sent to the client
//     },
//     parseLiteral(ast) {
//       if (ast.kind === Kind.INT) {
//         return parseInt(ast.value, 10); // ast value is always in string format
//       }
//       return null;
//     },
//   }),
// };
