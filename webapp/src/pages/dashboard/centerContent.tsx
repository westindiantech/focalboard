// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {useEffect, useState} from 'react'

import {useHistory} from 'react-router-dom'

import {useIntl} from 'react-intl'

import SearchIllustration from '../../svg/search-illustration'

import {useAppDispatch, useAppSelector} from '../../store/hooks'
import {setUserWorkspaces} from '../../store/workspace'
import octoClient from '../../octoClient'
import Switch from '../../widgets/switch'

import SearchIcon from '../../widgets/icons/search'
import {UserSettings} from '../../userSettings'
import {getSortedBoards} from '../../store/boards'

// const checkBoardCount = (numsArr: RegExpMatchArray, boardCount: number) => {
//     for (const n of numsArr) {
//         if (Number(n) === boardCount) {
//             return true
//         }
//     }
//
//     return false
// }

const DashboardCenterContent = (): JSX.Element => {
    // const rawWorkspaces = useAppSelector<UserWorkspace[]>(getUserWorkspaceList) || []
    const dispatch = useAppDispatch()
    const history = useHistory()
    const intl = useIntl()
    const [searchFilter, setSearchFilter] = useState('')
    const [showEmptyWorkspaces, setShowEmptyWorkspaces] = useState(UserSettings.dashboardShowEmpty)
    const allBoards = useAppSelector(getSortedBoards)

    const initializeUserWorkspaces = async () => {
        const userWorkspaces = await octoClient.getUserWorkspaces()
        dispatch(setUserWorkspaces(userWorkspaces))
    }

    useEffect(() => {
        initializeUserWorkspaces()
    }, [])

    const titlePattern = new RegExp(searchFilter.split(' ').join('|'), 'i')

    // const extractedNumbers = searchFilter.match(/(\d+)/g)

    const filteredBoards = allBoards.
        filter((board) => titlePattern.test(board.title)).
        sort((a, b) => a.title.localeCompare(b.title))

    return (
        <div className='DashboardCenterContent'>
            <div className='DashboardPage__header'>
                <h1 className='h1'>{intl.formatMessage({id: 'DashboardPage.title', defaultMessage: 'Dashboard'})}</h1>
                <div className='DashboardPage__showEmpty'>
                    {intl.formatMessage({id: 'DashboardPage.showEmpty', defaultMessage: 'Show empty'})}
                    <Switch
                        isOn={showEmptyWorkspaces}
                        onChanged={() => {
                            UserSettings.dashboardShowEmpty = !showEmptyWorkspaces
                            setShowEmptyWorkspaces(!showEmptyWorkspaces)
                        }}
                    />
                </div>
                <div className='DashboardPage__search'>
                    <SearchIcon/>
                    <input
                        type='text'
                        placeholder={intl.formatMessage({id: 'ViewHeader.search', defaultMessage: 'Search'})}
                        onChange={(e) => {
                            setSearchFilter(e.target.value.trim().toLowerCase())
                        }}
                    />
                </div>
            </div>
            <div className='DashboardPage__content'>
                {
                    filteredBoards.length !== 0 &&
                    <div className='text-heading3'>{'All Channels'}</div>
                }
                <div className='DashboardPage__workspace-container'>
                    {
                        filteredBoards.length === 0 &&
                            <div className='DashboardPage__emptyResult'>
                                <SearchIllustration/>
                                <h3>{intl.formatMessage({id: 'DashboardPage.CenterPanel.NoWorkspaces', defaultMessage: 'Sorry, we could not find any channels matching that term'})}</h3>
                                <p className='small'>{intl.formatMessage({id: 'DashboardPage.CenterPanel.NoWorkspacesDescription', defaultMessage: 'Please try searching for another term'})}</p>
                            </div>
                    }
                    {
                        filteredBoards.map((board) => (
                            <div
                                key={board.id}
                                className='DashboardPage__workspace'
                                onClick={() => {
                                    history.push(`/workspace/${board.id}`)
                                }}
                            >
                                <div className='text-heading2'>
                                    {board.title}
                                </div>
                                {/*<div className='small'>*/}
                                {/*    <FormattedMessage*/}
                                {/*        values={{count: board.boardCount}}*/}
                                {/*        id='General.BoardCount'*/}
                                {/*        defaultMessage='{count, plural, one {# Board} other {# Boards}}'*/}
                                {/*    />*/}
                                {/*</div>*/}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default DashboardCenterContent
