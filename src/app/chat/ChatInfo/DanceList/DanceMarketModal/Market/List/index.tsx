import React, { memo, useEffect } from 'react';

import GridList from '@/components/GridList';
import { danceListSelectors, useDanceStore } from '@/store/dance';
import { useMarketStore } from '@/store/market';

interface DanceListProps {
  className?: string;
  style?: React.CSSProperties;
}

const Index = (props: DanceListProps) => {
  const { className, style } = props;
  const [activateDance, danceList, danceLoading, currentDanceId, fetchDanceIndex] = useMarketStore(
    (s) => [s.activateDance, s.danceList, s.danceLoading, s.currentDanceId, s.fetchDanceIndex],
  );
  const [subscribed] = useDanceStore((s) => [danceListSelectors.subscribed(s)]);

  useEffect(() => {
    fetchDanceIndex();
  }, [fetchDanceIndex]);

  return (
    <GridList
      className={className}
      style={style}
      loading={danceLoading}
      items={danceList.map((item) => ({
        avatar: item.cover,
        id: item.danceId,
        name: item.name,
      }))}
      onClick={(id) => {
        activateDance(id);
      }}
      isActivated={(id) => id === currentDanceId}
      isChecked={(id) => subscribed(id)}
    />
  );
};

export default memo(Index);
