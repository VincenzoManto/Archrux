import { createLazyFileRoute } from '@tanstack/react-router'
import AgentConnections from '../../../../../../features/chats/agents/connections'

export const Route = createLazyFileRoute(
  '/_authenticated/projects/settings/$workerId/$area/',
)({ component: AgentConnections })
