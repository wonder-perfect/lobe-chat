import { Menu, MenuItemConstructorOptions, app } from 'electron';

import { isDev } from '@/const/env';

import type { IMenuPlatform, MenuOptions } from '../types';
import { BaseMenuPlatform } from './BaseMenuPlatform';

export class MacOSMenu extends BaseMenuPlatform implements IMenuPlatform {
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
    // 重建应用菜单
    this.buildAndSetAppMenu(options);
    // 如果托盘菜单存在，也重建它（如果需要动态更新）
    // this.trayMenu = this.buildTrayMenu();
    // 需要考虑如何更新现有托盘图标的菜单
  }

  // --- 私有方法：定义菜单模板和逻辑 ---

  private getAppMenuTemplate(options?: MenuOptions): MenuItemConstructorOptions[] {
    const appName = app.getName();
    const showDev = isDev || options?.showDevItems;

    const template: MenuItemConstructorOptions[] = [
      {
        label: appName,
        submenu: [
          { label: `关于 ${appName}`, role: 'about' },
          { type: 'separator' },
          {
            accelerator: 'Command+,',
            click: () => {
              this.app.browserManager.showSettingsWindow();
            },
            label: '偏好设置...',
          },
          { type: 'separator' },
          { label: '服务', role: 'services', submenu: [] },
          { type: 'separator' },
          { accelerator: 'Command+H', label: `隐藏 ${appName}`, role: 'hide' },
          { accelerator: 'Command+Alt+H', label: '隐藏其他', role: 'hideOthers' },
          { label: '全部显示', role: 'unhide' },
          { type: 'separator' },
          { accelerator: 'Command+Q', label: '退出', role: 'quit' },
        ],
      },
      {
        label: '编辑',
        submenu: [
          { accelerator: 'Command+Z', label: '撤销', role: 'undo' },
          { accelerator: 'Shift+Command+Z', label: '重做', role: 'redo' },
          { type: 'separator' },
          { accelerator: 'Command+X', label: '剪切', role: 'cut' },
          { accelerator: 'Command+C', label: '复制', role: 'copy' },
          { accelerator: 'Command+V', label: '粘贴', role: 'paste' },
          { accelerator: 'Command+A', label: '全选', role: 'selectAll' },
        ],
      },
    ];

    if (showDev) {
      template.push({
        label: '开发',
        submenu: [
          { accelerator: 'Command+R', label: '重新加载', role: 'reload' },
          { accelerator: 'Shift+Command+R', label: '强制重新加载', role: 'forceReload' },
          { accelerator: 'F12', label: '开发者工具', role: 'toggleDevTools' },
          { type: 'separator' },
          {
            click: () => {
              this.app.browserManager.retrieveByIdentifier('devtools').show();
            },
            label: 'LobeHub 开发者工具',
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
    ];
  }

  private getChatContextMenuTemplate(data?: any): MenuItemConstructorOptions[] {
    const items: MenuItemConstructorOptions[] = [
      { label: '复制', role: 'copy' },
      // ... 其他通用项
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
    // 编辑器特定的上下文菜单
    return [
      { label: '剪切', role: 'cut' },
      { label: '复制', role: 'copy' },
      { label: '粘贴', role: 'paste' },
      // ...
    ];
  }

  private getTrayMenuTemplate(): MenuItemConstructorOptions[] {
    const appName = app.getName();
    return [
      {
        click: () => this.app.browserManager.showMainWindow(),
        label: `显示 ${appName}`,
      },
      {
        click: () => this.app.browserManager.retrieveByIdentifier('settings').show(),
        label: '设置',
      },
      { type: 'separator' },
      { label: '退出', role: 'quit' },
    ];
  }
}
