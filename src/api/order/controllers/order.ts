/**
 * order controller
 */

import Stripe from 'stripe';
import { factories } from '@strapi/strapi';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default factories.createCoreController(
	'api::order.order',
	({ strapi }) => ({
		async webhook(ctx) {
			const sig = ctx.request.headers['stripe-signature'] as string;
			const rawBody = ctx.request.body[Symbol.for('unparsedBody')];

			let event: Stripe.Event;

			try {
				event = stripe.webhooks.constructEvent(
					rawBody,
					sig,
					process.env.STRIPE_WEBHOOK_SECRET!
				);
			} catch (err) {
				ctx.response.status = 400;
				return ctx.send(`Webhook Error: ${err.message}`);
			}

			if (event.type === 'payment_intent.succeeded') {
				const paymentIntent = event.data.object as Stripe.PaymentIntent;

				// Type-safe query using Strapi Entity Service
				const orders = await strapi.entityService.findMany('api::order.order', {
					filters: { stripePaymentIntentId: paymentIntent.id },
					populate: { timeline: true },
				});

				if (orders.length > 0) {
					const order = orders[0] as any; // Cast to your Order type

					await strapi.entityService.update('api::order.order', order.id, {
						data: {
							orderStatus: 'confirmed',
							timeline: {
								...order.timeline,
								confirmed: new Date().toISOString(),
							},
						},
					});
				}
			}

			ctx.send({ received: true });
		},
	})
);
