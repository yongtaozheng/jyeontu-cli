# 代码解析测试

## 测试1：代码块中的注释

```css
/* CSS 代码示例 */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.button:hover {
    background-color: #0056b3;
}
```

## 测试2：JavaScript代码块

```javascript
// JavaScript 代码示例
function helloWorld() {
    console.log('Hello, World!');
    return 'Hello, World!';
}

// 这是一个注释
const result = helloWorld();
console.log(result);

/* 多行注释
   这是第二行
   这是第三行 */
```

## 测试3：行内代码

这里有一个 `console.log('Hello World')` 的行内代码示例。

另一个行内代码：`/* 这是注释 */`

## 测试4：混合内容

这是普通文本，包含 **粗体** 和 *斜体*。

```python
# Python 代码示例
def hello_world():
    print("Hello, World!")
    return "Hello, World!"

# 这是一个注释
result = hello_world()
print(result)
```

## 测试5：引用块中的代码

> 这是一个引用块，包含代码：
> 
> ```css
> /* CSS 代码示例 */
> .container {
>     max-width: 1200px;
> }
> ```
> 
> 还有行内代码：`console.log('test')`

## 测试6：特殊字符

```bash
# 这是bash注释
echo "Hello World"
# 另一个注释
```

```html
<!-- HTML 注释 -->
<div class="container">
    <p>Hello World</p>
</div>
```
