'use strict'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

/**
 * Module dependencies
 */
const { createWriteStream } = require('fs');
const request = require('supertest')
const ProgressBar = require("./ProgressBar");
const Bar =  new ProgressBar();;
/**
 * Internal dependencies
 */
const loadYaml = require('./lib/load-yml')

const config = loadYaml('./config.yml')
const test = request(config.url)
const log = createWriteStream('./errors.log')

// TODO: Check for top-level `await`

let [first] = process.argv.slice(2)
let { concurrency } = config

const CONCURRENCY_FLAG = '--concurrency'

let progress = 0;
let errors=0;

// Check flag
if (first && first.startsWith(CONCURRENCY_FLAG)) {
  [, concurrency] = first.split('=')
}

const defaults = {
  password: '123456',
  contentType: 'application/json'
}


Bar.init(config.users,concurrency,config.endpoints);
;(async () => {
  

 
  
  for (const user of config.users) {
 
 

  console.log(user,defaults.password)
    const { body } = await test
      .post('/usuarios/login')
      .set('Access-Source', 'APP_MOVIL')
      .send({
        username: user.username || user,
        password: user.password || defaults.password
      })
      .expect('Content-Type', /application\/json/)   //application/octet-stream
      .expect(200)
      
    

  
    const token = body.data && body.data.token
    //console.log(token);
    if (token /* defined token */) {
      for (const endpoint of config.endpoints) {
       
        const path = endpoint.path || endpoint

        for (let i = concurrency; i--;) {
         // console.log(i);
         
          test
            .get(path)
            .set('Authorization', token)
            .expect('Content-Type', endpoint.type || defaults.contentType)
            .expect(200)
            
          //  .then(data=>console.log(data))
            .end(error => {
              progress++;
              

              if (error) {
                log.write(`ENDPOINT ${path} ${error}\n`)
                errors++;
              }
              Bar.update(progress,errors);
            })
           
        }
      }
    }
  }

})()
