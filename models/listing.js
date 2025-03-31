const mongoose=require("mongoose")
const Schema=mongoose.Schema;
const Review=require("./review.js")
const ListingSchema=new Schema({
    title:{
       type: String,
    required:true},


    description:String,
    image:{
    //     type:String,
    //     default:"https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     // default:"https://unsplash.com/photos/a-person-walking-on-the-beach-at-sunset-tWWdVrUSeik",
    //     set:(v)=>v==="" ? "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    
    url:String,
    filename:String,
    },

    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    },
],
geometry:{
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

ListingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})

    }
})
const Listing=mongoose.model("Listing",ListingSchema);
module.exports=Listing;