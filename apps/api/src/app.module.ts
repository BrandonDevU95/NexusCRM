import { ActivitiesModule } from "./modules/activities/activities.module";
import { AdminModule } from "./modules/admin/admin.module";
import AppConfig from "./config/app.config";
import { AuditLogModule } from "./modules/audit-log/audit-log.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AuthorizationModule } from "./modules/authorization/authorization.module";
import { AutomationsModule } from "./modules/automations/automations.module";
import { ConfigModule } from "@nestjs/config";
import { ContactsModule } from "./modules/contacts/contacts.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { DatabaseModule } from "./database/database.module";
import { DealsModule } from "./modules/deals/deals.module";
import { ExportsModule } from "./modules/exports/exports.module";
import { HealthModule } from "./health/health.module";
import { ImportsModule } from "./modules/imports/imports.module";
import { InventoryModule } from "./modules/inventory/inventory.module";
import { KnowledgeBaseModule } from "./modules/knowledge-base/knowledge-base.module";
import { LeadsModule } from "./modules/leads/leads.module";
import { Module } from "@nestjs/common";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { OrganizationsModule } from "./modules/organizations/organizations.module";
import { PipelinesModule } from "./modules/pipelines/pipelines.module";
import { PriceListsModule } from "./modules/price-lists/price-lists.module";
import { ProductsModule } from "./modules/products/products.module";
import { QuotesModule } from "./modules/quotes/quotes.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { SettingsModule } from "./modules/settings/settings.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { TicketsModule } from "./modules/tickets/tickets.module";
import { UsersModule } from "./modules/users/users.module";
import { validateEnvironment } from "./config/app.validation";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../../.env"],
      load: [AppConfig],
      validate: validateEnvironment,
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
