import express from "express";
import bcrypt from "bcrypt";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, setDoc, getDoc, updateDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDYHtz5YU69cefwD2WkRgfCwHHN99YefaU",
  authDomain: "iplaytv-v2.firebaseapp.com",
  projectId: "iplaytv-v2",
  storageBucket: "iplaytv-v2.appspot.com",
  messagingSenderId: "639219261198",
  appId: "1:639219261198:web:ca35a7f83738a306fa015f"
};


const firebase = initializeApp(firebaseConfig);
const db = getFirestore();


const app = express();

app.use(express.static("public"));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile("index.html", { root : "public" })
})

app.get('/signup', (req, res) => {
    res.sendFile("signup.html", { root : "public" })
})

app.post('/signup', (req, res) => {
    const { name, email, password, number, tac } = req.body;

    if(name.length < 3) {
        res.json({ 'alert' : 'Name most be 3 letters long'});
    } else if(!email.length) {
        res.json({ 'alert' : 'Enter your valid Email'});
    } else if(password.length < 8) {
        res.json({ 'alert' : 'Enter a strong password'});
    }  else if (!tac) {
        res.json({ 'alert' : 'You most agree to our Terms and Conditions!'});
    } else {
        const users = collection(db, "users");

        getDoc(doc(users, email)).then(user => {
            if(user.exists()) {
                return res.json({ 'alert' : 'email already exists!' })
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        req.body.password = hash;

                        setDoc(doc(users, email), req.body).then(data => {
                            res.json({
                                name: req.body.name,
                                email: req.body.email,
                            })
                        })
                    })
                })
            }
        })
    }
})


app.get('/login', (req, res) => {
    res.sendFile("login.html", { root : "public" })
})

app.post('/login', (req, res) => {
    let { email, password } = req.body;

    if(!email.length || !password.length){
        res.json({ 'alert' : 'fill all the form please!' })
    } 

    const users = collection(db , "users");

    getDoc(doc(users, email))
    .then(user => {
        if (!user.exists()) {
            return res.json({ 'alert' : 'email does not exists'})
        } else {
            bcrypt.compare(password, user.data().password, (err, result) => {
                if(result) {
                    let data = user.data();
                    return res.json({
                        name: data.name,
                        email: data.email
                    })
                }
                else {
                    return res.json({ 'alert' : 'password is incorrect '})
                }
            })
        }
    })
})

app.get('/404', (req, res) => {
    res.sendFile("/", { root : "public" })
})

app.use((req, res) => {
    res.redirect('/404')
})

app.listen(3000, () => {
    console.log('listening on port 3000')
})