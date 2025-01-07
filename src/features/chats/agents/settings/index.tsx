import ContentSection from '../../../settings/components/content-section'
import AgentSettingsForm from './settings-form'

export default function AgentSettings() {
  return (
    <ContentSection
      title='Settings for Agent'
      desc='This is where you can configure the settings for this agent.'
    >
      <AgentSettingsForm />
    </ContentSection>
  )
}
