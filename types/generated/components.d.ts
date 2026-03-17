import type { Schema, Struct } from '@strapi/strapi';

export interface ProductOrderItem extends Struct.ComponentSchema {
  collectionName: 'components_product_order_items';
  info: {
    displayName: 'OrderItem';
    icon: 'shoppingCart';
  };
  attributes: {
    priceAtPurchase: Schema.Attribute.Decimal;
    productId: Schema.Attribute.String;
    quantity: Schema.Attribute.Integer;
  };
}

export interface ProductTimeline extends Struct.ComponentSchema {
  collectionName: 'components_product_timelines';
  info: {
    displayName: 'Timeline';
  };
  attributes: {
    orderConfirmed: Schema.Attribute.DateTime;
    orderDelivered: Schema.Attribute.DateTime;
    orderPlaced: Schema.Attribute.DateTime;
    orderShipped: Schema.Attribute.DateTime;
    outForDelivery: Schema.Attribute.DateTime;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'product.order-item': ProductOrderItem;
      'product.timeline': ProductTimeline;
    }
  }
}
