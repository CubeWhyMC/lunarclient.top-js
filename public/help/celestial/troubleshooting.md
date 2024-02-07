# 排除错误

## 启动器版本本身自带的错误

v1.6版本因为使用kotlin重构, 无法启动是很正常的

Actions版本如果出现报错请开[issue](https://github.com/CubeWhyMC/celestial/issues/new)

## 已知的游戏错误

### Windows下命令过长/命令中带有Unicode字符

将你的Agent修改为只有英文(ascii)字符的名称

将用户文件夹改为英文

## 查看Log

### 启动器日志

在`~/.cubewhy/lunarcn/logs/launcher.log`

### 游戏日志

由Celestial生成: `~/.cubewhy/lunarcn/logs/game.log`

由游戏生成(默认位置): `~/.cubewhy/lunarcn/game/logs` 或 `~/.lunarclient/offline/multiver/logs`

### 在线日志

[点击这里查看](https://www.lunarclient.top/crash)

### 通过API获取在线日志

> 该API已弃用

列表: https://api.lunarclient.top/launcher/getCrashReport

获取指定: https://api.lunarclient.top/launcher/getCrashReport?id=<report_id>

METHOD: GET
