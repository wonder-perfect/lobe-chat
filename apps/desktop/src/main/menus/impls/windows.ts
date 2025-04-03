import { Menu, MenuItemConstructorOptions, app } from 'electron';

import { isDev } from '@/const/env';

import type { IMenuPlatform, MenuOptions } from '../types';
import { BaseMenuPlatform } from './BaseMenuPlatform';

export class WindowsMenu extends BaseMenuPlatform implements IMenuPlatform {
  private appMenu: Menu | null = null;
  private trayMenu: Menu | null = null;

  buildAndSetAppMenu(options?: MenuOptions): Menu {
    const template = this.getAppMenuTemplate(options);
    this.appMenu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(this.appMenu);
    return this.appMenu;
  }

  buildContextMenu(type: string, data?: any): Menu {
    let template: MenuItemConstructorOptions[];
    switch (type) {
      case 'chat': {
        template = this.getChatContextMenuTemplate(data);
        break;
      }
      case 'editor': {
        template = this.getEditorContextMenuTemplate(data);
        break;
      }
      default: {
        template = this.getDefaultContextMenuTemplate();
      }
    }
    return Menu.buildFromTemplate(template);
  }

  buildTrayMenu(): Menu {
    const template = this.getTrayMenuTemplate();
    this.trayMenu = Menu.buildFromTemplate(template);
    return this.trayMenu;
  }

  refresh(options?: MenuOptions): void {
    this.buildAndSetAppMenu(options);
    // 如果有必要更新托盘菜单，可以在这里添加逻辑
  }

  private getAppMenuTemplate(options?: MenuOptions): MenuItemConstructorOptions[] {
    const showDev = isDev || options?.showDevItems;
    const template: MenuItemConstructorOptions[] = [
      {
        label: '文件',
        submenu: [
          {
            click: () => this.app.browserManager.retrieveByIdentifier('settings').show(),
            label: '设置',
          },
          { type: 'separator' },
          { label: '退出', role: 'quit' },
        ],
      },
      {
        label: '编辑',
        submenu: [
          { accelerator: 'Ctrl+Z', label: '撤销', role: 'undo' },
          { accelerator: 'Ctrl+Y', label: '重做', role: 'redo' },
          { type: 'separator' },
          { accelerator: 'Ctrl+X', label: '剪切', role: 'cut' },
          { accelerator: 'Ctrl+C', label: '复制', role: 'copy' },
          { accelerator: 'Ctrl+V', label: '粘贴', role: 'paste' },
          { type: 'separator' },
          { accelerator: 'Ctrl+A', label: '全选', role: 'selectAll' },
        ],
      },
      {
        label: '视图',
        submenu: [
          { accelerator: 'Ctrl+0', label: '重置缩放', role: 'resetZoom' },
          { accelerator: 'Ctrl+Plus', label: '放大', role: 'zoomIn' },
          { accelerator: 'Ctrl+-', label: '缩小', role: 'zoomOut' },
          { type: 'separator' },
          { accelerator: 'F11', label: '切换全屏', role: 'togglefullscreen' },
        ],
      },
      {
        label: '窗口',
        submenu: [
          { label: '最小化', role: 'minimize' },
          { label: '关闭', role: 'close' },
        ],
      },
      {
        label: '帮助',
        submenu: [
          {
            click: async () => {
              const { shell } = require('electron');
              await shell.openExternal('https://lobe.chat');
            },
            label: '访问官网',
          },
          {
            click: async () => {
              const { shell } = require('electron');
              await shell.openExternal('https://github.com/lobehub/lobe-chat');
            },
            label: 'GitHub 仓库',
          },
        ],
      },
    ];

    if (showDev) {
      template.push({
        label: '开发',
        submenu: [
          { accelerator: 'Ctrl+R', label: '重新加载', role: 'reload' },
          { accelerator: 'Ctrl+Shift+R', label: '强制重新加载', role: 'forceReload' },
          { accelerator: 'Ctrl+Shift+I', label: '开发者工具', role: 'toggleDevTools' },
          { type: 'separator' },
          {
            click: () => {
              this.app.browserManager.retrieveByIdentifier('devtools').show();
            },
            label: '开发者面板',
          },
        ],
      });
    }

    return template;
  }

  private getDefaultContextMenuTemplate(): MenuItemConstructorOptions[] {
    return [
      { label: '剪切', role: 'cut' },
      { label: '复制', role: 'copy' },
      { label: '粘贴', role: 'paste' },
      { type: 'separator' },
      { label: '全选', role: 'selectAll' },
    ];
  }

  private getChatContextMenuTemplate(data?: any): MenuItemConstructorOptions[] {
    const items: MenuItemConstructorOptions[] = [
      { label: '复制', role: 'copy' },
      { label: '粘贴', role: 'paste' },
      { type: 'separator' },
      { label: '全选', role: 'selectAll' },
    ];

    if (data?.messageId) {
      items.push(
        { type: 'separator' },
        {
          click: () => {
            console.log('尝试删除消息:', data.messageId);
            // 调用 MessageService (假设存在)
            // const messageService = this.app.getService(MessageService);
            // messageService?.deleteMessage(data.messageId);
          },
          label: '删除消息',
        },
      );
    }

    return items;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private getEditorContextMenuTemplate(_data?: any): MenuItemConstructorOptions[] {
    return [
      { label: '剪切', role: 'cut' },
      { label: '复制', role: 'copy' },
      { label: '粘贴', role: 'paste' },
      { type: 'separator' },
      { label: '撤销', role: 'undo' },
      { label: '重做', role: 'redo' },
      { type: 'separator' },
      { label: '全选', role: 'selectAll' },
    ];
  }

  private getTrayMenuTemplate(): MenuItemConstructorOptions[] {
    const appName = app.getName();
    return [
      {
        click: () => this.app.browserManager.showMainWindow(),
        label: `打开 ${appName}`,
      },
      { type: 'separator' },
      {
        click: () => this.app.browserManager.retrieveByIdentifier('settings').show(),
        label: '设置',
      },
      { type: 'separator' },
      { label: '退出', role: 'quit' },
    ];
  }
}
