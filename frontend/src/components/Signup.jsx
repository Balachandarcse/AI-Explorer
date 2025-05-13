import { useState } from "react"
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import "../css/signup.css"
const Signup=()=>{
    const [firstname,setFirstname]=useState("");
    const [lastname,setLastname]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const navigator=useNavigate()
    const handleSubmit=async (e)=>{
        e.preventDefault();
        try{
            const res= await axios.post("http://localhost:4000/signup",{
                firstname:firstname,
                lastname:lastname,
                email:email,
                password:password
            })
            console.log(res.data)
            if(res.data.isvalid){
                alert("account created Successfully!");
                navigator('/');
            }
            else{
                alert("account creation failed!")
            }
        }catch(err){
            console.log(err);
        }

    }

    return (
        <div className="signup-page">
        <div className="signup">
            <h2>SignUp page</h2>
            <form onSubmit={handleSubmit}>
            <div className="input">
                    <label htmlFor="name">firstName</label>
                    <input type="text" name="firstname" onChange={(event)=>setFirstname(event.target.value)} placeholder="enter your firstname" required/>
                </div>
                <div className="input">
                    <label htmlFor="name">lastName</label>
                    <input type="text" name="lastname" onChange={(event)=>setLastname(event.target.value)} placeholder="enter your lastname" required/>
                </div>
                <div className="input">
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" onChange={(event)=>setEmail(event.target.value)} placeholder="enter your email" required/>
                </div>
                <div className="input">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password"onChange={(event)=>setPassword(event.target.value)} placeholder="enter your password" required/>
                </div>
                <button className="btn">SignUp</button>
            </form>
            <Link to="/">Already have an account?</Link>
            
        </div>
        </div>
    )
}

export default Signup