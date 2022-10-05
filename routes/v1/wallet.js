//********** Authored by: Alex *********//
//********** Date: September, 2022 *********//
//********** Organization: Cyber Ape Yacht Club *********//

// *** --- import router and database models
const Moralis = require('moralis').default
const { EvmChain } = require("@moralisweb3/evm-utils")
const mongoose = require("mongoose");
const router = require("express").Router();
const auth = require('../middleware/auth');
const UserSchema = mongoose.model("UserSchema");
const WalletSchema = mongoose.model("WalletSchema");
const NFTSchema = mongoose.model("NFTSchema");
const ObjectID = require('mongodb').ObjectId;
const WAValidator = require('wallet-address-validator');

require("dotenv/config");

// *** --- add user wallet ---
router.post("/updateuserwallet", async function (req, res, next) {
    const { userid, wallet } = req.body;

    // check if request body is empty or validated
    if (!userid || !ObjectID.isValid(userid) || !wallet) {
        return res.status(400).json({
            msg: "validation error - try another information",
        });
    }

    // retrieve user information by id
    const user = await UserSchema.findById(userid);

    // add user wallet information if user is existing
    if (user) {
        // check if wallet address is valid and not existing in db
        const valid = WAValidator.validate(wallet, "ethereum");
        const item = await WalletSchema.findOne({ wallet: wallet });

        // update wallet information if user and wallet are valid
        if (valid && item == null) {
            // update database by new wallet and userid
            const newWallet = new WalletSchema({ userid: userid, wallet: wallet });
            await newWallet.save();

            return res.status(200).json({
                msg: "wallet successfully updated",
            })
        } else {
            // when request informations are incorrect
            return res.status(400).json({
                msg: "validation error - wallet address is not valid",
            });
        }
    }
    else {
        // retrieve message when user is not existing
        return res.status(403).json({
            msg: "user is not exisiting",
        });
    }
})

// *** --- add valid NFTs to the database ---
router.post("/updatenftinfo", async function (req, res, next) {

    const { token_address, token_id, amount, owner_of, token_hash, contract_type, name, symbol, token_uri } = req.body;

    // check if request body is empty
    if (!token_address || !token_id || !amount || !owner_of || !token_hash || !contract_type || !name ||
        !symbol || !token_uri || !WAValidator.validate(token_address, "ethereum") || !WAValidator.validate(owner_of, "ethereum")) {
        return res.status(400).json({
            msg: "validation error - try another information",
        });
    }

    // retrieve nft information token_address
    let nft = await NFTSchema.findOne({ token_address: token_address });

    // create or update nft information 
    if (nft) {
        // update existing db field with new information
        nft.token_id = token_id;
        nft.amount = amount;
        nft.owner_of = owner_of;
        nft.token_hash = token_hash;
        nft.contract_type = contract_type;
        nft.name = "trying for a new new new new opportunity";
        nft.symbol = symbol;
        nft.token_uri = token_uri;

        // store db field with updated information
        await nft.save();

        return res.status(200).json({
            msg: "successfully update NFT information to the db",
        })
    } else {
        // create new db field by request information
        const newNft = new NFTSchema({
            token_address: token_address, token_id: token_id, amount: amount, owner_of: owner_of, token_hash: token_hash,
            contract_type: contract_type,
            name: name,
            symbol: symbol,
            token_uri: token_uri
        });

        // add db field with new NFT information
        await newNft.save();

        return res.status(200).json({
            msg: "successfully add new NFT information to the db",
        })
    }
})

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
        })
    } else {
        // retrieve message when nft is not existing
        return res.status(403).json({
            msg: "nft is not exisiting",
        });
    }
})

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
        const item = await WalletSchema.findOne({ wallet: address });

        // if wallet is valid and existing in the db
        if (valid && item != null) {
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
                msg: "successfully fetch " + response.data.total + " NFTs from " + address,
                result: response.data.result
            })
        } else {
            // retrieve message when wallet is not existing
            return res.status(403).json({
                msg: "user wallet is not exisiting",
            });
        }

    }
})

// *** --- export wallet router ---
module.exports = router;