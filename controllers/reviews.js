const Review=require("../models/review")
const Listing=require("../models/listing")

//create route
module.exports.createReview=async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      throw new ExpressError("Listing not found", 404);
    }
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id ;
    console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success" , "New Review Created");
    res.redirect(`/listings/${listing._id}/`);
  }

  module.exports.destroyReview=async(req,res)=>{
          let {id,reviewId}=req.params;
        await  Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
      await Review.findByIdAndDelete(reviewId);
      req.flash("success"," review deleted")
  
      res.redirect(`/listings/${id}`);
       }