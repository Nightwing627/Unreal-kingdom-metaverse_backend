//********** Authored by: Alex *********//
//********** Date: September, 2022 *********//
//********** Organization: Cyber Ape Yacht Club *********//

// *** --- import router and database models
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/evm-utils");
const mongoose = require("mongoose");
const router = require("express").Router();
const auth = require("../middleware/auth");
const UserSchema = mongoose.model("UserSchema");
const WalletSchema = mongoose.model("WalletSchema");
const WhitelistSchema = mongoose.model("WhitelistSchema");
const NFTSchema = mongoose.model("NFTSchema");
const TransactionSchema = mongoose.model("TransactionSchema");
const ObjectID = require("mongodb").ObjectId;
const WAValidator = require("wallet-address-validator");

require("dotenv/config");

// *** --- add user wallet ---
router.post("/updateuserwallet", async function (req, res, next) {
  const { email, wallet } = req.body;

  // check if request body is empty or validated
  if (!email || !wallet) {
    return res.status(400).json({
      msg: "validation error - try another information",
    });
  }

  // retrieve user information by id
  const user = await UserSchema.findOne({ email: email });

  // add user wallet information if user is existing
  if (user) {
    // check if wallet address is valid and not existing in db
    const valid = WAValidator.validate(wallet, "ethereum");
    const item = await WalletSchema.findOne({ email: email });

    if (!valid) {
      return res.status(400).json({
        msg: "validation error - wallet address is not valid",
      });
    }
    // update wallet information if user and wallet are valid
    if (item == null) {
      // update database by new wallet and userid
      const newWallet = new WalletSchema({ email: email, wallet: wallet });
      await newWallet.save();

      return res.status(200).json({
        msg: "wallet successfully added",
      });
    } else {
      item.wallet = wallet;
      await item.save();

      return res.status(200).json({
        msg: "wallet successfully updated",
      });
    }
  } else {
    // retrieve message when user is not existing
    return res.status(403).json({
      msg: "user is not exisiting",
    });
  }
});

/// *** --- get all wallet request ---
router.post("/getAllWallets", async function (req, res, next) {
  WalletSchema.find()
    .then(function (wallets) {
      let response = [];
      wallets.map((item) => {
        response.push({
          uid: item._id,
          email: item.email,
          wallet: item.wallet,
        });
      });
      return res.status(200).json({
        msg: "retrieved all characters",
        wallets: response,
      });
    })
    .catch(next);
});

/// *** --- get all whitelist wallet request ---
router.post("/getAllWhitelist", async function (req, res, next) {
  WhitelistSchema.find()
    .then(function (wallets) {
      let response = [];
      wallets.map((item) => {
        response.push({
          uid: item._id,
          email: item.email,
          wallet: item.wallet,
        });
      });
      return res.status(200).json({
        msg: "retrieved all characters",
        wallets: response,
      });
    })
    .catch(next);
});

// *** --- check if wallet is whitelist ---
router.post("/checkwhitelist", async function (req, res, next) {
  const { wallet } = req.body;

  // check if request body is empty or validated
  if (!wallet) {
    return res.status(400).json({
      msg: "validation error - try another information",
    });
  }

  // retrieve user information by id
  const user = await WhitelistSchema.findOne({ wallet: wallet });

  // if whitelist is existing
  if (user) {
    return res.status(200).json({
      msg: "valid whitelist",
    });
  } else {
    // retrieve message when whitelist is not existing
    return res.status(403).json({
      msg: "wallet is not existing",
    });
  }
});

// *** --- delete whitelist account ---
router.post("/deletewhitelist", async function (req, res, next) {
  const { wallet } = req.body;

  // check if request body is empty or validated
  if (!wallet) {
    return res.status(400).json({
      msg: "validation error - try another information",
    });
  }

  // retrieve user information by id
  const user = await WhitelistSchema.findOne({ wallet: wallet });

  // if whitelist is existing
  if (user) {
    await WhitelistSchema.findOneAndDelete({ wallet: wallet });
    return res.status(200).json({
      msg: "successfully remove whitelist wallet",
    });
  } else {
    // retrieve message when whitelist is not existing
    return res.status(403).json({
      msg: "wallet is not existing",
    });
  }
});

// *** --- add user wallet ---
router.post("/updatewhitelist", async function (req, res, next) {
  const { email, wallet } = req.body;

  // check if request body is empty or validated
  if (!email || !wallet) {
    return res.status(400).json({
      msg: "validation error - try another information",
    });
  }

  // retrieve user information by id
  const user = await WhitelistSchema.findOne({ wallet: wallet });

  // add user wallet information if user is existing
  if (!user) {
    // check if wallet address is valid and not existing in db
    const valid = WAValidator.validate(wallet, "ethereum");

    if (!valid) {
      return res.status(400).json({
        msg: "validation error - wallet address is not valid",
      });
    }

    const whitelist = new WhitelistSchema({ email: email, wallet: wallet });
    await whitelist.save();

    return res.status(200).json({
      msg: "new whitelist successfully added",
    });
  } else {
    // retrieve message when user is not existing
    return res.status(403).json({
      msg: "wallet already existing",
    });
  }
});

