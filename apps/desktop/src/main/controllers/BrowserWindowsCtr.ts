import { ControllerModule, ipcClientEvent } from './index';

export default class BrowserWindowsCtr extends ControllerModule {
  @ipcClientEvent('openSettingsWindow')
  async openSettingsWindow(tab?: string) {
    console.log('[IPC] 收到打开设置窗口的请求', tab);
    this.app.browserManager.showSettingsWindow();
  }
}
