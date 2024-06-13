import React from 'react';
import { Link } from 'react-router-dom';


export default function Nav() {
    return (
        <div>
            <div className='flex justify-between px-5'>
                <div>
                    <Link to="/"><h1 className='my-3 font-black text-4xl text-purple-600 satisfy-regular'>Canvas Connect</h1></Link>
                </div>
                <div>
                    <ul className='flex flex-row my-5 font-medium'>
                        <li className='mx-4 -my-2 cursor-pointer text-white'>
                           <Link to='/create'><button className='bg-purple-600 active:bg-purple-950 hover:bg-purple-800 px-4 py-2 rounded-lg'>Create</button></Link>
                        </li>
                        <li className='mx-4 cursor-pointer hover:text-cyan-400'>Saved</li>
                        <li className='mx-4 cursor-pointer hover:text-cyan-400'>About</li>
                        <li className='mx-4 cursor-pointer hover:text-cyan-400'>Login</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
