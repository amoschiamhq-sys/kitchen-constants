# Kitchen Constants launch setup

This checklist covers the external accounts and settings needed before the public tip button and website hosting are finalised.

No passwords, payment details, recovery codes, API keys, or access tokens should be added to this repository or sent in chat.

## 1. Tip account

Recommended setup: Ko-fi connected to Stripe.

### Ko-fi

1. Create a free account at <https://ko-fi.com/>.
2. Choose a page name such as `kitchenconstants`, if available.
3. Set the profile name to `Kitchen Constants`.
4. Add this short description:

   > Practical cooking ratios and finish guidance with less guessing.

5. Use EUR as the currency and set a suggested tip amount such as €3.
6. Open the payment settings.
7. Turn Contributor mode off. Do not subscribe to Ko-fi Gold at this stage.
8. Connect Stripe from the Ko-fi payment settings.
9. Enable two-factor authentication.
10. Make a small test payment and check that the payment appears correctly.

### Stripe

1. Complete Stripe onboarding at <https://stripe.com/>, through Ko-fi's connection flow.
2. Answer the legal name, address, bank account, identity, business status, and tax questions truthfully.
3. Do not choose a business status simply to bypass a question.
4. Enable two-factor authentication.
5. Check the payout and refund settings.
6. Keep the Ko-fi page URL. It will be needed to activate the website button.

Start with Stripe only. Add PayPal later only if visitors specifically request it.

## 2. Cloudflare hosting

Recommended setup: Cloudflare Pages Free, with GitHub as the source repository.

1. Create a free account at <https://dash.cloudflare.com/>.
2. Verify the email address and enable two-factor authentication.
3. Choose the Free plan. Do not subscribe to Cloudflare Pro or a paid Workers plan.
4. Open **Workers & Pages**.
5. Select **Create application**, **Pages**, then **Connect to Git**.
6. Connect GitHub and grant access only to:

   `amoschiamhq-sys/kitchen-constants`

7. Use these project settings:

   | Setting | Value |
   |---|---|
   | Project name | `kitchen-constants` |
   | Production branch | `main` |
   | Framework preset | `None` |
   | Build command | Leave blank |
   | Output directory | `.` |
   | Environment variables | None |

8. Select **Save and Deploy**.
9. Test the generated `*.pages.dev` address on desktop and mobile.
10. Do not buy a custom domain until the free deployment works.

## 3. Optional custom domain

After the free site is working:

1. Open Cloudflare Domain Registration.
2. Search for the preferred domain and check both the first-year price and renewal price.
3. Buy the domain only after checking its availability and renewal cost.
4. Keep auto-renew on if you want to retain the domain.
5. Verify the registrant email.
6. In the Pages project, open **Custom domains** and select **Set up a custom domain**.

The domain extension determines the annual price. A custom domain is optional; the `pages.dev` address is enough for initial testing.

## 4. What to bring back to Codex

Once the accounts are ready, return with:

- The public Ko-fi page URL, for example `https://ko-fi.com/kitchenconstants`.
- The Cloudflare Pages URL, for example `https://kitchen-constants.pages.dev`.
- Whether you bought a custom domain, and the domain name only.
- Whether you want PayPal added later.
- Confirmation that you tested one tip payment and the deployed site.

Do not send login details or secret tokens. Codex can then add the real tip link, finish the deployment configuration, update the legal-page links if needed, run the final browser checks, and prepare the release push.

## Current local test

From the project folder, run:

```powershell
npm.cmd test
```

The current working version should pass all tests before any account or deployment work begins.
