const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { signup } = require('./model/Signup');
const { connectMongoDB } = require('./ConnectMongo');
const { setUserLogin } = require('./AuthUserLogin');

// const url = 'mongodb://kesharwanishivam615:aPBvGIJmLaETFblj@cluster0-shard-00-00.abcde.mongodb.net:27017,cluster0-shard-00-01.abcde.mongodb.net:27017,cluster0-shard-00-02.abcde.mongodb.net:27017/movie_card?ssl=true&replicaSet=atlas-abcdef-shard-0&authSource=admin&retryWrites=true&w=majority';
// const url = "mongodb+srv://kesharwanishivam615:aPBvGIJmLaETFblj@cluster0.o1fpakq.mongodb.net/"
const url = "mongodb+srv://kesharwanishivam615:y2OwlQCRLMHIEgoK@cluster0.qlnjuxt.mongodb.net/filmyVerse?retryWrites=true&w=majority&appName=Cluster0"
// const url = "mongodb+srv://kesharwanishivam615:aPBvGIJmLaETFblj@cluster0.lsehqjp.mongodb.net/"
connectMongoDB(url)
    .then(() => console.log('MongoDB Connected!'))
    .catch(err => console.error('Something went wrong!', err));

app.use(express.static('./build'));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    try {
        const alldata = await signup.find({});
        res.json(alldata);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/', async (req, res) => {
    const body = req.body;
    try {
        const Check_user_avail = await signup.find({ email: body.email });
        if (Check_user_avail.length > 0) {
            return res.send('Account already exists');
        }
        const result = await signup.create({
            email: body.email,
            password: body.password,
        });
        res.send('Account is Registered, thank you!');
    } catch (err) {
        console.error('Error creating account:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userLogin = await signup.findOne({ email, password });
        if (!userLogin) {
            return res.send('Wrong credentials!');
        }
        const token = setUserLogin([userLogin]);
        res.json({ token: token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
