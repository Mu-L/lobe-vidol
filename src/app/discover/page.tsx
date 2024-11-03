'use client';

import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';
import useSWR from 'swr';

import TopBanner from '@/components/TopBanner';
import { HEADER_HEIGHT } from '@/constants/token';
import { getAgentIndex } from '@/services/agent';
import { Agent } from '@/types/agent';

import DiscoverList from './List';
import MarketInfo from './MarketInfo';

const FETCH_AGENT_INDEX_KEY = 'agentIndex';

const useStyles = createStyles(({ css }) => ({
  container: css`
    overflow-y: auto;

    width: 100%;
    height: calc(100% - ${HEADER_HEIGHT}px);
    min-height: 500px;
    padding: 0 32px 16px;

    @media screen and (max-width: 768px) {
      padding: 0 16px;
    }
  `,
  content: css`
    max-width: 1280px;
    margin: 0 auto;
  `,
  title: css`
    z-index: 2;
    margin-top: 24px;
    font-size: 36px;
    font-weight: 800;
  `,
}));

const Index = () => {
  const { styles } = useStyles();
  const { t } = useTranslation('market');

  const { data, isLoading } = useSWR<Agent[]>(FETCH_AGENT_INDEX_KEY, async () => {
    const { agents = [] } = await getAgentIndex();
    return agents;
  });

  const [currentAgentId, setCurrentAgentId] = useState<string>('');

  const activateAgent = (identifier: string) => {
    setCurrentAgentId(identifier);
  };

  const deactivateAgent = () => {
    setCurrentAgentId('');
  };

  return (
    <Flexbox flex={1} height={'100%'} width={'100%'}>
      <Flexbox flex={1} height={'100%'} width={'100%'} horizontal>
        <div className={styles.container}>
          <div className={styles.content}>
            <TopBanner title={t('findVidol')} />
            <DiscoverList agents={data || []} loading={isLoading} activateAgent={activateAgent} />
          </div>
        </div>
        <MarketInfo
          currentAgentId={currentAgentId}
          activateAgent={activateAgent}
          deactivateAgent={deactivateAgent}
        />
      </Flexbox>
    </Flexbox>
  );
};

export default Index;
