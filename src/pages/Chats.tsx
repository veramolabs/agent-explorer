import { useParams } from 'react-router-dom'
import Page from '../layout/SplitPage'
import ChatThread from '../components/standard/ChatThread'
import ChatScrollPanel from '../components/standard/ChatScrollPanel'
import ChatWindow from '../components/standard/ChatWindow'
import ChatHeader from '../components/standard/ChatHeader'
import Layout from 'antd/lib/layout/layout'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { useChat } from '../context/ChatProvider'
import { IMessage } from '@veramo/core'
import { useEffect } from 'react'

const groupBy = (arr: any[], property: string) => {
  return arr.reduce((acc, cur) => {
    acc[cur[property]] = [...(acc[cur[property]] || []), cur]
    return acc
  }, {})
}

const ChatView = () => {
  const { agent } = useVeramo()
  const { selectedDid } = useChat()
  const { threadId } = useParams<{ threadId: string }>()
  const { data: threads, refetch } = useQuery(
    ['threads', { id: agent?.context.id, selectedDid, threadId }],
    async () => {
      const messages = await agent?.dataStoreORMGetMessages({
        where: [{ column: 'type', value: ['veramo.io-chat-v1'] }],
        order: [{ column: 'createdAt', direction: 'DESC' }],
      })
      // TODO: should be able to do this filter in the query instead of here
      const applicableMessages = (messages as IMessage[])?.filter(
        (message) => message.from === selectedDid || message.to === selectedDid,
      )

      const senderTagged = applicableMessages?.map((message: any) => {
        return {
          ...message,
          isSender: message.from === selectedDid,
        }
      })

      if (senderTagged) {
        const grouped = groupBy(senderTagged, 'threadId')
        return grouped
      }
    },
    {
      refetchInterval: 5000,
    },
  )
  useEffect(() => {
    refetch()
  }, [selectedDid, refetch, threadId])

  return (
    <Page
      name="chats"
      header={<ChatHeader />}
      leftContent={
        <Layout>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            <ChatScrollPanel>
              {threads &&
                Object.keys(threads).map((index: any) => {
                  return (
                    <ChatThread
                      thread={threads[index]}
                      threadId={index}
                      key={index}
                      threadSelected={index === threadId}
                    />
                  )
                })}
            </ChatScrollPanel>
          </div>
        </Layout>
      }
      rightContent={
        <Layout>
          <ChatWindow />
        </Layout>
      }
    ></Page>
  )
}

export default ChatView