// *** --- add valid NFTs to the database ---
router.post("/updatenftinfo", async function (req, res, next) {
  const {
    name,
    description,
    nftAddress,
    tokenId,
    price,
    marketFees,
    tokenURI,
  } = req.body;

  // check if request body is empty
  if (
    !nftAddress ||
    !tokenId ||
    !price ||
    !marketFees ||
    !tokenURI ||
    !name ||
    !description ||
    !WAValidator.validate(nftAddress, "ethereum")
  ) {
    return res.status(400).json({
      msg: "validation error - try another information",
    });
  }

  // create new db field by request information
  const newNft = new NFTSchema({
    nftAddress: nftAddress,
    tokenId: tokenId,
    price: price,
    marketFees: marketFees,
    tokenURI: tokenURI,
    name: name,
    description: description,
  });

  // add db field with new NFT information
  await newNft.save();

  return res.status(200).json({
    msg: "successfully add new NFT information to the db",
  });
});

/// *** --- get all minted nfts ---
router.post("/getAllMints", async function (req, res, next) {
  NFTSchema.find()
    .then(function (nfts) {
      let response = [];
      nfts.map((item) => {
        response.push({
          nftAddress: item.nftAddress,
          tokenId: item.tokenId,
          price: item.price,
          marketFees: item.marketFees,
          name: item.name,
          description: item.description,
          tokenURI: item.tokenURI,
        });
      });
      return res.status(200).json({
        msg: "retrieved all nfts",
        nfts: response,
      });
    })
    .catch(next);
});

// *** --- remove NFT info from the database ---
router.post("/removenftinfo", async function (req, res, next) {
  const { token_address } = req.body;

  // check if request body is empty
  if (!token_address) {
    return res.status(400).json({
      msg: "validation error - try another information",
    });
  }

  // retrieve nft information token_address
  const nft = await NFTSchema.findOne({ token_address: token_address });

  // remove nft information from db if existing
  if (nft) {
    await NFTSchema.deleteOne({ token_address: token_address });

    return res.status(200).json({
      msg: "successfully remove NFT from database",
    });
  } else {
    // retrieve message when nft is not existing
    return res.status(403).json({
      msg: "nft is not exisiting",
    });
  }
});

// *** --- get all available nfts from user wallet ---
router.post("/getallnfts", async function (req, res, next) {
  const { address } = req.body;

  // check if request body is empty or validated
  if (!address) {
    return res.status(400).json({
      msg: "validation error - can't be blank",
    });
  } else {
    // check if wallet address is valid and existing in db
    const valid = WAValidator.validate(address, "ethereum");
    // const item = await WalletSchema.findOne({ wallet: address });

    // if wallet is valid and existing in the db
    if (valid) {
      const chain = EvmChain.ETHEREUM;

      // start moralis server with API key
      await Moralis.start({
        apiKey: process.env.MORALIS_API,
      });

      // get NFTs of the user wallet
      const response = await Moralis.EvmApi.nft.getWalletNFTs({
        address,
        chain,
      });

      // retrieve all NFTS of the user wallet
      return res.status(200).json({
        msg:
          "successfully fetch " + response.data.total + " NFTs from " + address,
        result: response.data.result,
      });
    } else {
      // retrieve message when wallet is not existing
      return res.status(403).json({
        msg: "user wallet is not exisiting",
      });
    }
  }
});

/// *** --- get all transactions request ---
router.post("/getAllTransactions", async function (req, res, next) {
  TransactionSchema.find()
    .then(function (items) {
      let response = [];
      items.map((item) => {
        response.push({
          uid: item._id,
          blockHash: item.blockHash,
          blockNumber: item.blockNumber,
          from: item.from,
          to: item.to,
          transactionHash: item.transactionHash,
          transactionIndex: item.transactionIndex,
          type: item.type,
        });
      });
      return res.status(200).json({
        msg: "retrieved all nfts",
        transactions: response,
      });
    })
    .catch(next);
});

// *** --- add new transaction request ---
router.post("/addTransaction", async function (req, res, next) {
  const {
    blockHash,
    blockNumber,
    from,
    to,
    transactionHash,
    transactionIndex,
    type,
  } = req.body;

  // check if request body is empty or validated
  if (
    !blockHash ||
    !blockNumber ||
    !from ||
    !to ||
    !transactionHash ||
    !transactionIndex ||
    !type
  ) {
    return res.status(400).json({
      msg: "validation error",
    });
  }

  const transaction = new TransactionSchema({
    blockHash: blockHash,
    blockNumber: blockNumber,
    from: from,
    to: to,
    transactionHash: transactionHash,
    transactionIndex: transactionIndex,
    type: type,
  });

  await transaction.save();
  return res.status(200).json({
    msg: "new transaction added",
  });
});

// *** --- export wallet router ---
module.exports = router;