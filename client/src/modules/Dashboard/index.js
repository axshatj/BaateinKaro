import React, { useEffect, useState } from 'react'
import Avatar from '../../assets/avatar.svg'
import Phone from  '../../assets/phone-call.svg'
import Input from '../../components/input'
import Send from '../../assets/send.svg'
import Plus from '../../assets/plus-circle.svg'
const Dashboard = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')))
    const [conversations, setConversations] = useState([])
    const [messages, setMessages] = useState({})
    const [message, setMessage] = useState("")
    // console.log(user);
    // console.log(conversations);
    // console.log(messages.messages)
    // console.log( messages.messages ? Object.keys(messages.messages).length : 0)
    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user:detail'));
        const fetchConversations = async() => {
            const res = await fetch(`http://localhost:8000/api/conversation/${loggedInUser?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json()
            setConversations(data)
        }
        fetchConversations()
    }, [])
    const fetchMessage = async (conversationID,user) => {
        // console.log(conversationID,"k")
        const res = await fetch(`http://localhost:8000/api/message/${conversationID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const resData = await res.json()
        // console.log(resData, user)
        setMessages({messages: resData, receiver: user, conversationID: conversationID})
    }
    const sendMessage = async (e) => {
        console.log(messages)
        console.log(message)
        const res = await fetch(`http://localhost:8000/api/message/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                conversationID: messages?.conversationID,
                senderID: user?.id,
                message,
                receiverID: messages?.receiver?.receiverID
            })
        });
        // const resData = await res.json();
        // console.log(resData.conversationID, resData.senderID, resData.message);
        setMessage('')
    }
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
                        conversations.length > 0 ?
                        conversations.map(({ conversationID, user }) => {
                            // console.log(conversationID,user)
                            return (
                                <div className='flex items-center py-8 border-b border-b-gray-200'>
                                    <div className='cursor-pointer flex items-center' onClick={() => {
                                        fetchMessage(conversationID, user)
                                    }}>
                                        <img src={Avatar} width={60} height={60} className='rounded-full p-[2x] border border-primary'/>
                                    <div className='ml-6'>
                                        <h3 className='text-lg font-semibold'>{user.fullName}</h3>
                                        <p className='text-sm font-light text-gray-500'>{user.email}</p>
                                    </div>
                                    </div>
                                </div>
                            )
                        }) : <div className='text-left text-lg font-semibold mt-24'>No conversation</div>
                    }
                </div>
            </div>
        </div>
        <div className='w-[50%] h-screen bg-white flex flex-col items-center m-auto'>
            {
                messages?.receiver?.fullName &&
                <div className='w-[75%] bg-secondary h-[80px] mt-14 rounded-full flex items-center px-14'>
                        <div><img src={Avatar} width={40} height={40} className='cursor-pointer'/></div>
                        <div className='ml-6 mr-auto'>
                            <h3 className='text-lg font-semibold'>{messages?.receiver?.fullName}</h3>
                            <p className='text-ssm font-light text-gray-600'>{messages?.receiver?.email}</p>
                        </div>
                        <div>
                            <img src={Phone} height={20} width={20} className='cursor-pointer'/>
                        </div>
                </div>

            }
            <div className='h-[75%] border w-full overflow-scroll border-b'>
                        <div className='p-14'>
                {
                    messages.messages && Object.keys(messages.messages).length > 0 ? (
                        messages.messages.map(({ message, user: { id } = {} }) => (
                            <div key={id} className={`max-w-[40%] rounded-b-xl p-4 mb-6 ${id === user.id ? 'bg-primary text-white rounded-tl-xl ml-auto' : 'bg-secondary rounded-tr-xl'}`}>
                                {message}
                            </div>
                        ))
                    ) : (
                        <div className='text-center text-lg font-semibold mt-24'>No Messages</div>
                    )
                }
            </div>

            </div>
            {
                messages?.receiver?.fullName && 
                <div className='p-14 w-full flex items-center'>
                    <Input placeholder='type a message...' value={message} onChange={(e) => setMessage(e.target.value)} className='w-full' inputClassName='p4 -4 border-0 shadow-lg rounded-full bg-light focus:ring-0 focus:border-0 outline-none'/>
                    <div className={`ml-4 p-2 cursor-pointer bg-light rounded-full ${!message && 'pointer-events-none'}`}  onClick={() => sendMessage()}>
                        <img src={Send} height={40} width={40}/>
                    </div>
                    <div className={`ml-4 p-2 cursor-pointer bg-light rounded-full ${!message && 'pointer-events-none'}`}>
                        <img src={Plus} height={40} width={40}/>
                    </div>
                </div>
            }
        </div>
        <div className='w-[25%] h-screen'></div>
    </div>
  )
}

export default Dashboard