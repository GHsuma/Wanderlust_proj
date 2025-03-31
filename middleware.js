const Listing=require("./models/listing")
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js")
const Review=require("./models/review")

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl
        req.flash("error","You must be logged in ")
    return res.redirect("/login")
}
next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

// module.exports.isOwner=async(req,res,next)=>{
//     let {id}= req.params;
//     let listing= await Listing.findById(id)
//     if(res.locals.currUser){

    
//     if(!listing.owner.equals(res.locals.currUser._id)){
//         console.log(listing.owner)
//      req.flash("error","You are not owner of this listing")
//     return res.redirect(`/listings/${id}`)
//     }
//         }
//     next();
// }
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    if (!res.locals.currUser) {
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }

    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
};


module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
        if(error){
            console.log(error.details)
            let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }}

    module.exports.validateReview=(req,res,next)=>{
        let {error}=reviewSchema.validate(req.body);
            if(error){
                console.log(error.details)
                let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
        }
        else{
            next();
        }}

        module.exports.isReviewAuthor=async(req,res,next)=>{
            let {id,reviewId}= req.params;
            console.log(reviewId)
            let review= await Review.findById(reviewId)
            console.log(review)
            if(!review.author.equals(res.locals.currUser._id)){
             req.flash("error","You haven't created this review")
            return res.redirect(`/listings/${id}`)
         
            }
            next();
        }