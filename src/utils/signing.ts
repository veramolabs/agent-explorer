import { TAgent } from '@veramo/core'
import { ICredentialIssuer } from '@veramo/credential-w3c'

const shortId = (did: string) => `${did.slice(0, 15)}...${did.slice(-4)}`

const claimToObject = (arr: any[]) => {
  return arr.reduce(
    (obj, item) => Object.assign(obj, { [item.type]: item.value }),
    {},
  )
}

const issueCredential = async (
  agent: any,
  iss: string | undefined,
  sub: string | undefined,
  claims: any[],
) => {
  return await agent?.createVerifiableCredential({
    credential: {
      issuer: { id: iss },
      issuanceDate: new Date().toISOString(),
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential'],
      credentialSubject: { id: sub, ...claimToObject(claims) },
    },
    proofFormat: 'jwt',
    save: true,
  })
}

const signVerifiablePresentation = async (
  agent: any,
  did: string,
  verifier: string[],
  selected: any,
) => {
  const selectedCredentials = Object.keys(selected)
    .map((key) => selected[key].jwt)
    .filter((item) => item)

  return await agent?.createVerifiablePresentation({
    presentation: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiablePresentation'],
      verifiableCredential: selectedCredentials,
      issuanceDate: new Date().toISOString(),
      holder: did,
      verifier,
    },
    proofFormat: 'jwt',
    save: true,
  })
}

export { claimToObject, shortId, issueCredential, signVerifiablePresentation }
