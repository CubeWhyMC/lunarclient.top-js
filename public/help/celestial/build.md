# 构建Celestial

## 准备工作

你需要安装如下软件(如果你只是想构建的话)
- [git](https://git-scm.com)
- JDK 17

如果你想开发, 你还需要安装
- [Intellij IDEA](https://www.jetbrains.com/idea)

## 开始构建

> 你需要先完成[准备工作](#准备工作)

1. 打开你的shell
2. 克隆仓库 -> `git clone https://github.com/CubeWhyMC/celestial`
3. chdir -> `cd celestial` (在Windows下可能需要添加/d参数)
4. 构建 -> `gradlew clean build` (网络错误请移步[此处](https://cn.bing.com/search?q=gradle%E8%AE%BE%E7%BD%AE%E5%8A%A0%E9%80%9F%E6%BA%90))

你可以在 build/libs 中找到输出的工件
