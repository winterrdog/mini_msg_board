const mongs = require("mongoose");

// create schema
const msgDef = {
    text_msg: { type: String, required: true },
    user_name: { type: String, required: true, maxLength: 28 },
    added: { type: Date, required: true },
};

const BoardMsgSchema = new mongs.Schema(msgDef);

// create a model
const BoardMsgModel = mongs.model("message", BoardMsgSchema);

// export model
module.exports = BoardMsgModel;
