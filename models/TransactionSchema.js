//********** Authored by: Alex *********//
//********** Date: September, 2022 *********//
//********** Organization: Cyber Ape Yacht Club *********//

// *** --- initialize variables ---
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
require("dotenv/config");

// *** --- define transaction schema  ---
const TransactionSchema = new mongoose.Schema(
  {
    blockHash: { type: String },
    blockNumber: { type: String },
    from: { type: String },
    to: { type: String },
    transactionHash: { type: String },
    transactionIndex: { type: String },
    type: { type: String },

    // need to make sure if we add signature later
  },
  {
    timestamps: true,
  }
);

// *** --- setup transaction model validator ---
TransactionSchema.plugin(uniqueValidator, { message: "is already taken" });

// *** --- response function when transaction information required, retrieve transaction information in json ---
TransactionSchema.methods.toTransactionJSON = function () {
  return {
    uid: this._id,
    blockHash: this.blockHash,
    blockNumber: this.blockNumber,
    from: this.from,
    to: this.to,
    transactionHash: this.transactionHash,
    transactionIndex: this.transactionIndex,
    type: this.type,
  };
};

// *** --- export transaction schema to use in controller ---
module.exports = mongoose.model("TransactionSchema", TransactionSchema);
