// const express=require("express")
// const router=express.Router({mergeParams:true})
// const ExpressError=require("../utils/ExpressError.js")
// const wrapAsync=require("../utils/wrapAsync.js")
// const {reviewSchema}=require("../schema.js")
// const Listing=require("../models/listing.js")
// const Review=require("../models/review.js")
// const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js")





// //reviews
//  //post route
//  router.post("/",isLoggedIn,isReviewAuthor,
//     validateReview,wrapAsync(async(req,res)=>{
//     let listing=await Listing.findById(req.params.id);
//     let newReview=new Review(req.body.review);
//     newReview.author=req.user._id;

//     console.log(newReview)
//     // console.log(req.body.review)
//     listing.reviews.push(newReview);
    
//     await newReview.save();
//     await listing.save();
//     console.log("review saved");
//     req.flash("success","new review created")
//     res.redirect(`/listings/${listing._id}/`)
//      }))
    
    
//      //delete review route
// router.delete("/:reviewId",isLoggedIn,isReviewAuthor,
//     wrapAsync(async(req,res)=>{
//         let {id,reviewId}=req.params;
//       await  Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     req.flash("success"," review deleted")

//     res.redirect(`/listings/${id}`);
//      }))

// module.exports=router;

const express=require("express")
const router=express.Router({mergeParams:true})
const ExpressError=require("../utils/ExpressError.js")
const wrapAsync=require("../utils/wrapAsync.js")
const {reviewSchema}=require("../schema.js")
const Listing=require("../models/listing.js")
const Review=require("../models/review.js")
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js")
const reviewController=require("../controllers/reviews.js")
const review = require("../models/review.js")




//reviews
 //post route
//  router.post("/",isLoggedIn,isReviewAuthor,
//     validateReview,wrapAsync(async(req,res)=>{
//     let listing=await Listing.findById(req.params.id);
//     let newReview=new Review(req.body.review);
//     newReview.author=req.user._id;

//     console.log(newReview)
//     // console.log(req.body.review)
//     listing.reviews.push(newReview);
    
//     await newReview.save();
//     await listing.save();
//     console.log("review saved");
//     req.flash("success","new review created")
//     res.redirect(`/listings/${listing._id}/`)
//      }))
    
router.post(
    "/", isLoggedIn , 
    validateReview,
    wrapAsync(reviewController.createReview)
  );
    
     //delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,
    wrapAsync(reviewController.destroyReview))

module.exports=router;