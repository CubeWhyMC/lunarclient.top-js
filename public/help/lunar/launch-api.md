## 启动API

## 请求参数

> 注意: 请求时请使用流进行上传 (application/octet=stream)

PATH: /launcher/launch

METHOD: POST

Content-Type: application/json

## 示例请求

```json
{
  "hwid": "PUBLIC-HWID(Unused)",
  "installation_id": "ef91b21a-0342-415a-a7be-7dcbe1a0f77c",
  "os": "linux",
  "arch": "x64",
  "os_release": "114.514.1919810",
  "launcher_version": "114.514",
  "launch_type": "offline",
  "version": "1.8.9",
  "branch": "master",
  "module": "lunar"
}
```

### 示例请求代码

```kotlin
val json = JsonObject()
json.addProperty("hwid", "HWID-PUBLIC")
json.addProperty("installation_id", UUID(100, 0).toString()) // fake uuid
json.addProperty("os", OSEnum.find(System.getProperty("os.name"))?.jsName) // shit js
json.addProperty("arch", "x64") // example: x64
json.addProperty("os_release", "19045.3086")
json.addProperty("launcher_version", "2.15.1")
json.addProperty("launch_type", "offline")
json.addProperty("version", version)
json.addProperty("branch", branch)
json.addProperty("module", module)

post("$api/launcher/launch", Gson().toJson(json)).execute().use { response ->
    assert(response.body != null) { "ResponseBody was null" }
    return JsonParser.parseString(response.body!!.string()).asJsonObject
}
```

## 示例响应

[1.8.9-lunar.json](https://www.lunarclient.top/1.8.9-lunar.json)
