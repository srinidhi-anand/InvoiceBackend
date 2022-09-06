// Set up
var express = require('express');
var app = express(); // create our app w/ express
var mongoose = require('mongoose'); // mongoose for mongodb
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');
var BillInfo = require('./model.js');

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ extended: 'true' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'DELETE, POST, GET, PATCH');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// Database Connection Configuration 
// mongoose.connect('mongodb://localhost/invoices');
// mongoose.connection.once('open',function(){
//     console.log('Database connected Successfully');
// }).on('error',function(err){
//     console.log('Error', err);
// })


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://111:3211234567@cluster0.avh4quv.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("invoices").collection('bills').insertOne({
    "applicationId" : "a1f47fd467c5-bab5-98fe-47f7-8eaaf929",
    "PAN": "8888446754770887",
    "UUID": "rrEff929-97fe-41f7-bab4-a1f77fd473c5",
    "authenticationType": "00",
    "tranDateTime": "040318135553",
    "payer_name": "Hisham",
    "payeeId": "0010010003",
    "billInfo": "{\"totalAmount\": \"200.33311\",\"billedAmount\": 50.111,\"lastInvoiceDate\":\"12-12-2014\",\"contractNumber\": \"1000090096\",\"last4Digits\": \"1234\",\"unbilledAmount\": 150.22222}"
  });
  console.log('Database connected Successfully', collection);
});


async function getUUIDs() {
  let UUIDLists = [];
  let result;
  try {
     await BillInfo.find().then(function (doc) {
      result = doc
      if (result) {
        UUIDLists = result.map(item => item.UUID);
      }
    });
    
  } catch(e) {
    console.log(e);
  }
  return UUIDLists;
}


// Routes
// create document
app.post('/api/new', async function(req,res) {
    let data=[];
    let reqBody;
    await getUUIDs().then(function(UUIDLists){
      data = UUIDLists ?? [];
      if (UUIDLists && UUIDLists.length <= 0){
        reqBody = {
          "applicationId" : "a1f47fd467c5-bab5-98fe-47f7-8eaaf929",
          "PAN": "8888446754770887",
          "UUID": "rrEff929-97fe-41f7-bab4-a1f77fd473c5",
          "authenticationType": "00",
          "tranDateTime": "040318135553",
          "payer_name": "Hisham",
          "payeeId": "0010010003",
          "billInfo": "{\"totalAmount\": \"200.33311\",\"billedAmount\": 50.111,\"lastInvoiceDate\":\"12-12-2014\",\"contractNumber\": \"1000090096\",\"last4Digits\": \"1234\",\"unbilledAmount\": 150.22222}"
        }
      } else{
        reqBody = req.body.Invoice
      } 
      
      if (UUIDLists !== undefined && !UUIDLists.includes( reqBody.UUID) ) {
        const bill = new BillInfo(reqBody);
        try {
            bill.save().then(val => {
              // to return the latest list
                BillInfo.find().then(function (doc) {
                    res.json({ msg: "Added Successfully", val: doc })
                  });
                
            });
        } catch(e){
            console.log('catch error',e);
        }
      } else {
        res.json({ msg: "Unique UUID is Required"})
      }
  });
})

// Get invoices
app.get('/api/invoices', function (req, res) {
  BillInfo.find(function (err, invoices) {
    if (err) res.send(err);
    res.json(invoices); // return all invoices in JSON format
  });
});

// Fetch invoice
app.get('/api/invoices/:invoice_id', function (req, res) {
  BillInfo.find({
    _id: req.params.invoice_id,
  },function (err, invoices) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);
    res.json(invoices); // return invoices in JSON format
  });
});

// delete all invoice
app.delete('/api/delete', function (req, res) {
    BillInfo.remove(
      {
        // _id: req.params.invoice_id,
      },
      function (err, invoice) {
        // to return the latest list
        BillInfo.find().then(function (doc) {
            res.json(doc)
          });
      }
    );
});

// listen (start app with node server.js) ======================================
var port = process.env.PORT || 8000
app.listen(port);
console.log(`App listening on port ${port}`);
