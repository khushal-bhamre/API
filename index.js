import express from 'express';
import users from './MOCK_DATA.json' assert{type:'json'}
import path from 'path';
import fs from 'fs';
import { error } from 'console';


const app= express();
const port=3000;
const __dirname = path.resolve('./')

//middleware

app.use(express.urlencoded({extended:true}));


//routes

app.get('/users',(req,res)=>{
    const html=`<ul> ${users.map(user=>`<li>${user.first_name}</li>`).join('')}</ul>`

    res.send(html);
})


app.get('/api/users',(req,res)=>{
    res.json(users);
})


//dynamic routing :

app.get('/api/users/:id',(req,res)=>{
     const id = Number(req.params.id);
     const user =users.find((user)=>user.id==id);

     res.json(user);

})

//post route

app.post('/api/users',(req,res)=>{
    //create user
    const newuser = req.body;
    newuser.id = users.length+1;
    
    //push user
    users.push(newuser);

    //write updated users array to mock_data.json
    fs.writeFile(__dirname +'/MOCK_DATA.json',JSON.stringify(users),(err)=>{
       if (err) {
        console.log(err);
        return res.status(50).json({status:"failed to write file"})
       } else {
        return res.status(201).json({status:"created"})
       }
    })

})

//put route -hw

app.put('/api/user',(req,res)=>{

})

//patch route

app.patch('/api/users/:id',(req,res)=>{
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user)=>user.id == id);

     if(userIndex == -1){
        return res.status(404).json({error:'user not found'});
     }

     const updatedUser = {...users[userIndex] , ...req.body};
     users[userIndex] = updatedUser;

     //sync
     try {
        fs.writeFileSync(path.join(__dirname,'MOCK_DATA.json'),JSON.stringify(users));

        return res.json({success:'user successfully updated',user:updatedUser})
        
     } catch (error) {
        return res.status(505).json({error:'failed to update the user'})
     }
})



app.listen(port,()=>{
    console.log(`server is running on ${port}`);
})