const express=require("express")
const router=express.Router()
const wrapAsync=require("../utils/wrapAsync.js")
const {listingSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js")
const Listing=require("../models/listing.js")
const  {isLoggedIn}=require("../middleware.js")

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
        if(error){
            console.log(error.details)
            let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }}

//index
router.get("/",async (req,res)=>{
    const allListings= await Listing.find({});
        res.render("./listings/index.ejs",{allListings});
  
  });

  //new
  router.get("/new",isLoggedIn,(req,res)=>{
    console.log(req.user)
    
      res.render("./listings/new.ejs")
  })

  //show
  router.get("/:id",wrapAsync(async (req,res)=>{
      let {id}=req.params;
      let listing=await Listing.findById(id)
      .populate("reviews").populate("owner");
      if(!listing){
        req.flash("error","listing you have requested does not exist")
        res.redirect("/listings")
      }
      console.log(listing)
      res.render("./listings/show.ejs",{listing})
  
  }))

  //create
router.post("/",isLoggedIn,validateListing,wrapAsync(async (req,res,next)=>{
    // let {title,description,price,image,location,country}=req.body
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send  valid data")
    // }
    
// next(new ExpressError(400,result.error))
    
        let newListing=req.body.listing;
        newListing.owner=req.user._id
        console.log(req.body.listing)
        let newlist=await new Listing(newListing);
       await newlist.save();
       console.log(newlist);
       req.flash("success","new listing created")

        res.redirect("/listings");
    

}))

//edit $
router.get("/:id/edit",isLoggedIn,wrapAsync( async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","listing you have requested does not exist")
        res.redirect("/listings")
      }
    res.render("./listings/edit.ejs",{listing})
}))

//update route
router.put("/:id",isLoggedIn,validateListing,wrapAsync( async(req,res)=>{
    let {id}= req.params;
 await Listing.findByIdAndUpdate(id,{...req.body.listing});
 req.flash("success","listing is updated")

res.redirect(`/listings/${id}`)
}))

//delete
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id} =req.params;
  await Listing.findByIdAndDelete(id);
    console.log("deleted");
    req.flash("success","listing deleted")

    res.redirect("/listings")
 }))
module.exports=router;
