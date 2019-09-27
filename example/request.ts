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

const getRandom = (start, end) => {
    return Math.floor(Math.random() * (end - start)) + start;
};

const numbers = [300, 80, 5000, 1000, 4000, 3000, 2000, 500, 1500];

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
        }, numbers[getRandom(0, numbers.length)]);
    });
};
