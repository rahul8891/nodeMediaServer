const express = require("express");
const UserModel = require('../models/user.model');
const HttpException = require('../utils/HttpException.utils');
const dotenv = require('dotenv');
dotenv.config();

/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class UserController {
    getAllUsers = async (req, res, next) => {
        let streamList = await UserModel.find();
        if (!streamList.length) {
            throw new HttpException(404, 'Stream not found');
        }        

        res.send(streamList);
    };
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new UserController;