# Backend Tekshiruv Ro'yxati

## Muammo
Frontend'dan `GetProperty` GraphQL so'rovi yuborilganda backend "No data found!" xatosi qaytaryapti.

## Frontend'dan yuborilayotgan so'rov

### GraphQL Query:
```graphql
query GetProperty($input: String!) {
  getProperty(propertyId: $input) {
    _id
    propertyType
    propertyStatus
    # ... boshqa maydonlar
  }
}
```

### Variables:
```json
{
  "input": "6947e69939428107ec164e31"
}
```

## Backend'da tekshirish kerak bo'lgan narsalar:

### 1. GraphQL Resolver
- `getProperty` resolver'ida `propertyId` parametri to'g'ri qabul qilinayaptimi?
- `propertyId` string formatida kelayaptimi?

### 2. Database Query
- MongoDB'da property topilayaptimi?
- `_id` maydoni to'g'ri formatdamı? (ObjectId vs String)
- Property `deletedAt` maydoni to'ldirilganmi? (o'chirilgan property'lar)
- Property `propertyStatus` qanday? (faqat faol property'lar qaytariladimi?)

### 3. Muammo bo'lishi mumkin bo'lgan holatlar:

#### A. ID Format Muammosi
```javascript
// Backend'da ObjectId ga o'tkazish kerak bo'lishi mumkin
const propertyId = new ObjectId(input); // yoki
const property = await Property.findById(input);
```

#### B. Deleted Property Filter
```javascript
// Backend'da deletedAt tekshiruvi
const property = await Property.findOne({
  _id: propertyId,
  deletedAt: null // yoki undefined
});
```

#### C. Status Filter
```javascript
// Faqat faol property'lar qaytariladimi?
const property = await Property.findOne({
  _id: propertyId,
  propertyStatus: 'ACTIVE' // yoki boshqa status
});
```

### 4. Backend Loglarni Tekshirish
Backend'da quyidagi loglarni qo'shing:
```javascript
// getProperty resolver'ida
console.log('[Backend] GetProperty called with:', {
  propertyId: args.propertyId,
  propertyIdType: typeof args.propertyId,
  propertyIdLength: args.propertyId?.length
});

const property = await Property.findById(args.propertyId);
console.log('[Backend] Property found:', property ? 'YES' : 'NO');
if (property) {
  console.log('[Backend] Property details:', {
    _id: property._id,
    deletedAt: property.deletedAt,
    propertyStatus: property.propertyStatus
  });
}
```

### 5. Test Qilish
Backend'da quyidagi property ID bilan test qiling:
- `6947e69939428107ec164e31` (frontend'dan kelayotgan ID)

### 6. GraphQL Schema Tekshiruvi
```graphql
type Query {
  getProperty(propertyId: String!): Property
  # yoki
  getProperty(propertyId: ID!): Property
}
```

## Yechimlar

### Variant 1: ID Format Muammosi
Agar backend ObjectId kutayotgan bo'lsa:
```javascript
// Frontend'da o'zgartirish kerak emas
// Backend'da o'zgartirish kerak:
const mongoose = require('mongoose');
const propertyId = mongoose.Types.ObjectId.isValid(input) 
  ? new mongoose.Types.ObjectId(input) 
  : input;
```

### Variant 2: Deleted Property Filter
Agar backend deleted property'larni qaytarmayotgan bo'lsa:
```javascript
// Backend'da filter qo'shing:
const property = await Property.findOne({
  _id: propertyId,
  deletedAt: { $exists: false } // yoki null
});
```

### Variant 3: Status Filter
Agar backend faqat faol property'larni qaytarayotgan bo'lsa:
```javascript
// Backend'da filter qo'shing:
const property = await Property.findOne({
  _id: propertyId,
  propertyStatus: { $in: ['ACTIVE', 'PUBLISHED'] } // kerakli statuslar
});
```

## Keyingi Qadamlar
1. Backend loglarini tekshiring
2. Database'da property mavjudligini tekshiring
3. GraphQL resolver'ni tekshiring
4. Property filterlarini tekshiring

