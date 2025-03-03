const express=require("express")
const app=express()
const users=require("./routes/user.js")
const posts=require("./routes/post.js")
const cookieParser=require("cookie-parser")
const session=require("express-session")
const flash=require("connect-flash")
const path=require("path")

const sessionOptions={
        secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true, //for security
    }
}

app.use(cookieParser("secretcode"))


// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("company","TCS",{signed:true})
// res.send("signed cookie sent")
// })

// app.get("/verify",(req,res)=>{
//     console.log(req.cookies) //gives unsigned cookies
//     console.log(req.signedCookies)
//     res.send("verified")
// })
// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","hello");
    
//     res.send("sent you some cookies")
// })
// app.get("/greet",(req,res)=>{
//     let {name="anonymous"}=req.cookies;
//     res.cookie("fruit","mango")
//     let {fruit}=req.cookies
//     res.send(`hi,${name},${fruit}`)
// })

// app.get("/",(req,res)=>{
//     console.dir(req.cookies)
//     res.send("Hi i am root")
// })


app.use(session(sessionOptions));
app.use(flash())
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++
//     }else{
//         req.session.count=1;
//     }
//     res.send(`you requested ${req.session.count} times`)
// })

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success")
    res.locals.errMsg=req.flash("error")
    next()
})
app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
req.session.name=name;
console.log(req.session.name)
if(req.session.name==='anonymous'){
    req.flash("error","user not registered")
}
else{
    req.flash("success","user registered successfully")

}
res.redirect("/hello")
})

app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name:req.session.name})
})
app.get("/test",(req,res)=>{
    res.send("test success")
})
app.use("/users",users)
app.use("/posts",posts)




app.listen(3000,()=>[
    console.log("server is listening")
])