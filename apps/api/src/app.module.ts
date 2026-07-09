import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { env } from './config/env';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthorizationModule } from './modules/authorization/authorization.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { SettingsModule } from './modules/settings/settings.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { LeadsModule } from './modules/leads/leads.module';
import { PipelinesModule } from './modules/pipelines/pipelines.module';
import { DealsModule } from './modules/deals/deals.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ProductsModule } from './modules/products/products.module';
import { PriceListsModule } from './modules/price-lists/price-lists.module';
import { QuotesModule } from './modules/quotes/quotes.module';
import { OrdersModule } from './modules/orders/orders.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { KnowledgeBaseModule } from './modules/knowledge-base/knowledge-base.module';
import { AutomationsModule } from './modules/automations/automations.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ImportsModule } from './modules/imports/imports.module';
import { ExportsModule } from './modules/exports/exports.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [env],
    }),
    DatabaseModule,
    HealthModule,
    AuthModule,
    AuthorizationModule,
    UsersModule,
    OrganizationsModule,
    SettingsModule,
    CustomersModule,
    ContactsModule,
    LeadsModule,
    PipelinesModule,
    DealsModule,
    ActivitiesModule,
    TasksModule,
    ProductsModule,
    PriceListsModule,
    QuotesModule,
    OrdersModule,
    InventoryModule,
    TicketsModule,
    KnowledgeBaseModule,
    AutomationsModule,
    NotificationsModule,
    ReportsModule,
    ImportsModule,
    ExportsModule,
    AuditLogModule,
    AdminModule,
  ],
})
export class AppModule {}

