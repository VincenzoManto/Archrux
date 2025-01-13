import { createLazyFileRoute } from '@tanstack/react-router'
import { Details } from '../../../../features/projects/details'

export const Route = createLazyFileRoute('/_authenticated/projects/$id/')({
  component: Details,
})
