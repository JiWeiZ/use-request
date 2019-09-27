import { useEffect, useReducer, DependencyList } from 'react';

enum ERequestType {
    START = 'request_start',
    SUCCESS = 'request_success',
    FAILURE = 'request_failure',
}
type IReqReducer<D> = (state: IState<D>, action: IAction<D>) => IState<D>;
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
interface IAction<D> {
    type: ERequestType;
    res?: IRes<D>;
    error?: any;
}

function filterNullProp<T extends object>(obj: T): NonNullable<T> {
    if (typeof obj !== 'object') {
        return obj;
    }

    const res = {} as NonNullable<T>;

    Object.entries(obj).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            res[key] = value;
        }
    });

    return res;
}

function reqReducer<D>(state: IState<D>, action: IAction<D>): IState<D> {
    switch (action.type) {
        case ERequestType.START:
            return {
                ...state,
                isLoading: true,
                isError: false,
                error: undefined,
            };
        case ERequestType.SUCCESS:
            return {
                isLoading: false,
                res: action.res,
                isError: false,
                error: undefined,
            };
        case ERequestType.FAILURE:
            return {
                isLoading: false,
                res: undefined,
                isError: true,
                error: action.error,
            };
        default:
            throw new Error();
    }
}

// 默认参数校验，通过条件：
// 1. 参数是 undefined
// 2. 或参数为对象且属性值不为undefined
function defaultCheck<P>(p?: P) {
    if (p === undefined) {
        return true;
    }
    return !Object.keys(p).find(key => p[key] === undefined);
}

export default function useRequest<P extends object, D>(
    request: (params?: P) => Promise<IRes<D>>,
    optional: {
        params?: P;
        initialData?: D;
        manually?: boolean;
        dependency?: DependencyList;
        check?: (params?: P) => boolean;
        onFulfilled?: (res: IRes<D>) => void;
        onRejected?: (err: any) => void;
    } = {},
): IReturn<D, P> {
    const { params, initialData, onFulfilled, onRejected } = optional;
    // 默认依赖（非手动模式）
    const defaultDep: DependencyList = params ? Object.values(params) : [];

    const [returnState, dispatch] = useReducer<IReqReducer<D>>(reqReducer, {
        isError: false,
        isLoading: false,
        res: {
            code: undefined,
            data: initialData,
            message: undefined,
        },
        error: undefined,
    });

    const manually = optional.manually || false;
    const check = optional.check || defaultCheck;
    const dependency = optional.dependency || defaultDep;

    // 防止竞态
    // https://overreacted.io/a-complete-guide-to-useeffect/#speaking-of-race-conditions
    let canceled = false;

    const send = (reqParams?: P) => {
        if (!check(reqParams)) {
            return;
        }

        const nonNullParams = filterNullProp(reqParams);

        dispatch({ type: ERequestType.START });

        request(nonNullParams)
            .then(res => {
                if (!canceled) {
                    dispatch({
                        type: ERequestType.SUCCESS,
                        res,
                    });

                    if (onFulfilled) {
                        onFulfilled(res);
                    }
                }
            })
            .catch(e => {
                if (!canceled) {
                    dispatch({
                        type: ERequestType.FAILURE,
                        error: e,
                    });

                    if (onRejected) {
                        onRejected(e);
                    }
                }
            });
    };

    // 导出到外部供手动调用
    const execute = (p: P = params) => {
        send(p);
    };

    useEffect(
        () => {
            if (!manually) {
                send(params);
            }

            return () => {
                canceled = true;
            };
        },
        manually ? [] : [...dependency],
    );

    return { ...returnState, execute };
}
