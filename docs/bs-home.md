# Home

The Veramo [Agent Explorer](./Agent%20explorer.md) provides a UI for interacting with Veramo agents and other Decentralized Identifiers (DIDs) and W3C Verifiable Credential tech.

[Demo](https://agent-explorer.s3.amazonaws.com/videos/discovery.mp4?!#title=Demo)


## Agents

A Veramo agent can run in the cloud for "always on" capabilities or run locally within a browser instance, using either temporary DIDs or importing them from a web3 wallet like Metamask.


## Agent Explorer Plugins

Just as Veramo agents themselves are modular and support many combinations of different plugins to bring new functionality, the Agent Explorer also has the concept of "plugins". There are many "standard" plugins for managing DIDs, issuing credentials, and sending messages. Of course, it's also possible to create custom plugins to give the UI new functionality. A few examples are listed below:

* Gitcoin Passport Plugin (available on [https://github.com/veramolabs/agent-explorer-plugin-gitcoin-passport](https://github.com/veramolabs/agent-explorer-plugin-gitcoin-passport)): This plugin allows you to easily import Gitcoin Passport stamps associated with an Ethereum address and displays them alongside Verifiable Credentials to add contextual reputation.
* BrainShare Plugin (available on [https://github.com/veramolabs/agent-explorer-plugin-brainshare/](https://github.com/veramolabs/agent-explorer-plugin-brainshare/)): This plugin allows you to compose, post, and view posts associated with the [[did:web:staging.community.veramo.io/QmRHKDAHsFyVEUBhkSFYTZVjfDnzocUwLwcqgkG2q3YBRB|BrainShare]] protocol.