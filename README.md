# Hedian RN - React Native 应用

这是一个使用 Expo Router 和 React Native 构建的移动应用。

## 功能特性

- 🔐 完整的登录系统
- 📱 响应式设计，支持深色/浅色主题
- 🎨 现代化的UI设计
- 📱 支持iOS和Android平台

## 登录系统

应用包含以下页面：

- **登录页面** (`/login`) - 用户登录界面
- **注册页面** (`/register`) - 新用户注册界面
- **主页** (`/(tabs)`) - 登录成功后的主界面

### 登录功能

- 用户名和密码验证
- 表单验证和错误提示
- 登录状态管理
- 自动跳转到主页

### 注册功能

- 用户名、邮箱、密码输入
- 密码确认验证
- 表单验证
- 注册成功后返回登录页面

## 开始使用

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm start
```

### 运行在设备上

```bash
# iOS
pnpm ios

# Android
pnpm android
```

## 项目结构

```
app/
├── _layout.tsx          # 根布局配置
├── index.tsx            # 启动页面（自动跳转到登录）
├── login.tsx            # 登录页面
├── register.tsx         # 注册页面
└── (tabs)/              # 主页标签导航
    ├── _layout.tsx      # 标签页布局
    ├── index.tsx        # 首页
    └── explore.tsx      # 探索页面

components/               # 可复用组件
├── ThemedView.tsx       # 主题化视图组件
├── ThemedText.tsx       # 主题化文本组件
└── ui/                  # UI组件

constants/                # 常量定义
├── Colors.ts            # 颜色主题配置

hooks/                    # 自定义钩子
├── useColorScheme.ts    # 颜色主题钩子
└── useThemeColor.ts     # 主题颜色钩子
```

## 技术栈

- **React Native** - 移动应用框架
- **Expo Router** - 文件系统路由
- **TypeScript** - 类型安全
- **React Native Reanimated** - 动画库

## 主题系统

应用支持深色和浅色主题，自动根据系统设置切换：

- 自动主题切换
- 一致的颜色方案
- 响应式设计

## 开发说明

### 添加新页面

1. 在 `app/` 目录下创建新的 `.tsx` 文件
2. 在 `app/_layout.tsx` 中添加路由配置
3. 使用 `router.push()` 或 `router.replace()` 进行页面跳转

### 自定义主题

在 `constants/Colors.ts` 中修改颜色配置，应用会自动应用新的主题。

### 组件开发

使用 `ThemedView` 和 `ThemedText` 组件来确保新组件支持主题系统。

## 许可证

MIT License
