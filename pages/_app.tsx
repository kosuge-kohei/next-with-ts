import * as React from 'react';
import App, { AppInitialProps, AppContext } from 'next/app';

import { Dispatch } from 'redux';
import { wrapper, StoreWithSaga } from '~/store';

import { accountActions, counterActions } from '~/actions';
import { getAccountState } from '~/sagas/selectors/account';

interface AppInitialPropsWithStore extends AppInitialProps {
    store: StoreWithSaga;
}

class CustomApp extends App<AppInitialPropsWithStore> {
    static async getInitialProps({ Component, ctx }: AppContext) {
        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        /**
         * @see https://github.com/uruha/next-with-ts/blob/af76ea71b8aeb5d3d970834e57f065a382cf71d6/src/store/index.ts#L39
         * Can't extended AppContext to include CustomProps Type,
         * tentatively ignore ctx.store type lint.
         */
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await ctx.store.execSagaTask(!!ctx.req, (dispatch: Dispatch) => {
            dispatch(counterActions.increment(1));
        });

        return { pageProps };
    }

    componentDidMount() {
        /**
         * @NOTE
         * this action is only client behavior.
         */
        // const { store } = this.props;
        // const { pathname } = this.props.router;
        // if (pathname !== '/signin') {
        //     const account = getAccountState(store.getState());
        //     if (!(account.data.email && account.data.nickname)) {
        //         store.dispatch(accountActions.getAccount());
        //     }
        // }
    }

    render() {
        const { Component, pageProps } = this.props;

        return <Component {...pageProps} />;
    }
}

export default wrapper.withRedux(CustomApp);
