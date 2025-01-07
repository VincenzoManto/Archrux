import { createFileRoute, createLazyFileRoute } from '@tanstack/react-router'
import Agent from '../../../../../features/chats/agents'

export const Route = createLazyFileRoute(
  '/_authenticated/projects/settings/$workerId',
)({
  component: Agent,
})
