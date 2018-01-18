import { Action } from 'redux';

export type IActionType<X> = X & { __actionType: string };

const _devSet: { [key: string]: any } = {};

export const makeAction = <Z extends {}>(type: string, typePrefix = '') => {
    // Helpful check against copy-pasting duplicate type keys when creating
    // new actions.
    if (process.env.NODE_ENV === 'development') {
        if (_devSet[type]) {
            throw new Error(
                'Attempted creating an action with an existing type key. ' + 'This is almost cetainly an error.',
            );
        }
        _devSet[type] = type;
    }
    return <X extends (...args: any[]) => Z>(fn: X) => {
        const returnFn: IActionType<X> = ((...args: any[]) => ({ ...(fn as any)(...args), type })) as any;
        returnFn.__actionType = typePrefix + type;
        return returnFn;
    };
};

export const isAction = <T>(
    action: Action,
    actionCreator: IActionType<(...args: any[]) => T>,
): action is T & Action => {
    return action.type === actionCreator.__actionType;
};
