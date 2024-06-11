const express=require('express');
const app=express();
const cors=require('cors');
const bodyParser=require('body-parser')
const {signup}=require('./model/Signup')
const {connectMongoDB}=require('./ConnectMongo');
const {setUserLogin}=require('./AuthUserLogin')

connectMongoDB('mongodb+srv://kesharwanishivam615:aPBvGIJmLaETFblj@cluster0.mongodb.net/movie_card?retryWrites=true&w=majority')
.then(()=>console.log('MongoDB Connected!'))
.catch(()=>{'something went worng!'})

app.use(express.static('./build'))
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({extended:false}))

app.get('/',async (req,res)=>{
    const alldata=await signup.find({})
    // console.log(alldata);
    res.json(alldata);
})

app.post('/',async (req,res)=>{
const body=req.body;
try{
const Check_user_avail=await signup.find({email:body.email})
console.log('Check_user_avail',Check_user_avail[0])
if(Check_user_avail[0]==undefined?false:true){
res.send('Account already exist');
console.log('send')
}
const result = await signup.create({
  email:body.email,
  password:body.password,
})
// console.log('result:',result);
res.send('Account is Registered,thank you!');
}catch(err){
console.log('err:',err);
}
})

app.post('/login',async(req,res)=>{
  const {email,password}=req.body;
  console.log('user',req.body);
  const userLogin=await signup.findOne({email,password})
  console.log('userLogin:',userLogin)
  if(!userLogin){
    return res.send('Wrong creadential!');
  }else{ 
    const token=setUserLogin([userLogin]);
    console.log('token:',token);
    res.json({'token':token})
  }
 //  res.status(200).json({ message: 'Operation successful' });
})

app.listen(4000,()=>{
    console.log('server is running!')
});
