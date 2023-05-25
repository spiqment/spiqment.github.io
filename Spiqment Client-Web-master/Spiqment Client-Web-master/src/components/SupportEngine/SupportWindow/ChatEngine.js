import React, { useState , useEffect } from 'react'

import{ ChatEngine as ChatEngineReact, ChatEngineWrapper, Socket, ChatFeed } from 'react-chat-engine'

const ChatEngine = props => {

    const [showChat, setShowChat] = useState(false)

    useEffect(() => {
        if(props.visible){
            setTimeout(()=> {
                setShowChat(true)
            }, 500)
        }
    })

    useEffect(() => {
        console.log(props.user,  "CURRENT UERRRR")
    }, [props.user]);


        return (
        <div
            className='transition-5'
            style={{
                    height: props.visible ? '100%' : '0%',
                    zIndex: props.visible ? '100' : '0',
                    width:'100%',
                    backgroundColor:'white'
            }}
        >
            {
                props.visible && 
                <ChatEngineWrapper>
                    <Socket 
                        projectID={process.env.REACT_APP_CE_PROJECT_ID}
                        userName={props.user.email}
                        userSecret={props.user.email}
                        // userName={props.user.email}
                        // userSecret={props.user.email}
                    />
                    <ChatFeed activeChat={props.chat.id} />
                </ChatEngineWrapper>


                // <ChatEngineReact 
                //     userName={props.user.email}
                //     userSecret={props.user.email}
                //     projectID={process.env.REACT_APP_CE_PROJECT_ID}
                //     renderChatList={(hideUI) => {hideUI=true}}
                //     renderChatSettings={(hideUI) => {hideUI=true}}
                //     renderNewMessageForm={(chatId) => {chatId = props.user.chatId}}
                    // renderChatCard={(chat, index) => {}}
                    // renderNewChatForm={(creds) => {}}
                    // renderChatFeed={(chatAppState) => {}}
                    // renderMessageBubble={(creds, chat, lastMessage, message, nextMessage) => {}}
                    // renderIsTyping={(typers) => {}}
                    // renderNewMessageForm={(creds, chatId) => {}}
                    // renderChatSettings={(chatAppState) => {}}
                    // renderChatSettingsTop={(creds, chat) => {}}
                    // renderPeopleSettings={(creds, chat) => {}}
                    // renderPhotosSettings={(chat) => {}}
                    // renderOptionsSettings={(creds, chat) => {}}

                // <ChatEngineWrapper>
                //     <Socket 
                //         projectID={process.env.REACT_APP_CE_PROJECT_ID}
                //         userName={'shahzaib@gmail.com'}
                //         userSecret={'shahzaib@gmail.com'}
                //         // userName={props.user.email}
                //         // userSecret={props.user.email}
                //     />
                //     <ChatFeed activeChat={props.chat.id} />
                // </ChatEngineWrapper>
            }
        </div>
    )
}

export default ChatEngine;
