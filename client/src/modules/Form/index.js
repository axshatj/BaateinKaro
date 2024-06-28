import React, { useState } from 'react'
import Button from '../../components/button'
import Input from '../../components/input'
import { useNavigate } from 'react-router-dom'
const Form = ({
  isSignInPage = true,
}) => {
  const [data, setData] = useState({
    ...(!isSignInPage && {
      fullName: ''
    }),
    email: '',
    password: ''
  })
  const navigate = useNavigate();
  const handleSubmit = async(e) => {
    e.preventDefault();   
    // alert("hi")
    const res = await fetch(`http://localhost:8000/api/${ isSignInPage ? 'login' : 'register' }`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if(res.status === 400){
      // console.log("hi")
      alert("invalid credentials")
    }
    else{
      const resData = await res.json(); 
      if(resData.token){
        localStorage.setItem('user:token', resData.token);
        localStorage.setItem('user:detail',JSON.stringify(resData.user))
        navigate('/')
      }
    }

  }

  return (
    <div className='bg-light h-screen flex items-center justify-center'>
    <div className='bg-white w-[600px] h-[800px] shadow-lg rounded-lg flex flex-col justify-center items-center'>
        <div className='text-4xl font-extrabold'>Welcome {isSignInPage && 'Back'}</div>
        <div className='text-xl font-light mb-10'>{isSignInPage? 'Sign in to get explored': 'Sign-up now to get started'}</div>
        <form className='flex flex-col items-center w-full' onSubmit={(e) => handleSubmit(e)}>
        {!isSignInPage && <Input label='Full name' name='name' placeholder='Enter your full name' className='mb-6 w-80' value={data.fullName} onChange={(e) => setData({...data, fullName: e.target.value})}/>}
        <Input label='Email address' name='email' type='email' placeholder='Enter your Email address' className='mb-6 w-80' value={data.email} onChange={(e) => setData({ ...data, email: e.target.value})}/>
        <Input label='Password' name='password' type='password' placeholder='Enter your password' className='mb-14 w-80' value={data.password} onChange={(e) => setData({ ...data, password: e.target.value})}/>
        <Button label={isSignInPage ? "Sign in" : "Sign up"} type='submit' className='w-1/4 mb-2'/>
        </form>
        <div>{!isSignInPage ? "Already have and account" : "Didn't have an account"} <span className='text-primary cursor-pointer underline' onClick={() => navigate(`/users/${isSignInPage ? 'sign_up' : 'sign_in'}`)}>{isSignInPage ? "Sign in" : "Sign up"}</span></div>
    </div>
    
    </div>
  )
}

export default Form