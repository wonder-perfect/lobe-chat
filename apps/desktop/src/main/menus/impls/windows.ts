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
    const t = this.app.i18n.ns('menu');

    const template: MenuItemConstructorOptions[] = [
      {
        label: t('file.title'),
        submenu: [
          {
            click: () => this.app.browserManager.retrieveByIdentifier('settings').show(),
            label: t('file.preferences'),
          },
          { type: 'separator' },
          { label: t('file.quit'), role: 'quit' },
        ],
      },
      {
        label: t('edit.title'),
        submenu: [
          { accelerator: 'Ctrl+Z', label: t('edit.undo'), role: 'undo' },
          { accelerator: 'Ctrl+Y', label: t('edit.redo'), role: 'redo' },
          { type: 'separator' },
          { accelerator: 'Ctrl+X', label: t('edit.cut'), role: 'cut' },
          { accelerator: 'Ctrl+C', label: t('edit.copy'), role: 'copy' },
          { accelerator: 'Ctrl+V', label: t('edit.paste'), role: 'paste' },
          { type: 'separator' },
          { accelerator: 'Ctrl+A', label: t('edit.selectAll'), role: 'selectAll' },
        ],
      },
      {
        label: t('view.title'),
        submenu: [
          { accelerator: 'Ctrl+0', label: t('view.resetZoom'), role: 'resetZoom' },
          { accelerator: 'Ctrl+Plus', label: t('view.zoomIn'), role: 'zoomIn' },
          { accelerator: 'Ctrl+-', label: t('view.zoomOut'), role: 'zoomOut' },
          { type: 'separator' },
          { accelerator: 'F11', label: t('view.toggleFullscreen'), role: 'togglefullscreen' },
        ],
      },
      {
        label: t('window.title'),
        submenu: [
          { label: t('window.minimize'), role: 'minimize' },
          { label: t('window.close'), role: 'close' },
        ],
      },
      {
        label: t('help.title'),
        submenu: [
          {
            click: async () => {
              const { shell } = require('electron');
              await shell.openExternal('https://lobe.chat');
            },
            label: t('help.visitWebsite'),
          },
          {
            click: async () => {
              const { shell } = require('electron');
              await shell.openExternal('https://github.com/lobehub/lobe-chat');
            },
            label: t('help.githubRepo'),
          },
        ],
      },
    ];

    if (showDev) {
      template.push({
        label: t('dev.title'),
        submenu: [
          { accelerator: 'Ctrl+R', label: t('dev.reload'), role: 'reload' },
          { accelerator: 'Ctrl+Shift+R', label: t('dev.forceReload'), role: 'forceReload' },
          { accelerator: 'Ctrl+Shift+I', label: t('dev.devTools'), role: 'toggleDevTools' },
          { type: 'separator' },
          {
            click: () => {
              this.app.browserManager.retrieveByIdentifier('devtools').show();
            },
            label: t('dev.devPanel'),
          },
        ],
      });
    }

    return template;
  }

  private getDefaultContextMenuTemplate(): MenuItemConstructorOptions[] {
    const t = this.app.i18n.ns('menu');

    return [
      { label: t('edit.cut'), role: 'cut' },
      { label: t('edit.copy'), role: 'copy' },
      { label: t('edit.paste'), role: 'paste' },
      { type: 'separator' },
      { label: t('edit.selectAll'), role: 'selectAll' },
    ];
  }

  private getChatContextMenuTemplate(data?: any): MenuItemConstructorOptions[] {
    const t = this.app.i18n.ns('menu');
    const commonT = this.app.i18n.ns('common');

    const items: MenuItemConstructorOptions[] = [
      { label: t('edit.copy'), role: 'copy' },
      { label: t('edit.paste'), role: 'paste' },
      { type: 'separator' },
      { label: t('edit.selectAll'), role: 'selectAll' },
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
          label: commonT('actions.delete'),
        },
      );
    }

    return items;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private getEditorContextMenuTemplate(_data?: any): MenuItemConstructorOptions[] {
    const t = this.app.i18n.ns('menu');

    return [
      { label: t('edit.cut'), role: 'cut' },
      { label: t('edit.copy'), role: 'copy' },
      { label: t('edit.paste'), role: 'paste' },
      { type: 'separator' },
      { label: t('edit.undo'), role: 'undo' },
      { label: t('edit.redo'), role: 'redo' },
      { type: 'separator' },
      { label: t('edit.selectAll'), role: 'selectAll' },
    ];
  }

  private getTrayMenuTemplate(): MenuItemConstructorOptions[] {
    const t = this.app.i18n.ns('menu');
    const appName = app.getName();

    return [
      {
        click: () => this.app.browserManager.showMainWindow(),
        label: t('tray.open', { appName }),
      },
      { type: 'separator' },
      {
        click: () => this.app.browserManager.retrieveByIdentifier('settings').show(),
        label: t('file.preferences'),
      },
      { type: 'separator' },
      { label: t('tray.quit'), role: 'quit' },
    ];
  }
}
