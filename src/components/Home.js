import React from 'react'

export default function Home() {
    return (
        <div className='cursor-default flex flex-col'>
            <div className='mt-48 self-center'>
                <h1 className='font-semibold text-purple-900 super-potato' style={{ fontSize: '2.5rem' }}>Create. Collaborate. Connect.</h1>
            </div>
            <div className='mt-10 px-60 text-justify text-md text-gray-600'>
                <p>
                    CanvasConnect is a real-time collaborative whiteboard application designed to bring people together for creative and productive drawing sessions. Whether you're brainstorming ideas, planning projects, or simply having fun with friends, CanvasConnect provides a seamless and interactive canvas for you to create, collaborate, and connect. Join us and experience the power of collective creativity.
                </p>
            </div>
        </div>
    )
}
