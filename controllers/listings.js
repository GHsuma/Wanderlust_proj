const Listing=require("../models/listing")

module.exports.index=async (req,res)=>{
    const allListings= await Listing.find({});
        res.render("./listings/index.ejs",{allListings});
  
  }

  module.exports.renderNewForm=(req,res)=>{
    console.log(req.user)
    
      res.render("./listings/new.ejs")
  }
  module.exports.showListing=(async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id)
    .populate({
      path:"reviews",
    populate:{
      path:"author",
    }
    })
    .populate("owner");
    if(!listing){
      req.flash("error","listing you have requested does not exist")
      res.redirect("/listings")
    }
    console.log(listing)
    res.render("./listings/show.ejs",{listing})

})

module.exports.createListing=(async (req,res,next)=>{
    // let {title,description,price,image,location,country}=req.body
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send  valid data")
    // }
    
// next(new ExpressError(400,result.error))
const coordinates = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(req.body.listing.location)}`;
    const response = await fetch(coordinates);
    const data = await response.json();
    if (data.length > 0) {
        console.log(`Latitude: ${data[0].lat}, Longitude: ${data[0].lon}`);
    } else {
        console.log("Location not found");
    }
    let points={type:'Point',coordinates:[`${data[0].lat}`,`${data[0].lon}`]}

console.log(req.body.listing.location)
    let url=req.file.path
    let filename=req.file.filename
    console.log(url,"..",filename)
        let newListing=req.body.listing;
        newListing.owner=req.user._id
        // console.log(req.body.listing)
        newListing.image={url,filename}
newListing.geometry=points
        let newlist=await new Listing(newListing);
      let save= await newlist.save();
       console.log(save);
       req.flash("success","new listing created")

        res.redirect("/listings");
    

})

module.exports.rendereditForm=( async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","listing you have requested does not exist")
        res.redirect("/listings")
      }
    let originalImage=listing.image.url;
   originalImage= originalImage.replace("/upload","/upload/w_250")
console.log(originalImage)
    res.render("./listings/edit.ejs",{listing,originalImage})
})

module.exports.updateListing=async(req,res)=>{
    let {id}= req.params;
  
let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
if(typeof req.file!=="undefined"){
let url=req.file.path
let filename=req.file.filename
listing.image={url,filename};
await listing.save()
}
req.flash("success","listing is updated")

res.redirect(`/listings/${id}`)
}

module.exports.destroyListing=async (req,res)=>{
    let {id} =req.params;
  await Listing.findByIdAndDelete(id);
    console.log("deleted");
    req.flash("success","listing deleted")

    res.redirect("/listings")
 }