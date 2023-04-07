import React from 'react'
import { Typography, Table, Tag, Layout } from 'antd'
import Page from '../layout/Page'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'

const { Title } = Typography

const columns = [
  // {
  //   title: 'Explore',
  //   dataIndex: 'hash',
  //   render: (hash: any) => (
  //     <Button
  //       icon={
  //         <Link to={'/credential/' + hash}>
  //           <FundViewOutlined />
  //         </Link>
  //       }
  //     />
  //   ),
  //   width: 100,
  // },
  {
    title: 'Issuer',
    dataIndex: 'verifiableCredential',
    render: (verifiableCredential: any) => verifiableCredential.issuer.id,
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: 'Subject',
    dataIndex: 'verifiableCredential',
    render: (verifiableCredential: any) =>
      verifiableCredential.credentialSubject.id,
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: 'Proof Type',
    dataIndex: 'verifiableCredential',
    render: (verifiableCredential: any) => (
      <Tag>{verifiableCredential.proof.type}</Tag>
    ),
    responsive: ['xl'],
    width: 200,
  },
  {
    title: 'Type',
    dataIndex: 'verifiableCredential',
    render: (verifiableCredential: any) =>
      verifiableCredential.type.map((type: string, i: number) => (
        <Tag color="geekblue" key={i}>
          {type}
        </Tag>
      )),
    responsive: ['lg'],
    width: 200,
  },
  {
    title: 'Issuance Date',
    dataIndex: 'verifiableCredential',
    render: (verifiableCredential: any) =>
      format(new Date(verifiableCredential.issuanceDate), 'PPP'),
    responsive: ['lg'],
    width: 200,
  },
]

const Credentials = () => {
  const navigate = useNavigate()
  const { agent } = useVeramo()
  const { data: credentials, isLoading } = useQuery(
    ['credentials', { agentId: agent?.context.name }],
    () => agent?.dataStoreORMGetVerifiableCredentials(),
  )

  return (
    <Layout style={{ marginLeft: 24, marginRight: 24 }}>
      <Title>Credentials</Title>
      <Table
        loading={isLoading}
        rowKey={(record) => record.hash}
        onRow={(record, rowIndex) => {
          return {
            onClick: (e) => navigate('/credential/' + record.hash),
          }
        }}
        dataSource={credentials}
        // bordered
        // @ts-ignore
        columns={columns}
      />
    </Layout>
  )
}

export default Credentials
