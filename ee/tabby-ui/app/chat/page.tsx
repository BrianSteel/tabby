'use client'

import { useState, useRef } from 'react'
import { useServer } from 'tabby-chat-panel/react'
import type {  FetcherOptions, ChatMessage } from 'tabby-chat-panel'

import { ChatPanelHandler, MockChatPanel } from './components/mock-chat-panel'

export default function Chat () {
  const [isInit, setIsInit] = useState(false)
  const [fetcherOptions, setFetcherOptions] = useState<FetcherOptions | null>(null)
  const chatPanelRef = useRef<ChatPanelHandler>(null);
  let messageQueueBeforeInit: ChatMessage[] = [];

  const sendMessage = (message: ChatMessage) => {
    if (!isInit) {
      return messageQueueBeforeInit.push(message)
    }

    if (chatPanelRef.current) {
      chatPanelRef.current.addMessage(message);
    }
  }

  useServer({
    init: (request) => {
      setIsInit(true)
      setFetcherOptions(request.fetcherOptions)

      messageQueueBeforeInit.forEach(sendMessage)
      messageQueueBeforeInit = []
    },
    sendMessage
  })

  if (!isInit || !fetcherOptions) return <></>
  // FIXME(wwayne): render chat component
  return (
    <MockChatPanel
      ref={chatPanelRef}
      fetcherOptions={fetcherOptions} />
  )
}