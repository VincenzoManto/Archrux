import { createLazyFileRoute } from '@tanstack/react-router'
import AgentSettings from '@/features/projects/agents/settings'

export const Route = createLazyFileRoute(
  '/_authenticated/projects/settings/$workerId/settings',
)({
  component: AgentSettings,
})
