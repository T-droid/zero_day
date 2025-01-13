import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar, timestamp, pgEnum, decimal, integer, boolean } from "drizzle-orm/pg-core";

// Enum definitions
export const roleEnum = pgEnum("role", ["Admin", "Student", "Delivery personnel"]);
export const orderStatusEnum = pgEnum("order_status", ["Pending", "In transit", "delivered"]);
export const paymentStatusEnum = pgEnum("payment_status", ["Paid", "Failed"]);

export const UserTable = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    phone_number: varchar("phone_number", { length: 15 }).unique().notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    role: roleEnum("role").default("Student")
})

export const UserTableRelations = relations(UserTable, ({ one }) => ({
    student: one(StudentTable),
    deliveryPerson: one(DeliveryPersonnelTable)
}))


export const StudentTable = pgTable("students", {
    student_id: uuid("student_id").primaryKey().references(() => UserTable.id, { onDelete: "cascade", onUpdate: "cascade"}).notNull(),
    hostel_name: varchar("hostel_name", { length: 40 }).notNull(),
    room_number: varchar("room_number", { length: 10 }).notNull(),
    created_at: timestamp("created_at").defaultNow(),
})

export const StudentTableRelations = relations(StudentTable, ({ many, one }) => ({
    orders: many(OrdersTable),
    user: one(UserTable, {
        fields: [StudentTable.student_id],
        references: [UserTable.id]
    })

}))

export const FoodTable = pgTable("food", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).unique().notNull(),
    price: decimal("price", { precision: 10, scale: 2}).notNull(),
    quantity_available: integer("quantity_available").default(0).notNull(),
    image_url: varchar("image_url", { length: 255 }).notNull(),
    description: varchar("description", { length: 500 }),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow()
})

export const FoodRelations = relations(FoodTable, ({ many }) => ({
    orders: many(OrdersTable),
    inventory: many(InventoryLogTable),
}))

export const OrdersTable = pgTable("orders", {
    id: uuid("id").defaultRandom().primaryKey(),
    student_id: uuid("student_id").references(() => StudentTable.student_id, { onDelete: "cascade", onUpdate: "cascade"}).notNull(),
    food_id: uuid("food_id").references(() => FoodTable.id, { onDelete: "restrict", onUpdate: "cascade"}).notNull(),
    quantity: integer("quantity").notNull(),
    total_price: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
    order_status: orderStatusEnum("order_status").default("Pending"),
    delivery_person_id: uuid("delivery_person_id").references(() => DeliveryPersonnelTable.delivery_person_id, { onDelete: "set null", onUpdate: "cascade"}),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow()
})

export const OrderRelations = relations(OrdersTable, ({ one }) => ({
    student: one(StudentTable, {
        fields: [OrdersTable.student_id],
        references: [StudentTable.student_id]
    }),
    food: one(FoodTable, {
        fields: [OrdersTable.food_id],
        references: [FoodTable.id]
    }),
    delivery_personnel: one(DeliveryPersonnelTable, {
        fields: [OrdersTable.delivery_person_id],
        references: [DeliveryPersonnelTable.delivery_person_id]
    })
}))

export const DeliveryPersonnelTable = pgTable("delivery_peronnel", {
    delivery_person_id: uuid("delivery_person_id").primaryKey().references(() => UserTable.id, { onDelete: "cascade", onUpdate: "cascade"}).notNull(),
    active_status: boolean("active_status").default(true),
    created_at: timestamp("created_at").defaultNow()
})

export const DeliveryPersonnelRelations = relations(DeliveryPersonnelTable, ({ many, one }) => ({
    orders: many(OrdersTable),
    user: one(UserTable, {
        fields: [DeliveryPersonnelTable.delivery_person_id],
        references: [UserTable.id]
    })
}))

export const PaymentsTable = pgTable("payments", {
    id: uuid("id").defaultRandom().primaryKey(),
    order_id: uuid("order_id").references(() => OrdersTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    amount: decimal("amount", {precision: 10, scale: 2}).notNull(),
    payment_status: paymentStatusEnum("payment_status").default("Paid"),
    payment_date: timestamp("payment_date").defaultNow()
})

export const paymentRelations = relations(PaymentsTable, ({ one }) => ({
    order: one(OrdersTable, {
        fields: [PaymentsTable.order_id],
        references: [OrdersTable.id]
    })
}))

export const InventoryLogTable = pgTable("inventory", {
    id: uuid("id").defaultRandom().primaryKey(),
    food_id: uuid("food_id").references(() => FoodTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    quantity_change: integer("quantity_change").notNull(),
    reason: varchar("reason", { length: 255 }).notNull(),
    created_at: timestamp("created_at").defaultNow()
})

export const InventoryLogRelations = relations(InventoryLogTable, ({ one }) => ({
    food: one(FoodTable, {
        fields: [InventoryLogTable.food_id],
        references: [FoodTable.id]
    })
}))
