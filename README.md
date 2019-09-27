# UseRequest

useRequest 是一个react hook，用来发送请求

## Installation

```
npm i @learning/use-request
```

## Useage

useRequest需要将请求封装成函数，比如下面这样

```typescript
interface IResp<D> {
    code: number;
    data: D;
    message: string;
}

interface IParams {
    username: string;
    password: string;
}

interface IUserData {
    name: string;
    id: number;
}

export const requestUser = (params: IParams): Promise<IResp<IUserData>> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (params.username === 'john' && params.password === '123456') {
                resolve({
                    code: 1,
                    message: 'success',
                    data: {
                        name: 'john',
                        id: 123456,
                    },
                });
            } else {
                reject({
                    code: -1,
                    message: `用户名或密码不存在: 用户名：${params.username}，密码：${params.password}`,
                    data: null,
                });
            }
        }, 1000);
    });
};

```

## API

```typescript
import useRequest from '@learning/use-request'

const {res, error, isError, isLoading, execute} = useRequest(requestFn, {
  params,
  initialData,
  manually,
  dependency,
  onFulfilled,
  onRejected,
  check,
})
```

参数类型

```typescript
import { DependencyList } from 'react';
interface IRes<D> {
    code: number;
    data: D;
    message: string;
}
interface IState<D> {
    isError: boolean;
    isLoading: boolean;
    res?: IRes<D>;
    error?: any;
}
interface IReturn<D, P> extends IState<D> {
    execute: (p?: P) => void;
}
export default function useRequest<P extends object, D>(request: (params?: P) => Promise<IRes<D>>, optional?: {
    params?: P;
    initialData?: D;
    manually?: boolean;
    dependency?: DependencyList;
    check?: (params?: P) => boolean;
    onFulfilled?: (res: IRes<D>) => void;
    onRejected?: (err: any) => void;
}): IReturn<D, P>;
export {};

```



### 说明

#### 参数

+ request：请求函数，必选。
+ params：请求函数的参数。可选。
+ initialData：res.data的初始值，可选。
+ manually：useRequest是否设置为手动模式，可选。
+ dependency：useRequest的依赖，仅在非手动模式有效，可选。
  + 默认依赖：params的各个属性。仅对params展开一层，如果params的属性值有对象或数组的，仅会进行浅比较
+ onFulfilled：请求数据成功后的回调，可选。
+ onRejected：请求数据失败后的回调，可选。
+ check：请求参数检查，若检查不通过则不发送请求，可选。
  + 默认通过条件：参数是 undefined，或者参数为对象且各个属性值都不为undefined

#### 返回值

+ res：请求成功后的response
+ error：请求失败后的error
+ isLoading：是否正在请求
+ isError：是否发生错误
+ execute：手动发送请求
  + execute接收一个可选参数p，可以临时改变请求参数。如果不传这个参数，默认使用传给useRequest的params；如果传参数，必选传完整的请求参数，不能仅传部分请求参数



useRequest有2种模式：自动/手动模式。

自动模式下只要起依赖发生改变就会发请求，手动模式下即使依赖发生改变也不会发请求，必需手动调用execute才会发请求。

另外，自动模式下也可以调用execute：有时params没有改变，但你也想发送请求更新某些状态，这时就可以调用execute。

## 注意事项

1. 在传给useRequest的check、onFulfilled、onRejected等方法中访问useRequest的返回值，拿到的是上一次请求的结果

```javascript
const { res, execute, isLoading, isError, error } = useRequest(
  requestFoo,
  {
    onFulfilled: r => {
      // 在 onFulfilled 里访问的
      // {res, execute, isLoading, isError, error} 是上一次请求的结果
      console.log(r);
    },
  },
);
```

2. useRequest 考虑了 race-condition的问题，参考文档：

https://overreacted.io/a-complete-guide-to-useeffect/#speaking-of-race-conditions

## Demo

克隆仓库自行参考

```
git clone git@code.byted.org:zhaojiwei/use-request.git
npm i
npm start
```



