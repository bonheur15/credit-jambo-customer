import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/device-not-approved')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/device-not-approved"!</div>
}
