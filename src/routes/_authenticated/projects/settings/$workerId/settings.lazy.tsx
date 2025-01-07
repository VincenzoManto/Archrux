import { createLazyFileRoute } from '@tanstack/react-router'
import AgentSettings from '../../../../../features/chats/agents/settings'

export const Route = createLazyFileRoute(
  '/_authenticated/chats/agent/$workerId/settings',
)({
  component: AgentSettings,
})
