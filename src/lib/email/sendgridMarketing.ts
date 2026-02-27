type MarketingContactInput = {
  email: string;
  firstName?: string;
  company?: string;
};

function parseListIds(value: string | undefined) {
  return (value ?? '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

async function getSendGridClient() {
  const mod = await import('@sendgrid/client');
  // @sendgrid/client is CJS in many setups; Next/TS ESM interop can expose either.
  const maybe = mod as unknown as Record<string, unknown>;
  const client = (maybe.default as unknown) ?? mod;
  return client as {
    setApiKey: (key: string) => void;
    request: (args: {
      method: string;
      url: string;
      body?: unknown;
    }) => Promise<[unknown, unknown]>;
  };
}

export async function upsertToMarketingListIfConfigured(
  contact: MarketingContactInput
) {
  const listIds = parseListIds(process.env.SENDGRID_MARKETING_LIST_IDS);
  if (listIds.length === 0) return { ok: false, skipped: true } as const;

  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) return { ok: false, skipped: true } as const;

  try {
    const client = await getSendGridClient();
    client.setApiKey(apiKey);

    const payload = {
      list_ids: listIds,
      contacts: [
        {
          email: contact.email,
          first_name: contact.firstName,
          company: contact.company
        }
      ]
    };

    await client.request({
      method: 'PUT',
      url: '/v3/marketing/contacts',
      body: payload
    });

    return { ok: true } as const;
  } catch {
    // Never block form submissions on marketing list sync.
    return { ok: false } as const;
  }
}
