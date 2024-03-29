import React from 'react'
import { Typography, Space } from 'antd'
import packageJson from '../../../package.json'
import { PageContainer } from '@ant-design/pro-components'
import { ResponsiveContainer } from '../../components/ResponsiveContainer'

export const Version: React.FC<{
  versionOnly?: boolean
}> = ({ versionOnly }) => (
  <PageContainer>
    <ResponsiveContainer>
      <Space direction="vertical">
        <Typography.Text>v{packageJson.version}</Typography.Text>
        {!versionOnly && (
          <Typography.Text>
            <b>License:</b> {packageJson.license}
          </Typography.Text>
        )}
      </Space>
    </ResponsiveContainer>
  </PageContainer>
)

