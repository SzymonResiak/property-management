# Property Management System

AWS serverless maintenance request prioritization using Lambda functions and DynamoDB storage.

## Setup

### Prerequisites

- Node.js 18+
- AWS Account
- AWS CLI installed and configured

### Installation

1. **Clone and install dependencies:**

```bash
git clone
cd property-management
npm i
```

2. **Configure AWS credentials:**

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your Secret Access Key
# Region: eu-central-1
```

**Or create `.env` file based on .env.example:**

```bash
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_DEFAULT_REGION=eu-central-1

```

3. **Build and deploy:**

```bash
npm run build
npm run deploy
```

After deployment, you'll get API endpoint URLs to test with.

## API

### Analyze message

```bash
POST /analyze
```

**Test body:**

```json
{ "message": "Bathroom pipe burst, water everywhere!" }
```

Returns priority (high/medium/low) and keywords.

### Submit request

```bash
POST /requests
```

**Test bodies:**

```json
{"tenantId": "apt101", "message": "Gas leak emergency!"}
{"tenantId": "apt102", "message": "Kitchen sink leaking badly"}
{"tenantId": "apt103", "message": "Paint touch-up needed"}
{"tenantId": "apt104", "message": "Dishwasher making loud noise"}
{"tenantId": "apt105", "message": "Squeaky door hinge"}
```

### Get requests

```bash
GET /requests
GET /requests?priority=high
```

## Test data

**High priority requests:**

```json
{"tenantId": "apt101", "message": "Gas leak emergency!"}
{"tenantId": "apt102", "message": "Power outage in entire building"}
{"tenantId": "apt103", "message": "Bathroom pipe burst, water everywhere!"}
{"tenantId": "apt104", "message": "Exposed wires sparking in living room"}
{"tenantId": "apt105", "message": "Smoke detector not working"}
{"tenantId": "apt106", "message": "No heat in apartment, freezing cold"}
```

**Medium priority requests:**

```json
{"tenantId": "apt201", "message": "Dishwasher making loud noisy sounds"}
{"tenantId": "apt202", "message": "Door handle stuck and jammed"}
{"tenantId": "apt203", "message": "Kitchen sink is leaking slowly"}
{"tenantId": "apt204", "message": "Broken refrigerator not cooling"}
{"tenantId": "apt205", "message": "Window won't close properly"}
```

**Low priority requests:**

```json
{"tenantId": "apt301", "message": "Paint touch-up needed in hallway"}
{"tenantId": "apt302", "message": "Squeaky door hinge needs oil"}
{"tenantId": "apt303", "message": "Light bulb replacement required"}
{"tenantId": "apt304", "message": "Minor scratch on wall needs fixing"}
{"tenantId": "apt305", "message": "Cosmetic repair needed"}
```

**Analysis test messages:**

```json
{"message": "Gas leak in kitchen - urgent!"}
{"message": "Dishwasher making noise"}
{"message": "Paint touch-up needed"}
{"message": "Power outage building"}
{"message": "Squeaky door hinge"}
{"message": "Bathroom flood emergency"}
```

## Architecture

- AWS Lambda + DynamoDB
- DynamoDB table auto-created during deployment (pay-per-request)
- TypeScript with Serverless Framework
- Keyword-based classification using Map lookup
- Server generates timestamps for security

## Testing

```bash
npm test
```

Priority logic:

- High (3pts): emergency keywords (leak, burst, gas, power outage)
- Medium (2pts): repair keywords (broken, stuck, noisy)
- Low (1pt): cosmetic keywords (paint, squeaky)
