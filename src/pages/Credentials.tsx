import React from 'react'
import { Typography, Table, Tag, Button, Tooltip } from 'antd'
import Page from '../layout/Page'
import credentials from '../stubbs/credentials'
import { format } from 'date-fns'
import { FundViewOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const { Title } = Typography

const columns = [
  {
    title: 'Issuance Date',
    dataIndex: 'verifiableCredential',
    render: (verifiableCredential: any) =>
      format(new Date(verifiableCredential.issuanceDate), 'PPP'),
    responsive: ['lg'],
    width: 200,
  },
  {
    title: 'Issuer',
    dataIndex: 'verifiableCredential',
    render: (verifiableCredential: any) => (
      <Tooltip placement="topLeft" title={verifiableCredential.issuer.id}>
        <Link to={'/identifiers/' + verifiableCredential.issuer.id}>
          {verifiableCredential.issuer.id}
        </Link>
      </Tooltip>
    ),
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: 'Subject',
    dataIndex: 'verifiableCredential',
    render: (verifiableCredential: any) => (
      <Tooltip
        placement="topLeft"
        title={verifiableCredential.credentialSubject.id}
      >
        <Link to={'/identifiers/' + verifiableCredential.credentialSubject.id}>
          {verifiableCredential.credentialSubject.id}
        </Link>
      </Tooltip>
    ),
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: 'Type',
    dataIndex: 'verifiableCredential',
    render: (verifiableCredential: any) =>
      verifiableCredential.type.map((type: string, i: number) => (
        <Tag key={i}>{type}</Tag>
      )),
    responsive: ['lg'],
    width: 200,
  },
  {
    title: 'Proof Type',
    dataIndex: 'verifiableCredential',
    render: (verifiableCredential: any) => verifiableCredential.proof.type,
    responsive: ['xl'],
    width: 200,
  },
  {
    title: 'Explore',
    dataIndex: 'hash',
    render: (hash: any) => (
      <Button
        icon={
          <Link to={'/credentials/' + hash}>
            <FundViewOutlined />
          </Link>
        }
      />
    ),
    width: 100,
  },
]

const Credentials = () => {
  return (
    <Page header={<Title style={{ fontWeight: 'bold' }}>Credentials</Title>}>
      <Table
        rowKey={(record) => record.hash}
        dataSource={credentials}
        // bordered
        // @ts-ignore
        columns={columns}
      />
    </Page>
  )
}

export default Credentials
