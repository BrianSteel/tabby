import React from 'react'
import type { ChatMessage } from 'tabby-chat-panel'
import { useClient } from 'tabby-chat-panel/react'

import { useStore } from '@/lib/hooks/use-store'
import { useChatStore } from '@/lib/stores/chat-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { IconClose } from '@/components/ui/icons'

import { QuickActionEventPayload } from '../lib/event-emitter'
import { SourceCodeBrowserContext } from './source-code-browser'
import { start } from 'repl'

interface ChatSideBarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {}

export const ChatSideBar: React.FC<ChatSideBarProps> = ({
  className,
  ...props
}) => {
  const { pendingEvent, setPendingEvent } = React.useContext(
    SourceCodeBrowserContext
  )
  const activeChatId = useStore(useChatStore, state => state.activeChatId)
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const client = useClient(iframeRef)

  const getPrompt = ({
    action,
    code,
    language,
    path,
    lineFrom,
    lineTo
  }: QuickActionEventPayload): ChatMessage => {
    let builtInPrompt = ''
    switch (action) {
      case 'explain':
        builtInPrompt = 'Explain the following code:'
        break
      case 'generate_unittest':
        builtInPrompt = 'Generate a unit test for the following code:'
        break
      case 'generate_doc':
        builtInPrompt = 'Generate documentation for the following code:'
        break
      default:
        break
    }
    const range = lineFrom && { start: lineFrom, end: lineTo } || undefined
    return {
      message: `${builtInPrompt}\n${'```'}${language ?? ''}\n${code}\n${'```'}\n`,
      selectContext: {
        kind: 'file',
        range,
        language,
        // FIXME(wwayne): if path is undefined
        path: path!
      }
    }
  }

  React.useEffect(() => {
    if (iframeRef?.current) {
      client?.init({
        fetcherOptions: {
          authorization: 'auth-token'
        }
      })
    }
  }, [iframeRef?.current, client])

  React.useEffect(() => {
    if (pendingEvent && client) {
      const chatMessage = getPrompt(pendingEvent)
      client.sendMessage(chatMessage)
      setPendingEvent(undefined)
    }
  }, [pendingEvent, client])

  return (
    <div className={cn('flex h-full flex-col', className)} {...props}>
      <Header />
      <iframe
        src={`/chat`}
        className="w-full flex-1 border-0"
        key={activeChatId}
        ref={iframeRef}
      />
    </div>
  )
}

function Header() {
  const { setChatSideBarVisible } = React.useContext(SourceCodeBrowserContext)

  return (
    <div className="sticky top-0 flex items-center justify-end px-2 py-1">
      <Button
        size="icon"
        variant="ghost"
        onClick={e => setChatSideBarVisible(false)}
      >
        <IconClose />
      </Button>
    </div>
  )
}
