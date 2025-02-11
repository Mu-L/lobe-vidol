import { Grid, SearchBar, TabsNav } from '@lobehub/ui';
import { Empty } from 'antd';
import { createStyles } from 'antd-style';
import classNames from 'classnames';
import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import RoleCard from '@/components/RoleCard';
import RomanceCarousel from '@/components/RomanceCarousel';
import SkeletonList from '@/components/SkeletonList';
import { Agent, RoleCategoryEnum } from '@/types/agent';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    position: relative;
    height: 100%;
    border-radius: ${token.borderRadius}px;
    background-color: rgba(255, 255, 255, 2%);
  `,
  searchBar: css`
    padding-inline: ${token.paddingSM}px;
  `,
  tabsNav: css`
    margin-bottom: ${token.margin}px;
    padding-inline: ${token.paddingSM}px;
  `,
  list: css`
    overflow-y: scroll;
    width: 100%;
    height: 100%;
    padding: 0 ${token.paddingSM}px;
  `,
}));

interface AgentListProps {
  activateAgent: (agentId: string) => void;
  agents: Agent[];
  className?: string;
  loading: boolean;
  style?: React.CSSProperties;
}

const AgentList = (props: AgentListProps) => {
  const { activateAgent, className, style, agents = [], loading } = props;
  const { styles } = useStyles();

  const { t } = useTranslation('role');

  // Initialize with first 5 agents
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([]);

  // Update selected agents when agents list changes
  useEffect(() => {
    if (agents.length > 0) {
      setSelectedAgents(agents.slice(0, 5));
    }
  }, [agents]);

  // Function to randomly select 5 agents
  const handleEmojiClick = () => {
    const shuffled = [...agents].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    setSelectedAgents(selected);
  };

  // 定义分类选项
  const CATEGORIES = [
    { key: 'all', label: t('category.all') },
    { label: t('category.game'), key: RoleCategoryEnum.GAME },
    { label: t('category.vroid'), key: RoleCategoryEnum.VROID },
    { label: t('category.anime'), key: RoleCategoryEnum.ANIME },
    { label: t('category.animal'), key: RoleCategoryEnum.ANIMAL },
    { label: t('category.book'), key: RoleCategoryEnum.BOOK },
    { label: t('category.history'), key: RoleCategoryEnum.HISTORY },
    { label: t('category.movie'), key: RoleCategoryEnum.MOVIE },
    { label: t('category.realistic'), key: RoleCategoryEnum.REALISTIC },

    { label: t('category.vtuber'), key: RoleCategoryEnum.VTUBER },
  ];

  // 添加状态管理
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // 根据分类和搜索关键词筛选 agents
  const filteredAgents = agents.filter((agent) => {
    const matchCategory = activeCategory === 'all' || agent.meta.category === activeCategory;
    const matchSearch =
      agent.meta.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      agent.meta.description.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <Flexbox className={classNames(styles.container, className)} style={style}>
      <RomanceCarousel
        items={selectedAgents.map((agent) => ({
          id: agent.agentId,
          image: agent.meta.cover,
          title: agent.meta.name,
          stats: agent.meta.description,
        }))}
        onSelect={activateAgent}
        onEmojiClick={handleEmojiClick}
      />
      <SearchBar
        placeholder={t('search', { ns: 'common' })}
        value={searchKeyword}
        className={styles.searchBar}
        onChange={(e) => setSearchKeyword(e.target.value)}
        allowClear
      />

      <TabsNav
        activeKey={activeCategory}
        items={CATEGORIES}
        className={styles.tabsNav}
        onChange={(key) => setActiveCategory(key)}
      />

      {loading ? (
        <SkeletonList count={6} />
      ) : (
        <Flexbox className={styles.list} flex={1}>
          {filteredAgents.length === 0 ? (
            <Empty
              description={t('noRoleList', { ns: 'chat' })}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <Grid maxItemWidth={160} gap={16} rows={6}>
              {filteredAgents.map((agent) => (
                <RoleCard
                  key={agent.agentId}
                  agent={agent}
                  onClick={() => activateAgent(agent.agentId)}
                />
              ))}
            </Grid>
          )}
        </Flexbox>
      )}
    </Flexbox>
  );
};

export default memo(AgentList);
