import React, { useState} from 'react'

import {styles} from '../styles'

import EmailForm from './EmailForm'
import ChatEngine from './ChatEngine'

const SupportWindow = props => {
//state
const [user, setUser] = useState(null)
const [chat, setChat] = useState(null)

    return (
        <div
            className='transition-5'
            style={{
                ...styles.supportWindow,
                ...{ opacity: props.visible ? '1' : '0'},
                ...{ pointerEvents: props.visible ? "auto" : "none"},
            }}
        >
            <EmailForm 
                setUser={user => setUser(user)}
                setChat={chat => setChat(chat)}
                visible={user === null || chat === null}
            />

            <ChatEngine 
                 visible={user !== null && chat !== null}
                 chat={chat}
                 user={user}
            />
        </div>
    )   
}

export default SupportWindow; 