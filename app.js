// Set up
var express = require('express');
var app = express(); // create our app w/ express
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');
var ObjectId = require('mongodb').ObjectID;


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


async function server(){
  let count;
  const uri = "mongodb+srv://111:3211234567@cluster0.avh4quv.mongodb.net/?retryWrites=true&w=majority";
  const { MongoClient, ServerApiVersion } = require('mongodb');
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  client.connect(async err => {
    const db = client.db("invoices").collection('invoiceBill');
    count = await db.countDocuments();
    console.log(' Database Connected Successfully ',count);
    if ( count === 0) {
      // Initial Sample Create if there is no data available
      invoiceBill.insertOne({
        "applicationId" : "a1f47fd467c5-bab5-98fe-47f7-8eaaf929",
        "PAN": "8888446754770887",
        "UUID": "rrEff929-97fe-41f7-bab4-a1f77fd473c5",
        "authenticationType": "00",
        "tranDateTime": "040318135553",
        "payer_name": "Hisham",
        "invoice_provider_name":"Gloria Jeans",
        "unit_name": "Gloria Jeans Coffee House",
        "payeeId": "0010010003",
        "billInfo": "{\"totalAmount\": \"200.33311\",\"billedAmount\": 50.111,\"lastInvoiceDate\":\"12-12-2014\",\"contractNumber\": \"1000090096\",\"last4Digits\": \"1234\",\"unbilledAmount\": 150.22222}"
      });
    }
  });
  
  const database = client.db("invoices");
  const invoiceBill = database.collection("invoiceBill");
  
  // To fetch all invoices
  app.get('/api/invoices', async function (req, res) {
      const allInvoices = await invoiceBill.find({}).toArray();
      if (allInvoices.length > 0)  res.json(allInvoices);
  });

  // To fetch specific invoices
  app.get('/api/invoices/:invoice_id', async function (req, res) {
    const { invoice_id } = req.params;
    const query = invoice_id ? {'_id' : ObjectId(invoice_id)} : {};
    const Invoice = await invoiceBill.find(query).toArray();
    if (Invoice.length > 0)  res.json(Invoice);
  });

  // To create invoices
  app.post('/api/new', async function(req,res) {
      let UUIDLists = await invoiceBill.find( { }, { _id: 0, UUID: 1 }).toArray();
      UUIDLists = UUIDLists.map(item => item.UUID );
      const reqBody = req.body.Invoice;
      if (UUIDLists !== undefined && !UUIDLists.includes( reqBody.UUID) ) {
          try {
            const bill = await invoiceBill.insertOne(reqBody);
            const allInvoices = await invoiceBill.find({}).toArray();
            if (allInvoices.length > 0)  res.json(allInvoices);
          } catch(e){
              console.log('catch error',e);
          }
      } else {
          res.json({ msg: "Unique UUID is Required"})
      }
  });
}

if (require.main === module) {
  // listen (start app with node app.js) ============
  var port = process.env.PORT || 8000
  app.listen(port);
  console.log(`App listening on port ${port}`);
  server();
}
