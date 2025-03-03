const mongoose=require("mongoose")
const Schema=mongoose.Schema;
const Review=require("./review.js")
const ListingSchema=new Schema({
    title:{
       type: String,
    required:true},


    description:String,
    image:{
        type:String,
        default:"https://unsplash.com/photos/a-row-of-white-lawn-chairs-sitting-on-top-of-a-sandy-beach-y22Rc7z9Plo",
        // default:"https://unsplash.com/photos/a-person-walking-on-the-beach-at-sunset-tWWdVrUSeik",
        set:(v)=>v==="" ? "https://unsplash.com/photos/a-row-of-white-lawn-chairs-sitting-on-top-of-a-sandy-beach-y22Rc7z9Plo" : v,
    },

    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    },
],
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