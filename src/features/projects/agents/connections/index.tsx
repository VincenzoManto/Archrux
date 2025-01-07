import ContentSection from "../../../settings/components/content-section";
import AgentConnectionsForm from "./connections-form";

export default function AgentConnections() {
  return (
    <ContentSection
      title='Connections'
      desc='Agent connections are the services that this agent is connected to.'
    >
      <AgentConnectionsForm />
    </ContentSection>
  )
}
