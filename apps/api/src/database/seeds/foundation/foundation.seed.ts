import { In } from 'typeorm';
import {
  OrganizationEntity,
  SeedRunEntity,
  SystemSettingEntity,
} from '../../entities';
import type { SeedDefinition } from '../seed.types';

const DEMO_ORGANIZATION_ID = '00000000-0000-4000-8000-000000000001';
const FOUNDATION_SETTING_KEYS = [
  'crm.name',
  'crm.baseCurrency',
  'crm.timezone',
  'numbering.quotes.prefix',
  'numbering.orders.prefix',
];

export const foundationSeed: SeedDefinition = {
  name: 'foundation',
  module: 'settings',
  order: 10,
  async run({ dataSource, logger }) {
    const now = new Date();
    const organizationRepository = dataSource.getRepository(OrganizationEntity);
    const settingRepository = dataSource.getRepository(SystemSettingEntity);

    await organizationRepository.upsert(
      {
        id: DEMO_ORGANIZATION_ID,
        name: 'NexusCRM Demo',
        slug: 'nexus-demo',
        timezone: 'America/Mexico_City',
        currency: 'MXN',
        isActive: true,
        updatedAt: now,
      },
      ['slug'],
    );

    await settingRepository.upsert(
      [
        {
          key: 'crm.name',
          value: 'NexusCRM',
          description: 'Nombre público del CRM.',
          updatedAt: now,
        },
        {
          key: 'crm.baseCurrency',
          value: 'MXN',
          description: 'Moneda base del CRM.',
          updatedAt: now,
        },
        {
          key: 'crm.timezone',
          value: 'America/Mexico_City',
          description: 'Zona horaria base del CRM.',
          updatedAt: now,
        },
        {
          key: 'numbering.quotes.prefix',
          value: 'COT',
          description: 'Prefijo de cotizaciones.',
          updatedAt: now,
        },
        {
          key: 'numbering.orders.prefix',
          value: 'ORD',
          description: 'Prefijo de órdenes.',
          updatedAt: now,
        },
      ],
      ['key'],
    );

    logger.info('Foundation seed applied: settings + demo organization.');
  },
  async reset({ dataSource, logger }) {
    await dataSource.getRepository(SystemSettingEntity).delete({
      key: In(FOUNDATION_SETTING_KEYS),
    });
    await dataSource
      .getRepository(SeedRunEntity)
      .delete({ name: 'foundation' });
    await dataSource
      .getRepository(OrganizationEntity)
      .delete({ slug: 'nexus-demo' });
    logger.warn('Foundation seed reset applied.');
  },
};
