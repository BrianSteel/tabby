'use client'

import { forwardRef, useImperativeHandle, useState } from 'react'
import type { FetcherOptions, ChatMessage } from 'tabby-chat-panel'

export interface ChatPanelHandler {
  addMessage: (message: ChatMessage) => void;
}

interface ChatPanelProps {
  fetcherOptions: FetcherOptions
}

export const MockChatPanel = forwardRef<ChatPanelHandler, ChatPanelProps>(({
  fetcherOptions
}, ref) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  useImperativeHandle(ref, () => ({
    addMessage: (message: ChatMessage) => {
      const oldMessage = [...messages]
      setMessages(oldMessage.concat(message))
    },
  }));

  return (
    <div>
      <h1>Initialized</h1>
      {messages.map((msg, index) => (
        <div key={index}>
          <h1>MESSAGE</h1>
          <p>{msg.message}</p>
          {msg.selectContext &&
            <>
              <h3>SELECTED CONTEXT</h3>
              <p>{JSON.stringify(msg.selectContext)}</p>
            </>
          }
        </div>
      ))}
    </div>
  )
})