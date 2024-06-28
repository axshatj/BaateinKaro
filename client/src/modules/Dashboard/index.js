import React, { useEffect, useState } from 'react'
import Avatar from '../../assets/avatar.svg'
import Phone from  '../../assets/phone-call.svg'
import Input from '../../components/input'
import Send from '../../assets/send.svg'
import Plus from '../../assets/plus-circle.svg'
const Dashboard = () => {
    const contacts = [
        {
            name: 'John',
            status: 'Available',
            img: 'Avatar'
        },
        {
            name: 'Silicon',
            status: 'Available',
            img: 'Avatar'
        },
        {
            name: 'Fermium',
            status: 'Available',
            img: 'Avatar'
        },
        {
            name: 'John',
            status: 'Available',
            img: 'Avatar'
        },
        {
            name: 'Williams',
            status: 'Available',
            img: 'Avatar'
        }
    ]
    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user:detail'));
        console.log(loggedInUser.id);
        const fetchConversations = async() => {
            const res = await fetch(`http://localhost:8000/api/conversation/${loggedInUser?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            // console.log("hi")
            const data = await res.json()
            setConversations(data)
            // console.log(res)
        }
        fetchConversations()
    }, [])
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')))
    const [conversations, setConversations] = useState([])
    console.log(user);
    console.log(conversations);
  return (
      <div className='w-screen flex'>
        <div className='w-[25%] h-screen bg-secondary'>
            <div className='flex justify-center items-center my-8'>
                <div className='border border-primary p-2 rounded-full'>
                    <img src={Avatar} width={75} height={75}/>
                </div>
                <div className='ml-8'>
                    <h3 className='text-2xl'>{user.fullName}</h3>
                    <p className='text-lg font-light'>{user.fullName}</p>
                </div>
            </div>
            <hr/>
            <div className='ml-14 mt-10'>
                <div className='text-primary text-lg'>Messages</div>
                <div>
                    {
                        conversations.map(({ conversationID, user }) => {
                            return (
                                <div className='flex items-center py-8 border-b border-b-gray-200'>
                                    <div className='border border-primary p-2 rounded-full'>
                                        <img src={Avatar} width={60} height={60}/>
                                    </div>
                                    <div className='ml-6'>
                                        <h3 className='text-xl'>{user.fullName}</h3>
                                        <p className='text-sm font-light'>{user.email}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
        <div className='w-[50%] h-screen bg-white flex flex-col items-center'>
            <div className='w-[75%] bg-secondary h-[80px] mt-14 rounded-full flex items-center px-14'>
                    <div><img src={Avatar} width={40} height={40} className='cursor-pointer'/></div>
                    <div className='ml-6 mr-auto'>
                        <h3 className='text-lg font-semibold'>Alexander</h3>
                        <p className='text-ssm font-light text-gray-600'>online</p>
                    </div>
                    <div>
                        <img src={Phone} height={20} width={20} className='cursor-pointer'/>
                    </div>
            </div>
            <div className='h-[75%] border w-full overflow-scroll border-b'>
                    <div className='p-14'>
                        <div className='max-w-[40%] bg-secondary rounded-b-xl rounded-tr-xl p-4 mb-6'>
                            lorem epsum what is my name but hte name provided is the name of mine and i hate ht 
                        </div>
                        <div className='max-w-[40%] bg-primary rounded-b-xl rounded-tl-xl ml-auto p-4 text-white mb-6'>
                        lorem epsum what is my name but hte name provided is the name of mine and i hate ht 
                        </div>
                    </div>
            </div>
            <div className='p-14 w-full flex items-center'>
                <Input placeholder='type a message...' className='w-full' inputClassName='p4 -4 border-0 shadow-lg rounded-full bg-light focus:ring-0 focus:border-0 outline-none'/>
                <div className='ml-4 p-2 cursor-pointer bg-light rounded-lg'>
                    <img src={Send} height={40} width={40}/>
                </div>
                <div className='ml-4 p-2 cursor-pointer bg-light rounded-lg'>
                    <img src={Plus} height={40} width={40}/>
                </div>
            </div>
        </div>
        <div className='w-[25%] h-screen'></div>
    </div>
  )
}

export default Dashboard