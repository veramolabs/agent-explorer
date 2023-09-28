import React from 'react';
import { UserOutlined } from '@ant-design/icons'
import { IPlugin } from '@veramo-community/agent-explorer-plugin';

import { ManagedIdentifiers } from './ManagedIdentifiers';
import Identifier from './Identifier';

const Plugin: IPlugin = {
    init: () => {
        return {
          config: {
            enabled: true,
            url: 'core://identifiers',
          },
          name: 'Identifiers',
          description: 'Manage identifiers',
          requiredMethods: ['didManagerFind'],
          routes: [
            {
              path: '/identifiers',
              element: <ManagedIdentifiers />,
            },
            {
              path: '/identifiers/:id',
              element: <Identifier />,
            },
          ],
          menuItems: [
            {
              name: 'Identifiers',
              path: '/identifiers',
              icon: <UserOutlined />,
            },
          ],
          
        }
    }
};

export default Plugin;