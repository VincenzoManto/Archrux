import React from 'react'
import {
  IconAuth2fa,
  IconCloudNetwork,
  IconDatabase,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconFileDatabase,
  IconNetwork,
  IconServer,
  IconServer2,
  IconServerBolt,
} from '@tabler/icons-react'
import { Button } from '../../../components/ui/button'

// umlComponents.ts
export const UMLComponents = {
  servers: [
    {
      id: 'server-1',
      label: 'Application Server',
      type: 'server',
      icon: IconServer,
    },
    {
      id: 'server-2',
      label: 'Database Server',
      type: 'server',
      icon: IconServer2,
    },
    {
      id: 'server-3',
      label: 'Web Server',
      type: 'server',
      icon: IconServerBolt,
    },
    { id: 'server-4', label: 'Mail Server', type: 'server', icon: IconServer },
    {
      id: 'server-5',
      label: 'Proxy Server',
      type: 'server',
      icon: IconServer2,
    },
    {
      id: 'server-6',
      label: 'FTP Server',
      type: 'server',
      icon: IconServerBolt,
    },
  ],
  storage: [
    { id: 'nas-1', label: 'NAS', type: 'storage', icon: IconDatabase },
    { id: 'storage-1', label: 'SAN', type: 'storage', icon: IconFileDatabase },
    {
      id: 'storage-2',
      label: 'Cloud Storage',
      type: 'storage',
      icon: IconDatabase,
    },
    {
      id: 'storage-3',
      label: 'Local Storage',
      type: 'storage',
      icon: IconFileDatabase,
    },
    {
      id: 'storage-4',
      label: 'Backup Storage',
      type: 'storage',
      icon: IconDatabase,
    },
  ],
  clients: [
    {
      id: 'client-1',
      label: 'Desktop Client',
      type: 'client',
      icon: IconDeviceDesktop,
    },
    {
      id: 'client-2',
      label: 'Mobile Client',
      type: 'client',
      icon: IconDeviceMobile,
    },
    {
      id: 'client-3',
      label: 'Tablet Client',
      type: 'client',
      icon: IconDeviceMobile,
    },
    {
      id: 'client-4',
      label: 'Laptop Client',
      type: 'client',
      icon: IconDeviceDesktop,
    },
    {
      id: 'client-5',
      label: 'Smart TV Client',
      type: 'client',
      icon: IconDeviceDesktop,
    },
  ],
  network: [
    { id: 'router-1', label: 'Router', type: 'network', icon: IconNetwork },
    {
      id: 'switch-1',
      label: 'Switch',
      type: 'network',
      icon: IconCloudNetwork,
    },
    { id: 'network-1', label: 'Firewall', type: 'network', icon: IconNetwork },
    {
      id: 'network-2',
      label: 'Load Balancer',
      type: 'network',
      icon: IconCloudNetwork,
    },
    { id: 'network-3', label: 'Gateway', type: 'network', icon: IconNetwork },
  ],
  devices: [
    {
      id: 'device-1',
      label: 'Printer',
      type: 'device',
      icon: IconDeviceDesktop,
    },
    {
      id: 'device-2',
      label: 'Scanner',
      type: 'device',
      icon: IconDeviceDesktop,
    },
    {
      id: 'device-3',
      label: 'Camera',
      type: 'device',
      icon: IconDeviceDesktop,
    },
    {
      id: 'device-4',
      label: 'IoT Device',
      type: 'device',
      icon: IconDeviceDesktop,
    },
    {
      id: 'device-5',
      label: 'Smart Watch',
      type: 'device',
      icon: IconDeviceMobile,
    },
  ],
  services: [
    {
      id: 'service-1',
      label: 'Web Service',
      type: 'service',
      icon: IconServer,
    },
    {
      id: 'service-2',
      label: 'Database Service',
      type: 'service',
      icon: IconServer2,
    },
    {
      id: 'service-3',
      label: 'Authentication Service',
      type: 'service',
      icon: IconServerBolt,
    },
    {
      id: 'service-4',
      label: 'Email Service',
      type: 'service',
      icon: IconServer,
    },
    {
      id: 'service-5',
      label: 'File Service',
      type: 'service',
      icon: IconServer2,
    },
  ],
  applications: [
    {
      id: 'app-1',
      label: 'CRM Application',
      type: 'application',
      icon: IconDeviceDesktop,
    },
    {
      id: 'app-2',
      label: 'ERP Application',
      type: 'application',
      icon: IconDeviceDesktop,
    },
    {
      id: 'app-3',
      label: 'HR Application',
      type: 'application',
      icon: IconDeviceDesktop,
    },
    {
      id: 'app-4',
      label: 'Finance Application',
      type: 'application',
      icon: IconDeviceDesktop,
    },
    {
      id: 'app-5',
      label: 'Marketing Application',
      type: 'application',
      icon: IconDeviceDesktop,
    },
  ],
  firebase: [
    {
      id: 'firebase-auth',
      label: 'Firebase Auth',
      type: 'firebase',
      icon: IconAuth2fa,
    },
    {
      id: 'firebase-firestore',
      label: 'Firestore',
      type: 'firebase',
      icon: IconDatabase,
    },
    {
      id: 'firebase-storage',
      label: 'Firebase Storage',
      type: 'firebase',
      icon: IconFileDatabase,
    },
    {
      id: 'firebase-functions',
      label: 'Cloud Functions',
      type: 'firebase',
      icon: IconServerBolt,
    },
    {
      id: 'firebase-messaging',
      label: 'Cloud Messaging',
      type: 'firebase',
      icon: IconCloudNetwork,
    },
  ],
  aws: [
    { id: 'aws-ec2', label: 'EC2', type: 'aws', icon: IconServer },
    { id: 'aws-cognito', label: 'Cognito', type: 'aws', icon: IconAuth2fa },
    { id: 'aws-s3', label: 'S3', type: 'aws', icon: IconFileDatabase },
    { id: 'aws-rds', label: 'RDS', type: 'aws', icon: IconDatabase },
    { id: 'aws-lambda', label: 'Lambda', type: 'aws', icon: IconServerBolt },
    {
      id: 'aws-cloudfront',
      label: 'CloudFront',
      type: 'aws',
      icon: IconCloudNetwork,
    },
  ],
  googleCloud: [
    {
      id: 'gcp-compute',
      label: 'Compute Engine',
      type: 'googleCloud',
      icon: IconServer,
    },
    {
      id: 'gcp-storage',
      label: 'Cloud Storage',
      type: 'googleCloud',
      icon: IconFileDatabase,
    },
    {
      id: 'gcp-sql',
      label: 'Cloud SQL',
      type: 'googleCloud',
      icon: IconDatabase,
    },
    {
      id: 'gcp-functions',
      label: 'Cloud Functions',
      type: 'googleCloud',
      icon: IconServerBolt,
    },
    {
      id: 'gcp-pubsub',
      label: 'Pub/Sub',
      type: 'googleCloud',
      icon: IconCloudNetwork,
    },
  ],
  azure: [
    {
      id: 'azure-vm',
      label: 'Virtual Machines',
      type: 'azure',
      icon: IconServer,
    },
    {
      id: 'azure-blob',
      label: 'Blob Storage',
      type: 'azure',
      icon: IconFileDatabase,
    },
    {
      id: 'azure-sql',
      label: 'SQL Database',
      type: 'azure',
      icon: IconDatabase,
    },
    {
      id: 'azure-functions',
      label: 'Azure Functions',
      type: 'azure',
      icon: IconServerBolt,
    },
    { id: 'azure-cdn', label: 'CDN', type: 'azure', icon: IconCloudNetwork },
  ],
}

// arcTypes.ts
export const ArcTypes = {
  synchronous: {
    label: 'Synchronous',
    style: { stroke: 'blue', strokeWidth: 2 },
  },
  asynchronous: {
    label: 'Asynchronous',
    style: { stroke: 'green', strokeDasharray: '5,5', strokeWidth: 2 },
  },
}

export function LibraryPanel({
  onAddNode,
}: {
  onAddNode: (node: any) => void
}) {
  return (
    <div className='p-3 w-full overflow-y-auto no-scrollbar' style={{ height: '50vh'}}>
      {Object.entries(UMLComponents).map(([category, components]) => (
        <div key={category} className='my-2'>
          <h4 className='text-xs uppercase opacity-50'>{category}</h4>
          {components.map((component) => (
            <Button
              key={component.id}
              variant='outline'
              className='cursor-hand block w-full text-left my-2'
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  'application/reactflow',
                  JSON.stringify(component)
                )
                e.dataTransfer.effectAllowed = 'move'
              }}
            >
              {(component.icon && <component.icon className='mr-2 inline' />) ||
                null}
              {component.label}
            </Button>
          ))}
        </div>
      ))}
    </div>
  )
}
