/**
 * transaction controller
 */

import { factories } from '@strapi/strapi';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default factories.createCoreController(
	'api::transaction.transaction',
	({ strapi }) => ({
		async find(ctx) {
			try {
				const transactions = await stripe.paymentIntents.list({
					limit: 20,
					// CRITICAL: This expands the payment_method ID into a full object
					expand: ['data.payment_method'],
				});

				const formattedData = transactions.data.map(intent => {
					// Cast to Stripe.PaymentMethod because of the expansion
					const paymentMethod = intent.payment_method as Stripe.PaymentMethod;

					return {
						id: intent.id,
						amount: intent.amount / 100,
						currency: intent.currency.toUpperCase(),
						date: intent.created,
						brand: paymentMethod?.card?.brand || 'unknown',
						last4: paymentMethod?.card?.last4 || '****',
						status: intent.status,
					};
				});

				return { data: formattedData };
			} catch (err) {
				ctx.throw(500, err instanceof Error ? err.message : 'Stripe Error');
			}
		},
	})
);
