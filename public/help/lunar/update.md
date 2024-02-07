# Windows启动器更新

> 感谢[muskf](https://github.com/CubeWhyMC/website/issues/1)

演示页面已启用! [来这里!](https://cubewhy.github.io/official-lc)

## 请求参数

URL: https://launcherupdates.lunarclientcdn.com/latest.yml

PARAMS:
- noCache: 不清楚实际用途,按含义来猜是无缓存

## 示例响应

```yml
version: 3.2.2
files:
  - url: Lunar Client v3.2.2.exe
    sha512: 0aYEeVBszb1N/NaCrNb5GfNBu1KMkem7J7/fGJn4sW0phM/XmpN+WDRKs2dFvZxNQp6y7kJvuXlJl5IvDE4j0Q==
path: Lunar Client v3.2.2.exe
sha512: 0aYEeVBszb1N/NaCrNb5GfNBu1KMkem7J7/fGJn4sW0phM/XmpN+WDRKs2dFvZxNQp6y7kJvuXlJl5IvDE4j0Q==
packages:
  ia32:
    size: 91948955
    sha512: tMLe1IPdbUFX8q6fXJIHbaX/+O3pm9lFZG74JMFuP5L0kBG8qxfZauw8/uIftV4WecJoseyJEmd4IgAwUegvow==
    blockMapSize: 97383
    path: launcher-3.2.2-ia32.nsis.7z
    file: launcher-3.2.2-ia32.nsis.7z
  x64:
    size: 96591999
    sha512: O/yygw1a8jxpfM34v+oWdvGrk9+lzl6PjZC7zuhueWJO5oEfsh8AxUhVA/1NWzNl/Z4j+sF2fKqHLWuVxCjMbg==
    blockMapSize: 101171
    path: launcher-3.2.2-x64.nsis.7z
    file: launcher-3.2.2-x64.nsis.7z
releaseDate: '2024-01-30T20:28:29.996Z'
```

## 响应讲解

> 下载文件: https://launcherupdates.lunarclientcdn.com/filename

- version: 版本
- files.url: exe安装包的路径
- files.sha512: sha512校验码
- path: 和files.url一致
- sha512: 和files.sha512一致
- packages: 真实的启动器存档
- packages.x64: x86_64 CPU适用的可执行文件
- packages.ia32: ia32 CPU适用的可知性文件
- packages.x.size: 文件大小, 单位b
- packages.x.sha512: sha512校验码
- packages.x.blockMapSize: ***不清楚, 有待补充***
- packages.x.path: 下载路径
- packages.x.file: 和packages.x.path没什么区别
- releaseDate: 发布日期
