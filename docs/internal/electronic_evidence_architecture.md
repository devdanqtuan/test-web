# Internal Architecture Specification: Electronic Evidence & Checkout UX Control

> **CONFIDENTIAL & INTERNAL DEV TEAM USE ONLY**  
> *Do not publish publicly on the customer-facing website.*  
> Document Version: 1.0.0-INTERNAL  
> Effective Date: October 2026  
> Associated Service: Arcix Platform & Ecosystem Plugins  

---

## 1. Technical Evidentiary Architecture & Audit Logging Pipeline

The legal protections afforded by the Arcix SaaS Terms of Service are practically enforceable when tightly coupled with a technical telemetry architecture capable of collecting, generating, and exporting incontrovertible electronic evidence (*compelling evidence*) for bank representment and legal proceedings.

The dispute rebuttal (representment) procedures established by major card schemes (such as Visa and Mastercard) and payment processors / Merchants of Record (such as Lemon Squeezy / Stripe) require digital service providers to directly link the financial transaction to concrete proof of access fulfillment and verifiable usage telemetries. Merely submitting a static copy of the Terms of Service without behavioral tracking and fulfillment logs results in failure in the overwhelming majority of chargeback disputes.

Accordingly, Arcix implements an automated electronic audit logging pipeline that records essential data attributes the moment a user interacts with the system. This audit trail is rendered immutable and retained for a minimum of one hundred eighty (180) calendar days to align with the maximum dispute window permitted by card-issuing banks.

### Telemetry & Audit Evidence Matrix

| Evidence Category | Mandatory Captured Technical Data | Legal & Dispute Rebuttal Objective | Target Chargeback Reason Codes |
| :--- | :--- | :--- | :--- |
| **Consent Log** | Timestamp (UTC), IP Address, Device Fingerprint, Terms of Service Version Hash, Checkbox Click Coordinates. | Conclusively rebuts purchaser claims that they were uninformed of or did not agree to the Refund Policy. | Visa Reason Code 13.1 / 13.2 (Canceled Recurring Transaction). |
| **Fulfillment Log** | Timestamp of License Key issuance, automated transaction confirmation email logs, database storage allocation records. | Proves that the Provider fulfilled and provisioned the digital software service fully and immediately upon payment confirmation. | Visa Reason Code 13.5 (Misrepresentation). |
| **Activation Log** | First HTTP Request log, Login IP Address, Server Response Code (200 OK), User-Agent header, Consumed API token/quota count. | Conclusively proves that an Activation Event has occurred, irrevocably terminating the 3-day (Standard/Plugin) or 7-day (Pro/Team) refund privilege. | Mastercard Code 4853 (Goods/Services Not Delivered). |
| **Operational & SLA Log** | Certified system uptime reports, patch/hotfix deployment logs within the 14-business-day cure period, customer support ticketing transcripts. | Proves that the Provider properly exercised its exclusive Right-to-Cure and that the software did not suffer from an unaddressed Critical Defect. | Mastercard Code 4853 (Defective / Not as Described). |

---

## 2. Checkout User Experience (Checkout UX) & Clickwrap Implementation

Alongside the backend telemetry infrastructure, the Checkout UX design plays a decisive role in establishing legal enforceability. Courts and international financial arbiters strictly reject the legal validity of "browsewrap" agreements (a mechanism that merely places a passive hyperlink in the website footer).

Arcix strictly enforces a transparent **clickwrap** mechanism at the final checkout step:

1. **Unchecked Checkbox by Default:** Immediately above the final payment/checkout button, an unselected checkbox (`unchecked` by default) is prominently displayed.
2. **Conditional Activation:** The customer must actively and manually click this checkbox for the payment submission button to transition to an active/clickable state.
3. **Legible & Explicit Disclosure:** The accompanying disclosure text is rendered clearly in standard, legible font size, affirming:
   > *"I have read, understood, and unconditionally agree to the Arcix Terms of Service and Refund Policy. I acknowledge and agree that my right to a refund for the [Standard / Pro / Team / Plugin] plan immediately and permanently terminates once an Activation Event occurs on my account."*
4. **Hyperlinked Legal References:** The names of all referenced legal documents are directly hyperlinked to their complete, unabridged terms.

---

## 3. Statement Descriptor & Closed-Loop Defense Shield

Controlling the payment descriptor on bank card statements (**Statement Descriptor**) is a critical technical prerequisite to eliminate confusion-driven chargebacks where purchasers fail to recognize the transaction.

- The descriptor appearing on the customer's banking statement or card application must match identically with the commercial brand name **ARCIX** or the primary commercial SaaS domain (e.g., `LEMONSQ* ARCIX`), rather than using an individual developer's personal name or an unrelated internal repository codename.
- The coordinated synchronization between:
  1. Seller-protective contractual terms,
  2. Compliant clickwrap checkout interfaces, and
  3. Tamper-proof electronic audit logging pipelines
- Establishes a resilient, closed-loop defensive shield that maximally preserves the economic and operational interests of Arcix software services while remaining in full compliance with Lemon Squeezy Merchant of Record policies.
