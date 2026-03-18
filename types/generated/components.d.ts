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
    confirmed: Schema.Attribute.DateTime;
    delivered: Schema.Attribute.DateTime;
    outForDelivery: Schema.Attribute.DateTime;
    placed: Schema.Attribute.DateTime;
    shipped: Schema.Attribute.DateTime;
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
