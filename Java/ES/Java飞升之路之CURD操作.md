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

# 使用包括 以及排除方法
GET /stu/_search
{
  "_source": {
    "includes": ["name", "owner.*"],
    "excludes": "age"
  },
  "query": {
    "match_all": {}
  }
}
```

### Query String 部分

> 其实知道就行了，并不是十分推荐写法

```bash
# Query String 逻辑部分
# 查询所有
GET /product/_search
# 带有参数查询 其实也是分词后查询
GET /product/_search?q=name:xiaomi
# 分页查询
GET /product/_search?from=0&size=2&sort=price:asc
# 精准匹配
GET /product/_search?q=date:2021-06-01
# all 查询
GET /product/_search?q=2021-06-01
```

### 全文检索

#### match

> - match 可以查询某一个子句。可以将其理解为模糊查询（因为会进行分词查询）
> - 如果遇到右侧代码 `"name": "xiaomi hongmi"` 这种情况，就会进行分词，可以理解为：拿`xiaomi`先匹配，然后`hongmi`匹配。匹配之和就是最后的结果

> - 如果以后有实际场景要求：名称可以是 jom 或是 tom 的话，可以用 match + 分词特性

```bash
# match
GET /product/_search
{
  "query": {
    "match": {
      "name": "xiaomi"
    }
  }
}

GET /product/_search
{
  "query": {
    "match": {
      "name": "xiaomi hongmi"
    }
  }
}
```

#### match_all

> 可以理解为匹配所有的

```bash
# match_all
GET /product/_search

# 上下等价

