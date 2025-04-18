if(process.env.NODE_ENV!="production"){
    require('dotenv').config()

}



const express=require("express")
const app=express()
const mongoose=require("mongoose")
const Listing=require("./models/listing.js")
const path=require("path")
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate")
// const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")
// const {listingSchema}=require("./schema.js");
const Review=require("./models/review.js")
// const {reviewSchema}=require("./schema.js")



const listingRouter=require("./routes/listing.js")
const reviewRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js")


const session=require("express-session")
const MongoStore=require("connect-mongo")
const flash=require("connect-flash")
const passport=require("passport")
const localStrategy=require("passport-local")
const User=require("./models/user.js")

const dbUrl=process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connected to wanderlust db");
}).catch((err)=>{
console.log(err)
})

async function main(){
    await mongoose.connect(dbUrl)
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")))

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:12*3600,
}

)
const sessionOptions={
    store:store,

    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true, //for security
    }
}
app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(9090,()=>{
    console.log("server is listening to port 9090")
})



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next()
})

//demo user
// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"suma@gmail.com",
//         username:"delta"
//     })
// let registeredUser= await User.register(fakeUser,"hello");
// res.send(registeredUser)
// })

    
app.use("/listings",listingRouter)   
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter)

app.use("",async(req,res)=>{
    const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});

})

app.get("/testListing",async (req,res)=>{
let sampleListing=new Listing({
    title:"My new ville",
    description:"around the beach",
    price:2990,
    location:"Calangute,Goa",
    country:"India"
},

);
// await sampleListing.save();
console.log("sample saved");
res.send("Successfully saved")
})




 

 app.all("*",(req,res,next)=>{
next(new ExpressError(404,"Page not found"))
 })
//  app.use((err,req,res,next)=>{
//     if(err.name==="ValidationError"){
//         err=handleValidationError(err);
//         res.send("Validation Error")
//     }next()
//  })
 app.use((err,req,res,next)=>{
    let{status=500,message="some thing went wrong"}=err;
   res.render("error.ejs",{err})
    // res.status(status).send(message);
 })
//  const handleValidationError=(err)=>{
//     console.log("validation error occurred");
//     return err;
//  }
 
