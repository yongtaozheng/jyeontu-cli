# Markdown 转 PDF 测试文档

这是一个用于测试 markdown 转 PDF 功能的示例文档。

## 基础语法测试

### 1. 标题层级

这是一级标题

## 这是二级标题

### 这是三级标题

### 2. 文本格式

**这是粗体文本**
*这是斜体文本*
***这是粗斜体文本***

#### 四级标题测试

这是一个四级标题的测试，应该有不同的字体大小和样式。

### 3. 代码示例

#### 行内代码

这里有一个 `console.log('Hello World')` 的行内代码示例。

#### 代码块

```javascript
function helloWorld() {
    console.log('Hello, World!');
    return 'Hello, World!';
}

// 这是一个注释
const result = helloWorld();
console.log(result);
```

```python
def hello_world():
    print("Hello, World!")
    return "Hello, World!"

# 这是一个注释
result = hello_world()
print(result)
```

### 4. 列表

#### 无序列表

- 第一项
- 第二项
  - 嵌套项 1
  - 嵌套项 2
    - 更深层嵌套
    - 另一个深层嵌套
  - 嵌套项 3
- 第三项
  - 另一个嵌套项
- 第四项

#### 有序列表

1. 第一步
2. 第二步
3. 子步骤 1
4. 子步骤 2
   1. 更深层步骤
   2. 另一个深层步骤
5. 第三步
6. 另一个子步骤
7. 第四步

#### 混合列表

- 无序项 1
  1. 有序子项 1
  2. 有序子项 2
- 无序项 2
  - 无序子项 1
  - 无序子项 2
    1. 更深层有序项

### 5. 引用

> 这是一个引用块
>
> 可以包含多行内容
>
> 也可以包含 **粗体** 和 `代码`
>
> 这是引用块的第三行内容
>
> 引用块应该有不同的背景色和左边框

#### 复杂引用块测试

> 这是一个包含多种格式的引用块：
>
> - 包含 **粗体文本**
> - 包含 *斜体文本*
> - 包含 `行内代码`1212112
> - 包含 [链接](https://github.com)
>
> 引用块应该：
>
> 1. 有左边框
> 2. 有背景色
> 3. 支持多行内容
> 4. 支持内部格式化

### 6. 链接和图片

这是一个 [链接示例](https://github.com)

![图片示例](https://via.placeholder.com/300x200)

### 7. 表格


| 功能 | 支持情况 | 备注            |
| ---- | -------- | --------------- |
| 标题 | ✅       | 支持 1-6 级标题 |
| 粗体 | ✅       | 使用**文本**    |
| 斜体 | ✅       | 使用*文本*      |
| 代码 | ✅       | 行内和代码块    |
| 列表 | ✅       | 有序和无序      |
| 表格 | ✅       | 基础表格支持    |
| 链接 | ✅       | 支持外部链接    |
| 引用 | ✅       | 多行引用块      |

#### 复杂表格测试


| 列1        | 列2    | 列3          | 列4   |
| ---------- | ------ | ------------ | ----- |
| 数据1      | 数据2  | 数据3        | 数据4 |
| 长文本数据 | 短数据 | 中等长度数据 | 数据  |
| 数据       | 数据   | 数据         | 数据  |

### 8. 分割线

---

## 高级功能测试

### 代码高亮

```javascript
// JavaScript 代码示例
class Calculator {
    constructor() {
        this.result = 0;
    }
  
    add(a, b) {
        return a + b;
    }
  
    subtract(a, b) {
        return a - b;
    }
}

const calc = new Calculator();
console.log(calc.add(5, 3)); // 输出: 8
```

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

### 数学公式（如果支持）

如果支持 LaTeX 语法，可以显示数学公式：

- 行内公式：$E = mc^2$
- 块级公式：
  $$
  \int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
  $$

## 总结

这个测试文档包含了 markdown 的主要语法元素，可以用来验证转换功能是否正常工作。

### 检查清单

- [X]  标题层级
- [X]  文本格式
- [X]  代码块
- [X]  列表
- [X]  引用
- [X]  表格
- [X]  链接
- [X]  分割线

---

*文档结束*
