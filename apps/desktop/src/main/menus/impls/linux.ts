import { Menu, MenuItemConstructorOptions, app } from 'electron';

import { isDev } from '@/const/env';

import type { IMenuPlatform, MenuOptions } from '../types';
import { BaseMenuPlatform } from './BaseMenuPlatform';

export class LinuxMenu extends BaseMenuPlatform implements IMenuPlatform {
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
  }

  // --- 私有方法：定义菜单模板和逻辑 ---

  private getAppMenuTemplate(options?: MenuOptions): MenuItemConstructorOptions[] {
    const showDev = isDev || options?.showDevItems;
    const { t } = this.app.i18n;

    const template: MenuItemConstructorOptions[] = [
      {
        label: t('menu.file.title'),
        submenu: [
          {
            click: () => this.app.browserManager.retrieveByIdentifier('settings').show(),
            label: t('menu.file.preferences'),
          },
          { type: 'separator' },
          { label: t('menu.file.quit'), role: 'quit' },
        ],
      },
      {
        label: t('menu.edit.title'),
        submenu: [
          { accelerator: 'Ctrl+Z', label: t('menu.edit.undo'), role: 'undo' },
          { accelerator: 'Ctrl+Shift+Z', label: t('menu.edit.redo'), role: 'redo' },
          { type: 'separator' },
          { accelerator: 'Ctrl+X', label: t('menu.edit.cut'), role: 'cut' },
          { accelerator: 'Ctrl+C', label: t('menu.edit.copy'), role: 'copy' },
          { accelerator: 'Ctrl+V', label: t('menu.edit.paste'), role: 'paste' },
          { type: 'separator' },
          { accelerator: 'Ctrl+A', label: t('menu.edit.selectAll'), role: 'selectAll' },
        ],
      },
      {
        label: t('menu.view.title'),
        submenu: [
          { accelerator: 'Ctrl+0', label: t('menu.view.resetZoom'), role: 'resetZoom' },
          { accelerator: 'Ctrl+Plus', label: t('menu.view.zoomIn'), role: 'zoomIn' },
          { accelerator: 'Ctrl+-', label: t('menu.view.zoomOut'), role: 'zoomOut' },
          { type: 'separator' },
          { accelerator: 'F11', label: t('menu.view.toggleFullscreen'), role: 'togglefullscreen' },
        ],
      },
      {
        label: t('menu.window.title'),
        submenu: [
          { label: t('menu.window.minimize'), role: 'minimize' },
          { label: t('menu.window.close'), role: 'close' },
        ],
      },
      {
        label: t('menu.help.title'),
        submenu: [
          {
            click: async () => {
              const { shell } = require('electron');
              await shell.openExternal('https://lobe.chat');
            },
            label: t('menu.help.visitWebsite'),
          },
          {
            click: async () => {
              const { shell } = require('electron');
              await shell.openExternal('https://github.com/lobehub/lobe-chat');
            },
            label: t('menu.help.githubRepo'),
          },
          { type: 'separator' },
          {
            click: () => {
              const { dialog } = require('electron');
              dialog.showMessageBox({
                buttons: [t('common.actions.ok')],
                detail: t('dialog.about.detail'),
                message: t('dialog.about.message', {
                  appName: app.getName(),
                  appVersion: app.getVersion(),
                }),
                title: t('dialog.about.title'),
                type: 'info',
              });
            },
            label: t('menu.help.about'),
          },
        ],
      },
    ];

    if (showDev) {
      template.push({
        label: t('menu.dev.title'),
        submenu: [
          { accelerator: 'Ctrl+R', label: t('menu.dev.reload'), role: 'reload' },
          { accelerator: 'Ctrl+Shift+R', label: t('menu.dev.forceReload'), role: 'forceReload' },
          { accelerator: 'Ctrl+Shift+I', label: t('menu.dev.devTools'), role: 'toggleDevTools' },
          { type: 'separator' },
          {
            click: () => {
              this.app.browserManager.retrieveByIdentifier('devtools').show();
            },
            label: t('menu.dev.devPanel'),
          },
        ],
      });
    }

    return template;
  }

  private getDefaultContextMenuTemplate(): MenuItemConstructorOptions[] {
    const { t } = this.app.i18n;

    return [
      { label: t('menu.edit.cut'), role: 'cut' },
      { label: t('menu.edit.copy'), role: 'copy' },
      { label: t('menu.edit.paste'), role: 'paste' },
      { type: 'separator' },
      { label: t('menu.edit.selectAll'), role: 'selectAll' },
    ];
  }

  private getChatContextMenuTemplate(data?: any): MenuItemConstructorOptions[] {
    const { t } = this.app.i18n;

    const items: MenuItemConstructorOptions[] = [
      { label: t('menu.edit.copy'), role: 'copy' },
      { label: t('menu.edit.paste'), role: 'paste' },
      { type: 'separator' },
      { label: t('menu.edit.selectAll'), role: 'selectAll' },
    ];

    if (data?.messageId) {
      items.push(
        { type: 'separator' },
        {
          click: () => {
            console.log('尝试删除消息:', data.messageId);
          },
          label: t('common.actions.delete'),
        },
      );
    }

    return items;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private getEditorContextMenuTemplate(_data?: any): MenuItemConstructorOptions[] {
    const { t } = this.app.i18n;

    return [
      { label: t('menu.edit.cut'), role: 'cut' },
      { label: t('menu.edit.copy'), role: 'copy' },
      { label: t('menu.edit.paste'), role: 'paste' },
      { type: 'separator' },
      { label: t('menu.edit.undo'), role: 'undo' },
      { label: t('menu.edit.redo'), role: 'redo' },
      { type: 'separator' },
      { label: t('menu.edit.selectAll'), role: 'selectAll' },
    ];
  }

  private getTrayMenuTemplate(): MenuItemConstructorOptions[] {
    const { t } = this.app.i18n;
    const appName = app.getName();

    return [
      {
        click: () => this.app.browserManager.showMainWindow(),
        label: t('menu.tray.open', { appName }),
      },
      { type: 'separator' },
      {
        click: () => this.app.browserManager.retrieveByIdentifier('settings').show(),
        label: t('menu.file.preferences'),
      },
      { type: 'separator' },
      { label: t('menu.tray.quit'), role: 'quit' },
    ];
  }
}
