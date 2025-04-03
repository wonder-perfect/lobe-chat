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
    const { t } = this.app.i18n;

    const template: MenuItemConstructorOptions[] = [
      {
        label: appName,
        submenu: [
          {
            label: t('menu.macOS.about', { appName }),
            role: 'about',
          },
          { type: 'separator' },
          {
            accelerator: 'Command+,',
            click: () => {
              this.app.browserManager.showSettingsWindow();
            },
            label: t('menu.macOS.preferences'),
          },
          { type: 'separator' },
          {
            label: t('menu.macOS.services'),
            role: 'services',
            submenu: [],
          },
          { type: 'separator' },
          {
            accelerator: 'Command+H',
            label: t('menu.macOS.hide', { appName }),
            role: 'hide',
          },
          {
            accelerator: 'Command+Alt+H',
            label: t('menu.macOS.hideOthers'),
            role: 'hideOthers',
          },
          {
            label: t('menu.macOS.unhide'),
            role: 'unhide',
          },
          { type: 'separator' },
          {
            accelerator: 'Command+Q',
            label: t('menu.file.quit'),
            role: 'quit',
          },
        ],
      },
      {
        label: t('menu.edit.title'),
        submenu: [
          { accelerator: 'Command+Z', label: t('menu.edit.undo'), role: 'undo' },
          { accelerator: 'Shift+Command+Z', label: t('menu.edit.redo'), role: 'redo' },
          { type: 'separator' },
          { accelerator: 'Command+X', label: t('menu.edit.cut'), role: 'cut' },
          { accelerator: 'Command+C', label: t('menu.edit.copy'), role: 'copy' },
          { accelerator: 'Command+V', label: t('menu.edit.paste'), role: 'paste' },
          { accelerator: 'Command+A', label: t('menu.edit.selectAll'), role: 'selectAll' },
        ],
      },
    ];

    if (showDev) {
      template.push({
        label: t('menu.dev.title'),
        submenu: [
          { accelerator: 'Command+R', label: t('menu.dev.reload'), role: 'reload' },
          { accelerator: 'Shift+Command+R', label: t('menu.dev.forceReload'), role: 'forceReload' },
          { accelerator: 'F12', label: t('menu.dev.devTools'), role: 'toggleDevTools' },
          { type: 'separator' },
          {
            click: () => {
              this.app.browserManager.retrieveByIdentifier('devtools').show();
            },
            label: t('menu.macOS.devTools'),
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
    ];
  }

  private getChatContextMenuTemplate(data?: any): MenuItemConstructorOptions[] {
    const { t } = this.app.i18n;

    const items: MenuItemConstructorOptions[] = [
      { label: t('menu.edit.copy'), role: 'copy' },
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
          label: t('common.actions.delete'),
        },
      );
    }
    return items;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private getEditorContextMenuTemplate(_data?: any): MenuItemConstructorOptions[] {
    const { t } = this.app.i18n;

    // 编辑器特定的上下文菜单
    return [
      { label: t('menu.edit.cut'), role: 'cut' },
      { label: t('menu.edit.copy'), role: 'copy' },
      { label: t('menu.edit.paste'), role: 'paste' },
      // ...
    ];
  }

  private getTrayMenuTemplate(): MenuItemConstructorOptions[] {
    const { t } = this.app.i18n;
    const appName = app.getName();

    return [
      {
        click: () => this.app.browserManager.showMainWindow(),
        label: t('menu.tray.show', { appName }),
      },
      {
        click: () => this.app.browserManager.retrieveByIdentifier('settings').show(),
        label: t('menu.file.preferences'),
      },
      { type: 'separator' },
      { label: t('menu.tray.quit'), role: 'quit' },
    ];
  }
}
