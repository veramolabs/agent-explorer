import React, { useState } from 'react'
import { Button, Input, List, Space, Switch, App, Drawer, Typography, Popover } from 'antd'
import { DeleteOutlined, MenuOutlined, PlusOutlined} from '@ant-design/icons'
import { usePlugins } from '@veramo-community/agent-explorer-plugin'
import { PageContainer } from '@ant-design/pro-components'
import { DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
 } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { IAgentExplorerPlugin } from '@veramo-community/agent-explorer-plugin'
import { communityPlugins } from '../../plugins/community'
import { ResponsiveContainer } from '../../components/ResponsiveContainer'

const SortableItem = ({ item }: { item: IAgentExplorerPlugin}) => {
  const { notification } = App.useApp()
  const { removePluginConfig, switchPlugin } = usePlugins()
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.config?.url || '' });
  const actions: React.ReactNode[] = []
  if (!item.config?.url.startsWith('core://')) {
    actions.push(<Button
      icon={<DeleteOutlined />}
      danger
      type="text"
      onClick={() => {
        if (window.confirm(`Delete ${item.name}`)) {
          removePluginConfig(item.config?.url || '')
          notification.success({
            message: 'Plugin removed',
          })
        }
      }}
    />)
  }

  actions.push(<Switch checked={item.config?.enabled} onChange={(checked) => switchPlugin(item.config?.url || '', checked)} />)
  actions.push(<MenuOutlined ref={setNodeRef} {...attributes} {...listeners} className="draggable-item"/>)
  return (
    <List.Item 
      ref={setNodeRef} 
      style={{ transform: CSS.Transform.toString(transform), transition }}
      actions={actions}
    ><List.Item.Meta
    avatar={<Typography.Text style={{fontSize: 26}}>{item.icon}</Typography.Text>}
    title={item.name}
    description={<Popover content={`${item.config?.url}${item.config?.commitId  ? ` @  ${item.config?.commitId}` : ''}`}>{item.description}</Popover>}

  />
  </List.Item>
  );
};

export const Plugins = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { addPluginConfig, plugins, updatePluginConfigs } = usePlugins()
  const [url, setUrl] = React.useState('')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
  
    if (active.id !== over.id) {
      const activeIndex = plugins.findIndex((plugin) => plugin.config?.url === active.id);
      const overIndex = plugins.findIndex((plugin) => plugin.config?.url === over.id);
  
      if (activeIndex !== -1 && overIndex !== -1) {
        const reorderedPlugins = [...plugins];
        [reorderedPlugins[activeIndex], reorderedPlugins[overIndex]] = [reorderedPlugins[overIndex], reorderedPlugins[activeIndex]];
  
        updatePluginConfigs(reorderedPlugins.map((plugin) => plugin.config || {url: '', enabled: true}));
      }
    }
  };

  
  
  return (
    <DndContext 
      onDragEnd={handleDragEnd} 
      sensors={sensors}
      collisionDetection={closestCenter}
    >
      <PageContainer
        extra={[
          <Button
            key={'add'}
            icon={<PlusOutlined />}
            type="primary"
            title="Add new external plugin"
            onClick={() => setDrawerOpen(true)}
          >Add</Button>,
        ]}
      >
        <ResponsiveContainer>

        <SortableContext 
          items={plugins.map((plugin) => plugin.config?.url || '')} 
          strategy={verticalListSortingStrategy}
          >
          <List
            dataSource={plugins}
            renderItem={(item) => <SortableItem item={item} key={item.config?.url}/>}
          />
        </SortableContext>
        <DragOverlay />
        </ResponsiveContainer>
        <Drawer
          title="Add external plugin"
          placement={'right'}
          width={500}
          onClose={() => setDrawerOpen(false)}
          open={isDrawerOpen}
        > 
          <Space direction='vertical' style={{width: '100%'}}>
            <Typography.Title level={5}>Community plugins</Typography.Title>
              <List
                dataSource={communityPlugins}
                renderItem={(item) => <List.Item 
                    actions={[
                      <Button 
                      type="primary"
                      disabled={plugins.find((plugin) => plugin.config?.url === item.config?.url) !== undefined}
                      onClick={() => {
                        setDrawerOpen(false)
                        addPluginConfig({url: item.config?.url || '', enabled: true, commitId: item.config?.commitId})
                        setUrl('')
                      }}
                      >Add</Button>
                    ]}
                    ><List.Item.Meta
                    title={item.name}
                    description={<Popover content={`${item.config?.url}${item.config?.commitId  && ` @  ${item.config?.commitId}`}`}>{item.description}</Popover>}
                />
              </List.Item>}
              />
            <Typography.Title level={5}>Custom plugin</Typography.Title>            
            <Space.Compact style={{ width: '100%' }}>
              <Input 
                value={url} 
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/plugin.js"
                />
              <Button 
                type="primary"
                onClick={() => {
                  setDrawerOpen(false)
                  addPluginConfig({url, enabled: true})
                  setUrl('')
                }}
                >Add</Button>
            </Space.Compact>
          </Space>       
        </Drawer>
      </PageContainer>
    </DndContext>
  )
}

