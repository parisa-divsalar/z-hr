const helperMapping: any = {
  firstName: {
    title: 'نام',
    subTitle: '',
  },
};

export const typeMappingHandler = (key: string) => {
  return helperMapping[key] || '---';
};
