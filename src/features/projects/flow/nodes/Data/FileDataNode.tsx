import { memo, useEffect, useState } from 'react'
import { Handle, Node, NodeProps, Position, useReactFlow } from '@xyflow/react'
import { DataNodeProps } from '../../../../../lib/publicTypes'
import { IconGripVertical } from '@tabler/icons-react'
import { Separator } from '@radix-ui/react-separator'
import { Input } from '../../../../../components/ui/input'
import {convertXML} from 'simple-xml-to-json'
import { TopHandle } from '../TopHandle'

/* function xmlToJson(xml) {
  if (xml.nodeType === 1) {
    const obj: any = {};
    if (xml.attributes.length > 0) {
      for (let j = 0; j < xml.attributes.length; j++) {
        const attribute = xml.attributes.item(j);
        obj[attribute.nodeName] = attribute.nodeValue;
      }
    }
    if (xml.childNodes.length > 0) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes.item(i);
        const nodeName = item.nodeName;
        if (typeof obj[nodeName] === 'undefined') {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof obj[nodeName].push === 'undefined') {
            const old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    return obj;
  } else if (xml.nodeType === 3) {
    return xml.nodeValue;
  }
} */

function FileDataNode({
  id,
  data
}: NodeProps<Node<DataNodeProps>>) {
  const { updateNodeData } = useReactFlow()
  const [file, setFile] = useState<File | null>(null)
  const [fileContent, setFileContent] = useState<string | null>(null)

  useEffect(() => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setFileContent(content)
        let output;
        if (file.type === 'application/json') {
          output = JSON.parse(content);
        } else if (file.type === 'text/csv') {
          const lines = content.split('\n');
          const headers = lines[0].split(',');
          output = lines.slice(1).map(line => {
            const values = line.split(',');
            return headers.reduce((obj: any, header, index) => {
              obj[header] = values[index];
              return obj;
            }, {});
          });
        } else if (file.type === 'application/xml' || file.type === 'text/xml') {
          output = convertXML(content);
        } else {
          output = content;
        }
        updateNodeData(id, { output })
      }
      reader.readAsText(file)
    }
  }, [file])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
  }

  return (
    <div><TopHandle name='File Data Collector' />
      <div className='flex flex-col gap-3'>
        <Input
          type='file'
          accept='.csv, .json, .xml, .geojson'
          onChange={handleFileChange}
          className='input'
        />
      </div>
      <Handle type='source' className='custom-handle' position={Position.Right} />
    </div>
  )
}

export default memo(FileDataNode)