const mongoose = require('mongoose'); 

// Declare the Product Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    // category:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"category",
    // },
    category:{
        type:String,
        required:true,
    },
    // brand:{
    //     type:String,
    //     enum: ["Adidas", "Nike", "Lee Cooper"],
    // },
    brand:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    sold:{
        type:Number,
        default:0, 
    },
    images:{
        type:Array, 
    },
    // color:{
    //     type:String,
    //     enum: ["Black", "Blue", "Red"],
    // },
    color:{
        type:String,
        required:true,
    },
},
    { timestamps:true }
);

//Export the model
module.exports = mongoose.model('Product', productSchema);