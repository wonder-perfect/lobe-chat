## Menu 实现框架

```
apps/desktop/src/main/
├── core/
│   ├── App.ts                // 应用核心类
│   ├── BrowserManager.ts     // 浏览器窗口管理
│   └── MenuManager.ts        // 新增：菜单管理核心类，负责选择和协调平台实现
├── menus/                    // 新增：菜单实现目录
│   ├── index.ts              // 导出平台实现和接口
│   ├── types.ts              // 定义菜单平台接口 IMenuPlatform
│   └── impl/                 // 平台特定实现目录
│       ├── BaseMenuPlatform.ts // 基础平台类，注入App
│       ├── DarwinMenu.ts       // macOS 充血模型实现
│       ├── WindowsMenu.ts      // Windows 充血模型实现
│       └── LinuxMenu.ts        // Linux 充血模型实现
├── controllers/
│   └── MenuCtr.ts            // 菜单控制器，处理渲染进程调用
```
