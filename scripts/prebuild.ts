import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import path from 'node:path';

const isDesktop = process.env.NEXT_PUBLIC_IS_DESKTOP_APP === '1';

// 创建需要排除的特性映射
/* eslint-disable sort-keys-fix/sort-keys-fix */
const partialBuildPages = [
  {
    name: 'changelog',
    disabled: isDesktop,
    paths: ['src/app/[variants]/@modal/(.)changelog', 'src/app/[variants]/(main)/changelog'],
  },
  {
    name: 'desktop-devtools',
    disabled: isDesktop,
    paths: ['src/app/desktop'],
  },
  // {
  //   name: 'auth',
  //   disabled: isDesktop,
  //   paths: ['src/app/[variants]/(auth)'],
  // },
  {
    name: 'desktop-trpc',
    disabled: isDesktop,
    paths: ['src/app/(backend)/trpc/desktop'],
  },
];
/* eslint-enable */

/**
 * 删除指定的目录
 */
const removeDirectories = async () => {
  // 遍历 partialBuildPages 数组
  for (const page of partialBuildPages) {
    // 检查是否需要禁用该功能
    if (page.disabled) {
      for (const dirPath of page.paths) {
        const fullPath = path.resolve(process.cwd(), dirPath);

        // 检查目录是否存在
        if (existsSync(fullPath)) {
          console.log(`Removing directory: ${dirPath}`);
          try {
            // 递归删除目录
            await rm(fullPath, { force: true, recursive: true });
            console.log(`Successfully removed: ${dirPath}`);
          } catch (error) {
            console.error(`Failed to remove directory ${dirPath}:`, error);
          }
        } else {
          console.log(`Directory does not exist: ${dirPath}`);
        }
      }
    }
  }
};

// 执行删除操作
console.log('Starting prebuild cleanup...');
await removeDirectories();
console.log('Prebuild cleanup completed.');
