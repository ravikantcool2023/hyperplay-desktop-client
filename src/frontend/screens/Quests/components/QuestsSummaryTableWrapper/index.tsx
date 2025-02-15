import React, { useState } from 'react'
import { QuestsSummaryTable, QuestCard, QuestFilter } from '@hyperplay/ui'
import useGetQuests from 'frontend/hooks/useGetQuests'
import { useTranslation } from 'react-i18next'
import styles from './index.module.scss'
import { itemType } from '@hyperplay/ui/dist/components/Dropdowns/Dropdown'
import useGetHyperPlayListings from 'frontend/hooks/useGetHyperPlayListings'

export interface QuestsSummaryTableWrapperProps {
  selectedQuestId: number | null
  setSelectedQuestId: (id: number | null) => void
}

export function QuestsSummaryTableWrapper({
  selectedQuestId,
  setSelectedQuestId
}: QuestsSummaryTableWrapperProps) {
  const { t } = useTranslation()
  const questsResults = useGetQuests()
  const quests = questsResults?.data?.data
  const hyperplayListings = useGetHyperPlayListings()
  const listings = hyperplayListings.data.data

  const [activeFilter, setActiveFilter] = useState<QuestFilter>('all')

  const achievementsSortOptions = [
    { text: 'Alphabetically (ASC)', id: 'ALPHA_ASC' },
    { text: 'Alphabetically (DES)', id: 'ALPHA_DES' }
  ]
  const [selectedSort, setSelectedSort] = useState<itemType>(
    achievementsSortOptions[0]
  )

  if (selectedSort.id === 'ALPHA_ASC') {
    quests?.sort((a, b) => {
      if (a.name < b.name) {
        return -1
      } else if (a.name > b.name) {
        return 1
      }
      return 0
    })
  } else if (selectedSort.id === 'ALPHA_DES') {
    quests?.sort((a, b) => {
      if (a.name > b.name) {
        return -1
      } else if (a.name < b.name) {
        return 1
      }
      return 0
    })
  }

  const imagesToPreload: string[] = []
  // set outline css on selected
  const gameElements =
    quests?.map(({ id, project_id, ...rest }) => {
      const imageUrl = listings
        ? listings[project_id]?.project_meta?.main_capsule
        : ''
      if (imageUrl) {
        imagesToPreload.push(imageUrl)
      }
      const title = listings ? listings[project_id]?.project_meta?.name : ''
      return (
        <QuestCard
          key={id}
          image={imageUrl}
          title={title}
          {...rest}
          onClick={() => {
            if (selectedQuestId === id) {
              setSelectedQuestId(null)
            } else {
              setSelectedQuestId(id)
            }
          }}
          selected={id === selectedQuestId}
        />
      )
    }) ?? []

  return (
    <QuestsSummaryTable
      games={gameElements}
      imagesToPreload={imagesToPreload}
      sortProps={{
        options: achievementsSortOptions,
        selected: selectedSort,
        onItemChange: setSelectedSort
      }}
      filterProps={{ activeFilter: activeFilter, setActiveFilter }}
      isFetching={questsResults?.data.isFetching}
      isPageLoading={questsResults?.data.isLoading}
      activeTab={'ACTIVE'}
      tabs={
        [
          // TODO: uncomment when we can filter based on these categories
          // { label: 'Active', value: 'ACTIVE' },
          // { label: 'Claim Ready', value: 'CLAIM_READY' },
          // { label: 'Completed', value: 'COMPLETED' }
        ]
      }
      messageModalProps={{
        title: 'msg modal title',
        message: 'msg modal msg'
      }}
      pageTitle={t('quests.quests', 'Quests')}
      className={styles.tableContainer}
    />
  )
}
