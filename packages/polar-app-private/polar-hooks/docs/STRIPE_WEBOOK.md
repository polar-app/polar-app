# subscription created

{
  "id": "evt_1Ef8K7JvJ2rsXwXzglnd1aIU",
  "object": "event",
  "api_version": "2019-05-16",
  "created": 1559061531,
  "data": {
    "object": {
      "id": "sub_F9RC2uQySCnZcN",
      "object": "subscription",
      "application_fee_percent": null,
      "billing": "send_invoice",
      "billing_cycle_anchor": 1559061531,
      "billing_thresholds": null,
      "cancel_at": null,
      "cancel_at_period_end": false,
      "canceled_at": null,
      "collection_method": "send_invoice",
      "created": 1559061531,
      "current_period_end": 1561739931,
      "current_period_start": 1559061531,
      "customer": "cus_F9RB6dZIxRMZXj",
      "days_until_due": 30,
      "default_payment_method": null,
      "default_source": null,
      "default_tax_rates": [],
      "discount": null,
      "ended_at": null,
      "items": {
        "object": "list",
        "data": [
          {
            "id": "si_F9RCuWgrUPmwkm",
            "object": "subscription_item",
            "billing_thresholds": null,
            "created": 1559061531,
            "metadata": {},
            "plan": {
              "id": "plan_F9Cgv6rpQtKHaJ",
              "object": "plan",
              "active": true,
              "aggregate_usage": null,
              "amount": 499,
              "billing_scheme": "per_unit",
              "created": 1559007558,
              "currency": "usd",
              "interval": "month",
              "interval_count": 1,
              "livemode": true,
              "metadata": {},
              "nickname": "Bronze",
              "product": "prod_F9Cg8AU7dnF9dA",
              "tiers": null,
              "tiers_mode": null,
              "transform_usage": null,
              "trial_period_days": null,
              "usage_type": "licensed"
            },
            "quantity": 1,
            "subscription": "sub_F9RC2uQySCnZcN",
            "tax_rates": []
          }
        ],
        "has_more": false,
        "total_count": 1,
        "url": "/v1/subscription_items?subscription=sub_F9RC2uQySCnZcN"
      },
      "latest_invoice": "in_1Ef8K7JvJ2rsXwXzYS9z8H57",
      "livemode": true,
      "metadata": {},
      "plan": {
        "id": "plan_F9Cgv6rpQtKHaJ",
        "object": "plan",
        "active": true,
        "aggregate_usage": null,
        "amount": 499,
        "billing_scheme": "per_unit",
        "created": 1559007558,
        "currency": "usd",
        "interval": "month",
        "interval_count": 1,
        "livemode": true,
        "metadata": {},
        "nickname": "Bronze",
        "product": "prod_F9Cg8AU7dnF9dA",
        "tiers": null,
        "tiers_mode": null,
        "transform_usage": null,
        "trial_period_days": null,
        "usage_type": "licensed"
      },
      "quantity": 1,
      "schedule": null,
      "start": 1559061531,
      "status": "active",
      "tax_percent": null,
      "trial_end": null,
      "trial_start": null
    }
  },
  "livemode": true,
  "pending_webhooks": 1,
  "request": {
    "id": "req_1rprAEgEAQLtn9",
    "idempotency_key": null
  },
  "type": "customer.subscription.created"
}

# subscription deleted

```json
{
  "id": "evt_1Ef8IQJvJ2rsXwXz0W4aGnPp",
  "object": "event",
  "api_version": "2019-05-16",
  "created": 1559061425,
  "data": {
    "object": {
      "id": "sub_F9CmbjT85AJTTw",
      "object": "subscription",
      "application_fee_percent": null,
      "billing": "send_invoice",
      "billing_cycle_anchor": 1559007880,
      "billing_thresholds": null,
      "cancel_at": null,
      "cancel_at_period_end": false,
      "canceled_at": 1559061425,
      "collection_method": "send_invoice",
      "created": 1559007880,
      "current_period_end": 1561686280,
      "current_period_start": 1559007880,
      "customer": "cus_F9Cl2g027wFvjq",
      "days_until_due": 30,
      "default_payment_method": null,
      "default_source": null,
      "default_tax_rates": [],
      "discount": null,
      "ended_at": 1559061425,
      "items": {
        "object": "list",
        "data": [
          {
            "id": "si_F9CmZPP0DLZb1S",
            "object": "subscription_item",
            "billing_thresholds": null,
            "created": 1559007881,
            "metadata": {},
            "plan": {
              "id": "plan_F9Cgv6rpQtKHaJ",
              "object": "plan",
              "active": true,
              "aggregate_usage": null,
              "amount": 499,
              "billing_scheme": "per_unit",
              "created": 1559007558,
              "currency": "usd",
              "interval": "month",
              "interval_count": 1,
              "livemode": true,
              "metadata": {},
              "nickname": "Bronze",
              "product": "prod_F9Cg8AU7dnF9dA",
              "tiers": null,
              "tiers_mode": null,
              "transform_usage": null,
              "trial_period_days": null,
              "usage_type": "licensed"
            },
            "quantity": 1,
            "subscription": "sub_F9CmbjT85AJTTw",
            "tax_rates": []
          }
        ],
        "has_more": false,
        "total_count": 1,
        "url": "/v1/subscription_items?subscription=sub_F9CmbjT85AJTTw"
      },
      "latest_invoice": "in_1EeuMmJvJ2rsXwXzvkYyhwYe",
      "livemode": true,
      "metadata": {},
      "plan": {
        "id": "plan_F9Cgv6rpQtKHaJ",
        "object": "plan",
        "active": true,
        "aggregate_usage": null,
        "amount": 499,
        "billing_scheme": "per_unit",
        "created": 1559007558,
        "currency": "usd",
        "interval": "month",
        "interval_count": 1,
        "livemode": true,
        "metadata": {},
        "nickname": "Bronze",
        "product": "prod_F9Cg8AU7dnF9dA",
        "tiers": null,
        "tiers_mode": null,
        "transform_usage": null,
        "trial_period_days": null,
        "usage_type": "licensed"
      },
      "quantity": 1,
      "schedule": null,
      "start": 1559007880,
      "status": "canceled",
      "tax_percent": null,
      "trial_end": null,
      "trial_start": null
    }
  },
  "livemode": true,
  "pending_webhooks": 1,
  "request": {
    "id": "req_hODSuOoW0qIWp9",
    "idempotency_key": null
  },
  "type": "customer.subscription.deleted"
}

```
