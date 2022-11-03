<h1 align = "center">ES CURD操作</h1>

### 查询索引

```bash
# 查询有哪些有哪些索引
GET _cat/indices?v
```

### 创建索引

```bash
# 创建索引
PUT /user?pretty
```

### 查询所有的数据

```bash
# 查询数据
GET /user/_search
```

### 查询某一条数据

```bash
GET /user/_doc/2
```

### 删除某一条数据

```bash
DELETE /stu/_doc/1
```

### 进行数据添加

```bash
PUT /user/_doc/1
{
  "name": "lihh",
  "age": 22,
  "address": "test",
  "arr": [1,23],
  "school": {
    "name": "大学",
    "address": "大学地址"
  }
}
```

### 执行修改某个字段

```bash
# 指定字段更新
POST /user/_update/2
{
  "doc": {
    "age": 222
  }
}
```

### 表示获取索引结构

```bash
# 获取索引结构
GET /user/_mapping
```

### 索引类型手动映射

```bash
PUT man
{
  "mappings": {
    "properties": {
      "id": {
        "type": "long",
        "index": false
      },
      "price": {
        "type": "long",
        "index": false,
        "doc_values": true
      },
      "date": {
        "type": "date"
      },
      "content": {
        "type": "text",
        "index": true
      }
    }
  }
}
```

- 上述内容基本是固定格式
  - 索引名称必须是小写
  - 外层包含着`mappings` 以及`properties`
  - 每个字段都有一些特定的属性
  - 索引一旦创建不能修改，除非删除了重新新建。所以要慎重考虑

### 通过条件查询所有

```bash
GET /man/_search
{
  "query": {
    "match_all": {}
  }
}
```

- 上述代码`"match_all": {}`可以理解为`where 1 = 1`等。 只不过关键字`query`用来条件查询的

### 查询的数据结构

```json
{
  "took": 5,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1.0,
    "hits": [
      {
        "_index": "man",
        "_type": "_doc",
        "_id": "1",
        "_score": 1.0,
        "_source": {
          "id": 1,
          "price": 22,
          "date": "2022-01-01",
          "content": "胜多负少的胜多负少的"
        }
      },
      {
        "_index": "man",
        "_type": "_doc",
        "_id": "2",
        "_score": 1.0,
        "_source": {
          "id": 2,
          "price": 222,
          "date": "2042-01-01",
          "content": "胜多负少的胜多负少的"
        }
      }
    ]
  }
}
```

- `_index` 表示索引
- `_type` 表示数据类型
- `_id` 表示唯一的 id
- `_source` 表示元数据
- `_score` 表示评分 如果没有指定排序的字段 就是用该字段进行排序

### 有无`_source`查询结果

> 此方式从查询的角度开始过滤

```bash
# 表示有无 查询的source
GET /man/_search
{
  "query": {
    "match_all": {}
  }
}
GET /man/_search
{
  "_source": false,
  "query": {
    "match_all": {}
  }
}
```

1. 禁用\_source：

   1. 好处：节省存储开销
   2. 坏处：

      - 不支持 update、update_by_query 和 reindex API。
      - 不支持高亮。
      - 不支持 reindex、更改 mapping 分析器和版本升级。
      - 通过查看索引时使用的原始文档来调试查询或聚合的功能。
      - 将来有可能自动修复索引损坏。

      **总结：如果只是为了节省磁盘，可以压缩索引比禁用\_source 更好。**

### 从 mapping 角度 限制查询字段

```bash
# 设置可查询字段 以及不可查询的字段
PUT stu
{
  "mappings": {
    "_source": {
      "includes": ["name", "age"],
      "excludes": ["address"]
    }
  }
}

PUT /stu/_doc/1
{
  "name": "test",
  "age": 22,
  "address": "hahahh"
}

GET /stu/_search
{
  "query": {
    "match_all": {}
  }
}
```

- 此方法不建议，因为一旦从 mapping 角度限制查询字段。因为索引不可修改，所以不可恢复
- 但是如果一个字段既出现在`includes`中 又出现在`excludes`. 以`excludes`为准

### 动态指定查询字段

```bash
# 查询单个字段
GET /stu/_search
{
  "_source": "name",
  "query": {
    "match_all": {}
  }
}

# 查询多个字段
GET /stu/_search
{
  "_source": ["name", "age"],
  "query": {
    "match_all": {}
  }
}

# 使用点的方式进行查询
GET /stu/_search
{
  "_source": ["name", "owner.name"],
  "query": {
    "match_all": {}
  }
}

# 使用通配符进行查询
GET /stu/_search
{
  "_source": ["age", "owner.*"],
  "query": {
    "match_all": {}
  }
}
```
