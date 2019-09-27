import React, { useState } from 'react';
import useRequest from '../src';
import { requestUser } from './request';

const DivW = props => {
    return (
        <div
            style={{
                padding: '10px',
                margin: '10px',
                border: '1px solid #000',
            }}
        >
            {props.children}
        </div>
    );
};

const Demo = () => {
    const [username, setUsername] = useState('2222');
    const [password, setPassword] = useState('1111');

    const { res, execute, isLoading, isError, error } = useRequest(
        requestUser,
        {
            params: {
                username,
                password,
            },
            check: params => {
                return !!(params.username && params.password);
            },
            onFulfilled: r => {
                // 在 onFulfilled 里访问的 {res, execute, isLoading, isError, error} 是上一次请求的结果
                console.log(r);
            },
            onRejected: e => {
                console.log(e);
            },
            // manually: true,
        },
    );

    return (
        <DivW>
            <DivW>
                <i>用户名：john；密码：123456</i>
            </DivW>
            {isError && <DivW>{`${error.message}`}</DivW>}
            {isLoading && <DivW>加载中...</DivW>}
            {res && res.data ? <DivW>{`Hello, ${res.data.name}!`}</DivW> : null}
            <DivW>
                用户名：
                <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </DivW>
            <DivW>
                密码：
                <input
                    type="text"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </DivW>
            <DivW>
                <button
                    onClick={() => {
                        execute();
                    }}
                >
                    发送
                </button>
            </DivW>
        </DivW>
    );
};

export const App = () => <Demo />;
