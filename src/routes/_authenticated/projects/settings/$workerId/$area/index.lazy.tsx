import { createLazyFileRoute } from '@tanstack/react-router'
import AgentConnections from '../../../../../../features/chats/agents/connections'

export const Route = createLazyFileRoute(
  '/_authenticated/chats/agent/$workerId/$area/',
)({ component: AgentConnections })
