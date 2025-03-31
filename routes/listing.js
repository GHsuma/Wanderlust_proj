const express=require("express")
const router=express.Router()
const wrapAsync=require("../utils/wrapAsync.js")
const {listingSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js")
const Listing=require("../models/listing.js")
const  {isLoggedIn}=require("../middleware.js")
const {isOwner,validateListing}=require("../middleware.js")
const listingController=require("../controllers/listings.js")
const multer=require("multer");
const {storage}=require("../cloudConfig.js")
const upload=multer({storage})

router
.route("/")
//index
.get(wrapAsync(listingController.index))
//create
.post(isLoggedIn,
  //using multer to parse files
  upload.single('listing[image]'),
  validateListing,
 wrapAsync(listingController.createListing));




   //new
   router.get("/new",isLoggedIn,listingController.renderNewForm)

router
.route("/:id")
//show
.get(wrapAsync(listingController.showListing))
//update
.put(isLoggedIn,
  isOwner,
  upload.single('listing[image]'),

  validateListing,
  wrapAsync( listingController.updateListing))
//delete
.delete(isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing))



 
  
 
//edit $
router.get("/:id/edit",
  isLoggedIn,isOwner,wrapAsync(listingController.rendereditForm))


module.exports=router;