GET /product/_search
{
  "query": {
    "match_all": {}
  }
}
```

#### multi_match

> 表示多字段查询.
> 通过下列实例展示，query 中的查询内容可以出现在 fields 的任意一个字段中

```bash
# multi_match
GET /product/_search
{
  "query": {
    "multi_match": {
      "query": "phone huangmenji",
      "fields": ["name", "desc"]
    }
  }
}
```

#### match_phrase

> - 表示短语查询
> - 满足`match_phrase` 必须满足一定的条件
>   1. match_phrase 中的查询内容也是会分词的
>   2. 查询中每个分词内容 都必须在被找到。而且顺序不能乱，例如 xiaomi FC phone 就不满足，虽然也是可以被找到，但是顺序不一致。 所以默认必须是连续的

```bash
# match_phrase
GET /product/_search
{
  "query": {
    "match_phrase": {
      "name": "xiaomi phone"
    }
  }
}
```

### 精准查询 term

- term 注意事项

  - term 和 match_phrase 区别:

    match_phrase 会将检索关键词分词, match_phrase 的分词结果必须在被检索字段的分词中都包含，而且顺序必须相同，而且默认必须都是连续的

    term 搜索不会将搜索词分词

  - term 和 keyword 区别

    term 是对于搜索词不分词,

    keyword 是字段类型,是对于 source data 中的字段值不分词

```bash
# 存在内容
GET /product/_search
{
  "query": {
    "term": {
      "name.keyword": "xiaomi phone"
    }
  }
}
# 不存在内容
GET /product/_search
{
  "query": {
    "term": {
      "name": "xiaomi phone"
    }
  }
}
```

- 上述代码中实例 1 可以查询到数据，但是实例 2 不可以查询数据
- 精准查询的 查询内容不会被分词, 所以会拿`xiaomi phone` 去分词后数据源中寻找，结果无法找到
- 但是内部属性`keyword`中保存着分词前的内容，所以是可以查询到的

### range 范围

> 表示范围条件查询

```bash
# 表示范围查询
GET /product/_search
{
  "query": {
    "range": {
      "price": {
        "gte": 900,
        "lte": 3000
      }
    }
  }
}
```

### 过滤器 Filter

- query 和 filter 区别：
  - query 对每个查询的值 会计算相关的评分
  - filter 不会给每个查询的结果进行相关的评分，所以会效率高点，而且 filter 具有缓存作用

```bash
# filter
GET /product/_search
{
  "query": {
    "constant_score": {
      "filter": {
        "term": {
          "name": "phone"
        }
      },
      "boost": 1.2
    }
  }
}
```

### 组合查询-Bool query

**bool**：可以组合多个查询条件，bool 查询也是采用 more_matches_is_better 的机制，因此满足 must 和 should 子句的文档将会合并起来计算分值

- **must**：必须满足子句（查询）必须出现在匹配的文档中，并将有助于得分。
- **filter**：过滤器 不计算相关度分数，cache☆ 子句（查询）必须出现在匹配的文档中。但是不像 must 查询的分数将被忽略。Filter 子句在[filter 上下文](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-filter-context.html)中执行，这意味着计分被忽略，并且子句被考虑用于缓存。
- **should**：可能满足 or 子句（查询）应出现在匹配的文档中。
- **must_not**：必须不满足 不计算相关度分数 not 子句（查询）不得出现在匹配的文档中。子句在[过滤器上下文](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-filter-context.html)中执行，这意味着计分被忽略，并且子句被视为用于缓存。由于忽略计分，0 因此将返回所有文档的分数。

  **minimum_should_match**：参数指定 should 返回的文档必须匹配的子句的数量或百分比。如果 bool 查询包含至少一个 should 子句，而没有 must 或 filter 子句，则默认值为 1。否则，默认值为 0

#### must 必须

> - must 一般都是表示且的关系。可以理解为关系数据库中的 AND。查询出来的数据必须都满足条件才行
> - 这个 must 查询是会计算评分的

```bash
GET /product/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "name": "xiaomi"
          }
        },
        {
          "match": {
            "desc": "zhandouji"
          }
        }
      ]
    }
  }
}
```

#### filter 过滤

> - 跟 must 保持一致。都是必须满足顾虑条件
> - 唯一不同的是 其实这个不计算评分的. 所以总体来说的话 filter 比 must 效率更高点
> - 如果从 1E 条数据中筛选指定的数据，优先使用 filter

```bash
# filter
GET /product/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "match": {
            "name": "xiaomi"
          }
        },
        {
          "match": {
            "desc": "zhandouji"
          }
        }
      ]
    }
  }
}
```

#### should 应该

> - should 表示 or 的关系。但是如果搭配 must/ filter 的话，结果会有所不同
> - 计算评分

```bash
# should
GET /product/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "date": "2021-04-16"
          }
        },
        {
          "match": {
            "name": "xiaomi"
          }
        }
      ]
    }
  }
}
```

#### must_not 必须不满足

> - 表示多个条件必须都不能满足
> - 而且不计算评分

```bash
# must_not
GET /product/_search
{
  "query": {
    "bool": {
      "must_not": [
        {
          "match": {
            "name": "xiaomi"
          }
        },
        {
          "match": {
            "desc": "kendeji"
          }
        }
      ]
    }
  }
}
```

#### must 以及 filter 组合

```bash
GET /product/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "range": {
            "price": {
              "gte": 400,
              "lte": 3000
            }
          }
        }
      ],
      "must": [
        {
          "match": {
            "name": "nfc"
          }
        }
      ]
    }
  }
}
```

- 上述实例中使用了两个查询方法`filter` 以及`must`
- `filter` 具有缓存功能而且没有计算每个结果的评分，所以效率相对高点
- `must` 具有根据计算评分排序的功能。所以放到最后
- 总体而言，这样的组合方式效率会高（**建议遇到大数据筛选，可以通过这种方式来提高效率**）

#### should 以及 filter 组合

```bash
GET /product/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "range": {
            "price": {
              "gte": 300,
              "lte": 3000
            }
          }
        }
      ],
      "should": [
        {
          "match": {
            "name": "hongmi"
          }
        }
      ],
      "minimum_should_match": 1
    }
  }
}
```

- 如果`should`子句遇到了`must`或是`filter`的话，`should`的条件满足或是不满足都可以，所以字段`minimum_should_match`就是 0
- 如果`should`子句没有遇到`must`或是`filter`的话，字段`minimum_should_match`默认是 1
- 基于第一点的话，所以我们必须手动指定`minimum_should_match`的满足项。可以让几项起到作用
