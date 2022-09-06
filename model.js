var mongoose = require('mongoose'); 
// Models

const billInfoSchema = new mongoose.Schema({
    applicationId: {
      type: String,
      required: true,
    },
    PAN: {
      type: String,
      required: false,
    },
    UUID: {
      type: String,
      required: true,
    },
    tranDateTime: {
        type: String,
        required: true,
    },
    payeeId: {
        type: String,
        required: true,
    },
    authenticationType: {
        type: String,
        required: false,
    },
    payer_name: {
        type: String,
        required: false,
    },
    billInfo: {
        type: String,
        required: false,
    },

});

const BillInfo = mongoose.model('Invoice',billInfoSchema);

module.exports = BillInfo;
