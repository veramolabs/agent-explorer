import React from 'react'
import { createRoot } from 'react-dom/client'
import * as ReactDOMServer from 'react-dom/server';
import App from './layout/App'
import reportWebVitals from './reportWebVitals'
import * as antd from 'antd'
import * as antdPro from '@ant-design/pro-components';
import * as reactquery from 'react-query';
import * as veramoreact from '@veramo-community/veramo-react'
import * as agentexplorerplugin from '@veramo-community/agent-explorer-plugin'
import * as reactrouterdom from 'react-router-dom'
import * as uuid from 'uuid'
import * as datefns from 'date-fns'
import * as reactjsxruntime from 'react/jsx-runtime'
import './style.css'
// Global variables for plugins
declare global {
  interface Window {
    antd: any
    antdPro: any
    reactquery: any
    veramoreact: any
    agentexplorerplugin: any
    reactrouterdom: any
    uuid: any
    datefns: any
    reactjsxruntime: any
    ReactDOMServer: any
  }
}
window.React = React
window.antd = antd
window.antdPro = antdPro
window.reactquery = reactquery
window.veramoreact = veramoreact
window.agentexplorerplugin = agentexplorerplugin
window.reactrouterdom = reactrouterdom
window.uuid = uuid
window.datefns = datefns
window.reactjsxruntime = reactjsxruntime
window.ReactDOMServer = ReactDOMServer

const container = document.getElementById('app')
const root = createRoot(container!) // createRoot(container!) if you use TypeScript
root.render(<App />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
