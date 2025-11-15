const helperMapping: any = {
  firstName: {
    title: 'Name',
    subTitle: '',
  },
  '/uikit': {
    title: 'UI Kit',
    subTitle: 'Display different component states',
  },
};

export const typeMappingHandler = (key: string) => {
  return helperMapping[key] || '---';
};
