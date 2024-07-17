import { DataSource } from 'typeorm';
import { StyleConfig } from '../../entities/styleConfig.entity';

export const styleConfigProviders = [
  {
    provide: 'STYLECONFIG_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(StyleConfig),
    inject: ['DATA_SOURCE'],
  },
];
