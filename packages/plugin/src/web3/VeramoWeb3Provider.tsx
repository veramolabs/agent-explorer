import { useEffect, useState } from 'react'
import { VeramoProvider } from '@veramo-community/veramo-react'
import { createAgent, IAgentPlugin, IResolver, TAgent } from '@veramo/core'
import { ConnectorInfo, createWeb3Agent } from './web3Agent.js'
import { AgentRestClient } from '@veramo/remote-client'
import { IdentifierProfilePlugin } from '../agent-plugins/IdentifierProfilePlugin.js'

import { useAccount, useNetwork } from 'wagmi'
import { useEthersProvider } from './wagmi.js'
import { useQueryClient } from 'react-query'
import { AbstractMessageHandler } from '@veramo/message-handler'

export const VeramoWeb3Provider = ({
  children,
  plugins = [],
  messageHandlers = [],
}: {
  children: JSX.Element | JSX.Element[]
  plugins?: IAgentPlugin[]
  messageHandlers?: AbstractMessageHandler[]
}) => {
  //@ts-ignore
  const config = window.PRE_CONFIGURED_AGENTS

  const [isLoading, setIsLoading] = useState(true)
  const [web3agent, setWeb3Agent] = useState<TAgent<IResolver>>()
  const [preConfiguredAgents, setPreConfiguredAgents] =
    useState<Array<TAgent<IResolver>>>()
  const queryClient = useQueryClient()

  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const provider = useEthersProvider()
  
  useEffect(() => {
    const connectors: ConnectorInfo[] = []

    if (
      address &&
      isConnected &&
      provider && 
      chain
    ) {
      connectors.push({
        chainId: chain.id,
        accounts: [address],
        provider: provider,
        isActive: true,
        name: 'walletconnect',
      })
    }
    void createWeb3Agent({ connectors, messageHandlers }).then(setWeb3Agent).then(() => {
      queryClient.invalidateQueries({ 
        queryKey: [
          'identifiers', 
          { agentId: 'web3Agent'}
        ] 
      })
    })
    return () => {
      setWeb3Agent(undefined)
    }
  }, [messageHandlers, address, isConnected, provider, chain])

  useEffect(() => {
    if (config && Array.isArray(config)) {
      const createAgents = async (
        config: Array<{ schemaUrl: string; apiKey?: string }>,
      ): Promise<Array<TAgent<IResolver>>> => {
        const agents = config.map(
          async (c: { schemaUrl: string; apiKey?: string; name?: string }) => {
            const response = await fetch(c.schemaUrl)
            const schema = await response.json()
            return createAgent<IResolver>({
              context: {
                name: c.name || 'Default',
              },
              plugins: [
                new AgentRestClient({
                  url: schema.servers[0].url,
                  headers: c.apiKey
                    ? { Authorization: 'Bearer ' + c.apiKey }
                    : undefined,
                  enabledMethods: Object.keys(schema['x-methods']),
                  schema: schema,
                }),
                new IdentifierProfilePlugin(),
              ],
            })
          },
        )
        return Promise.all(agents)
      }

      createAgents(config)
        .then(setPreConfiguredAgents)
        .then(() => setIsLoading(false))
        .catch((e) => {
          console.log(e)
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }

    return () => {
      setPreConfiguredAgents([])
      setIsLoading(true)
    }
  }, [config])

  plugins.push(new IdentifierProfilePlugin())
  let allAgents = []
  if (web3agent) {
    allAgents.push(web3agent)
  }
  if (preConfiguredAgents) {
    allAgents = allAgents.concat(preConfiguredAgents)
  }

  return (
    <VeramoProvider agents={allAgents} plugins={plugins}>
      {!isLoading && children}
      {isLoading && <div>Loading...</div>}
    </VeramoProvider>
  )
}
