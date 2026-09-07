# JD Ops Desk (v2)

JD Ops Desk is an operational task and compliance tracking application built for Melbourne accounting practices.

## What v2 Adds

- **Metka Entity Pack**: One BAS compliance cell per entity for Metka non-group entities, replacing single client rows.
- **Fast Capture**: Quick-add items with active client auto-selection and instant pinning to today's priority plan.
- **Monday Books**: Weekly and monthly bookkeeping tracking tailored to Melbourne date rules and week codes.
- **Ask Desk**: AI assistant integration using Grok Fast for sitting ledger context and queries.

## Data Storage

- **Local IndexedDB**: All client data, obligations, and personal tasks are stored locally in IndexedDB (`ops-desk` database) with full snapshot import/export support.

## How to Run

### Development
```bash
npm run dev
```

### Running Tests
```bash
npm test
```
