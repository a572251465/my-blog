<h1 align = "center">HttpClient</h1>

## 1. HttpClient 简介

​ 在 JDK 中 java.net 包下提供了用户 HTTP 访问的基本功能，但是它缺少灵活性或许多应用所需要的功能。

​ HttpClient 起初是 Apache Jakarta Common 的子项目。用来提供高效的、最新的、功能丰富的支持 HTTP 协议的客户端编程工具包，并且它支持 HTTP 协议最新的版本。2007 年成为顶级项目。

​ 通俗解释：HttpClient 可以实现使用 Java 代码完成标准 HTTP 请求及响应。

## 2. 用 Java 代码实现 http 请求

### 2.1 Get 请求

```shell
    @Test
    public void testGetReturnString() throws URISyntaxException, IOException {
        // 1. 创建http工具
        CloseableHttpClient httpClient = HttpClients.createDefault();
        // 2. 请求路径
        URIBuilder uriBuilder = new URIBuilder("http://localhost:8081/getInfo");
        uriBuilder.addParameter("params", "123");

        // 3. 创建http get对象
        HttpGet httpGet = new HttpGet(uriBuilder.build());
        // 4. 创建响应对象
        CloseableHttpResponse httpResponse = httpClient.execute(httpGet);

        //由于响应体是字符串，因此把HttpEntity类型转换为字符串类型，并设置字符编码
        String result = EntityUtils.toString(httpResponse.getEntity(), "utf-8");

        System.out.println(result);

        httpResponse.close();
        httpClient.close();
    }
```

### 2.2 Post 请求

```shell
    @Test
    public void testPostReturnString() throws IOException {
        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost("http://localhost:8081/getInfo");

        // 参数
        List<NameValuePair> list = new ArrayList<>();
        list.add(new BasicNameValuePair("params", "123"));


        HttpEntity httpEntity = new UrlEncodedFormEntity(list, "utf-8");
        httpPost.setEntity(httpEntity);

        CloseableHttpResponse httpResponse = httpClient.execute(httpPost);

        String result = EntityUtils.toString(httpResponse.getEntity());
        System.out.println(result);

        httpResponse.close();
        httpClient.close();
    }
```

### 2.3 将 json 转换对象

> 使用依赖 jackson-databind

```shell
    @Test
    public void testGetResultUser() throws URISyntaxException, IOException {
        // 1. 创建http工具
        CloseableHttpClient httpClient = HttpClients.createDefault();
        // 2. 请求路径
        URIBuilder uriBuilder = new URIBuilder("http://localhost:8081/testDemo");
        uriBuilder.addParameter("id", "123");
        uriBuilder.addParameter("name", "lxx");

        // 3. 创建http get对象
        HttpGet httpGet = new HttpGet(uriBuilder.build());
        // 4. 创建响应对象
        CloseableHttpResponse httpResponse = httpClient.execute(httpGet);

        //由于响应体是字符串，因此把HttpEntity类型转换为字符串类型，并设置字符编码
        String result = EntityUtils.toString(httpResponse.getEntity(), "utf-8");

        // 此时返回字符串
        System.out.println(result);

        // 将json对象 转换为 对象
        ObjectMapper objectMapper = new ObjectMapper();
        User user = objectMapper.readValue(result, User.class);
        System.out.println(user);


        httpResponse.close();
        httpClient.close();
    }
```

## 3. Jackson 用法

### 3.1 把对象转换为 json 字符串

```
ObjectMapper objectMapper = new ObjectMapper();
People peo = new People();
objectMapper.writeValueAsString(peo);
```

### 3.2 把 json 字符串转换为对象

```
ObjectMapper objectMapper = new ObjectMapper();
People peo = objectMapper.readValue(content, People.class);
```

### 3.3 把 json 字符串转换为 List 集合

```
ObjectMapper objectMapper = new ObjectMapper();
JavaType javaType = objectMapper.getTypeFactory().constructParametricType(List.class, People.class);
List<People> list = objectMapper.readValue(content, javaType);
```
