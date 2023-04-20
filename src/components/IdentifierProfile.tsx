import React from 'react'
import { Row, Avatar, Col, Typography, theme, Skeleton } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { IIdentifierProfilePlugin } from '../context/plugins/IdentifierProfile'
import { shortId } from '../utils/did'

interface IdentifierProfileProps {
  did: string
}

const IdentifierProfile: React.FC<IdentifierProfileProps> = ({ did }) => {
  const { agent } = useVeramo<IIdentifierProfilePlugin>()
  const { token } = theme.useToken()

  const { data, isLoading } = useQuery(
    ['profile', did, agent?.context.id],
    () => agent?.getIdentifierProfile({ did }),
  )

  return (
    <Row>
      <Col style={{ marginRight: token.margin }}>
        {!isLoading && <Avatar src={data?.picture} />}
        {isLoading && <Skeleton.Avatar active />}
      </Col>
      <Col>
        <div>
          {!isLoading && <Typography.Text>{data?.name}</Typography.Text>}
          {isLoading && <Skeleton.Input style={{ width: 100 }} active />}
        </div>
        {data?.name && data?.name !== shortId(did) && (
          <div>
            <Typography.Text style={{ color: token.colorTextSecondary }}>
              {shortId(did)}
            </Typography.Text>
          </div>
        )}
      </Col>
    </Row>
  )
}

export default IdentifierProfile
