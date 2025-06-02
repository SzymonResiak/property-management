# Property Management System

AWS serverless maintenance request prioritization using Lambda functions and DynamoDB.

## Priority Algorithm

The system classifies maintenance requests using keyword matching and point accumulation.

### Point System

- HIGH keywords: 5 points (emergency situations)
- MEDIUM keywords: 2 points (functional issues)
- LOW keywords: 1 point (cosmetic problems)

### Classification

Priority is determined by total points divided by 20: (20 would be extreme case which always would be high)

- HIGH: score >= 0.6 (12+ points)
- MEDIUM: score >= 0.3 (6-11 points)
- LOW: score < 0.3 (under 6 points)

### Example

Input: "Bathroom pipe burst, water everywhere!"

Found keywords:

- "burst" = 5 points (HIGH)
- "water" = 5 points (HIGH)
- "pipe" = 5 points (HIGH)

Total: 15 points, Score: 0.75, Result: HIGH priority

### Keywords

HIGH (5 points): leak, flood, burst, sewage, overflow, water, pipe, sparking, power outage, exposed wires, electrical, shock, blackout, electricity, broken window, roof leak, ceiling, collapse, crack, foundation, structural, gas leak, smoke detector, alarm, fire, emergency, dangerous, unsafe, urgent, no heat, frozen pipes, heating, freezing, cold, furnace

MEDIUM (2 points): broken, appliance, dishwasher, dryer, refrigerator, oven, stove, stuck, jammed, door, window, lock, noisy, loud, rattling, leaking, dripping, clogged

LOW (1 point): paint, cosmetic, scratch, minor, squeaky, squeak, touch-up, bulb, badly, sink

## Setup

### Prerequisites

- Node.js 18+
- AWS Account
- AWS CLI configured

### Installation

```bash
git clone
cd property-management
npm i
```

### AWS Configuration

```bash
aws configure
# Region: eu-central-1
```

**Or create `.env` file based on .env.example:**

```bash
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_DEFAULT_REGION=eu-central-1
```

### Deploy

```bash
npm run build
npm run deploy
```

## API

### POST /analyze

```json
{ "message": "Bathroom pipe burst, water everywhere!" }
```

Returns priority and keywords.

### POST /requests

```json
{ "tenantId": "apt101", "message": "Gas leak emergency!" }
```

### GET /requests

```
GET /requests
GET /requests?priority=high
```

## Architecture

- AWS Lambda + DynamoDB
- TypeScript with Serverless Framework
- Auto-created DynamoDB table (pay-per-request)
- Map-based keyword lookup

## Testing

```bash
npm test
```
