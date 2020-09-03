import * as React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '~/reducers';
import { AccountState } from '~/stateTypes';
import { accountActions } from '~/actions';
import Signout from '~/components/Signout';

const Nav: React.FC = () => {
    const account = useSelector<RootState, AccountState>(
        state => state.account
    );
    const hasAccountData = Boolean(account.data.email && account.data.nickname);

    const { pathname } = useRouter();
    const dispatch = useDispatch();
    useEffect(() => {
        if (pathname !== '/signin') {
            if (!hasAccountData) {
                dispatch(accountActions.getAccount());
            }
        }
    }, []);

    return (
        <nav>
            <ul className="Nav-list">
                <li>Header</li>
                <li>
                    <Link href="/todo">
                        <a>TODO</a>
                    </Link>
                </li>
                <li>link 2</li>
                {!hasAccountData && (
                    <li>
                        <Link href="/signin">
                            <a>signin</a>
                        </Link>
                    </li>
                )}
                {hasAccountData && (
                    <li>
                        <Signout />
                    </li>
                )}
            </ul>
            {hasAccountData && (
                <ul>
                    <li>Mail: {account.data.email}</li>
                    <li>Name: {account.data.nickname}</li>
                </ul>
            )}
            <style jsx>{`
                .Nav-list {
                    display: flex;
                    padding: 12px 6px;
                }
                .Nav-list li {
                    padding: 0 6px;
                }
            `}</style>
        </nav>
    );
};

export default Nav;
