import { createLazyFileRoute } from '@tanstack/react-router'
import Agent from '../../../../../features/chats/agents'

export const Route = createLazyFileRoute(
  '/_authenticated/chats/agent/$workerId/',
)({
  component: Agent,
})
